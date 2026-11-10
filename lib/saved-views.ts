import { z } from "zod";
import { SAVED_VIEW_KINDS, savedViews as t } from "./db/schema";
import { SPECIES_CONFIGS, SPECIES_LIST } from "./jbrowse-config";
import { normalizeLocus } from "./locus";

/* Limits for saved genome-browser views. */
export const MAX_VIEWS_PER_USER = 500;
export const MAX_LABEL = 120;
export const MAX_NOTE = 500;
export const MAX_TRACKS = 30;

type TrackConf = { trackId?: unknown };

/** Track IDs a species really has: its configured tracks plus the reference sequence track. */
export function allowedTrackIds(speciesId: string): Set<string> {
  const cfg = SPECIES_CONFIGS[speciesId] as
    | { assembly: { sequence?: TrackConf }; tracks: TrackConf[] }
    | undefined;
  const ids = new Set<string>();
  if (!cfg) return ids;
  for (const t of cfg.tracks) if (typeof t.trackId === "string") ids.add(t.trackId);
  const ref = cfg.assembly.sequence?.trackId;
  if (typeof ref === "string") ids.add(ref);
  return ids;
}

export function speciesById(speciesId: string) {
  return SPECIES_LIST.find((s) => s.id === speciesId) ?? null;
}

export function defaultViewLabel(speciesId: string, locus: string) {
  const name = speciesById(speciesId)?.scientificName ?? speciesId;
  return `${name} · ${locus}`.slice(0, MAX_LABEL);
}

const locusField = z
  .string()
  .max(400)
  .transform((v, ctx) => {
    const n = normalizeLocus(v);
    if (!n) {
      ctx.addIssue({ code: "custom", message: "Invalid location. Use refname:start-end or refname:start..end." });
      return z.NEVER;
    }
    return n;
  });

const noteField = z
  .string()
  .trim()
  .max(MAX_NOTE, `Note must be at most ${MAX_NOTE} characters.`)
  .nullable()
  .optional()
  .transform((v) => (v ? v : null));

export const createViewSchema = z
  .object({
    kind: z.enum(SAVED_VIEW_KINDS),
    label: z.string().trim().max(MAX_LABEL, `Label must be at most ${MAX_LABEL} characters.`).optional(),
    note: noteField,
    speciesId: z.string().max(64),
    locus: locusField,
    trackIds: z
      .array(z.string().max(200))
      .max(MAX_TRACKS, `At most ${MAX_TRACKS} tracks can be saved.`)
      .optional()
      .default([]),
  })
  .superRefine((v, ctx) => {
    const species = speciesById(v.speciesId);
    if (!species) {
      ctx.addIssue({ code: "custom", path: ["speciesId"], message: "Unknown species." });
      return;
    }
    const allowed = allowedTrackIds(v.speciesId);
    const unknown = v.trackIds.filter((id) => !allowed.has(id));
    if (unknown.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["trackIds"],
        message: `Unknown track for this species: ${unknown.slice(0, 3).join(", ")}.`,
      });
    }
  });

export const updateViewSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, "Label can't be empty.")
      .max(MAX_LABEL, `Label must be at most ${MAX_LABEL} characters.`)
      .optional(),
    // undefined = leave the note alone; null or "" = clear it.
    note: z.string().trim().max(MAX_NOTE, `Note must be at most ${MAX_NOTE} characters.`).nullable().optional(),
  })
  .refine((v) => v.label !== undefined || v.note !== undefined, { message: "Nothing to update." });

export const idSchema = z.string().uuid();

/** Columns returned by the API (everything except user_id). */
export const viewColumns = {
  id: t.id,
  kind: t.kind,
  label: t.label,
  note: t.note,
  speciesId: t.speciesId,
  assemblyName: t.assemblyName,
  locus: t.locus,
  trackIds: t.trackIds,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
};

