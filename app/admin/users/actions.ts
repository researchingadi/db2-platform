"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { accountApprovedEmail, accountRejectedEmail, sendEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/session";

const decisionSchema = z.object({
  userId: z.string().trim().min(1).max(64),
  decision: z.enum(["approve", "reject"]),
});

export async function decideUser(formData: FormData): Promise<void> {
  // Authorisation is enforced here, on the server, not just by hiding buttons.
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin" || admin.status !== "approved") {
    throw new Error("Not authorized.");
  }

  const parsed = decisionSchema.safeParse({
    userId: formData.get("userId"),
    decision: formData.get("decision"),
  });
  if (!parsed.success) throw new Error("Invalid request.");
  const { userId, decision } = parsed.data;
  const status = decision === "approve" ? "approved" : "rejected";

  // Only pending users can be decided; the WHERE clause makes this idempotent.
  const [updated] = await db
    .update(schema.user)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(schema.user.id, userId), eq(schema.user.status, "pending")))
    .returning({ email: schema.user.email, name: schema.user.name });

  if (updated) {
    await sendEmail({
      to: updated.email,
      ...(status === "approved" ? accountApprovedEmail(updated) : accountRejectedEmail(updated)),
    });
  }

  revalidatePath("/admin/users");
}
