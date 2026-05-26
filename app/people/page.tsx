import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "People — DB²",
  description: "Davidson Lab team members and contributors to the DB² platform",
};

const PI = {
  name: "Dr. Philip Davidson",
  role: "Principal Investigator",
  affiliation: "Davidson Lab",
  description:
    "Dr. Davidson leads the laboratory studying developmental plasticity, genome evolution, and the molecular basis of alternative phenotypes in dung beetles.",
  accent: "#22d3ee",
};

/* Placeholder team members — not real people */
const COLLABORATORS = [
  { name: "Collaborator A", role: "Genome Assembly", affiliation: "Placeholder affiliation", accent: "#818cf8" },
  { name: "Collaborator B", role: "Bioinformatics",  affiliation: "Placeholder affiliation", accent: "#10b981" },
];

const STUDENTS = [
  { name: "Graduate Student A", role: "PhD Student — Genomics",     accent: "#22d3ee" },
  { name: "Graduate Student B", role: "PhD Student — RNA-seq",      accent: "#818cf8" },
  { name: "Undergraduate A",    role: "Undergraduate Researcher",   accent: "#10b981" },
];

const DEVS = [
  { name: "Platform Developer", role: "Full-stack · DB² Platform", accent: "#818cf8" },
];

function PersonCard({
  name,
  role,
  affiliation,
  description,
  accent,
  large = false,
}: {
  name: string;
  role: string;
  affiliation?: string;
  description?: string;
  accent: string;
  large?: boolean;
}) {
  return (
    <div style={{
      padding: large ? "2rem" : "1.5rem",
      borderRadius: "14px",
      background: "rgba(9,13,26,0.8)",
      border: `1px solid ${accent}25`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.7,
      }} />

      {/* Avatar placeholder */}
      <div style={{
        width: large ? "64px" : "48px",
        height: large ? "64px" : "48px",
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
        border: `1px solid ${accent}35`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: large ? "1.6rem" : "1.2rem",
        marginBottom: "1rem",
      }}>
        🪲
      </div>

      <h3 style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 700,
        fontSize: large ? "1.15rem" : "0.95rem",
        color: "#e2e8f0",
        margin: "0 0 4px",
      }}>
        {name}
      </h3>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.72rem",
        color: accent,
        letterSpacing: "0.05em",
        marginBottom: affiliation ? "4px" : "0",
      }}>
        {role}
      </div>
      {affiliation && (
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.78rem",
          color: "#475569",
          marginBottom: description ? "12px" : "0",
        }}>
          {affiliation}
        </div>
      )}
      {description && (
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.85rem",
          color: "#64748b",
          lineHeight: 1.65,
          margin: 0,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "1.25rem",
    }}>
      <div style={{ width: "3px", height: "20px", borderRadius: "2px", background: color }} />
      <h2 style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "#64748b",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        margin: 0,
      }}>
        {label}
      </h2>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <PageShell>
      <div style={{ background: "var(--db-bg)", minHeight: "calc(100vh - 64px)" }}>

        {/* ── Hero ── */}
        <div style={{
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid rgba(26,34,64,0.4)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            bottom: "-20%", left: "40%",
            width: "500px", height: "400px",
            background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
            <AnimatedSection>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#10b981",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>DB² · Team</p>
              <h1 style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#e2e8f0",
                letterSpacing: "-0.03em",
                margin: "0 0 1rem",
              }}>
                People
              </h1>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "#64748b",
                maxWidth: "50ch",
                lineHeight: 1.7,
              }}>
                The researchers, students, and developers building the DB² platform and
                advancing <em style={{ color: "#94a3b8" }}>Onthophagus taurus</em> genomics.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

          {/* PI */}
          <AnimatedSection style={{ marginBottom: "3rem" }}>
            <SectionLabel label="Principal Investigator" color="#22d3ee" />
            <div style={{ maxWidth: "600px" }}>
              <PersonCard {...PI} large />
            </div>
          </AnimatedSection>

          {/* Collaborators */}
          <AnimatedSection style={{ marginBottom: "3rem" }}>
            <SectionLabel label="Collaborators" color="#818cf8" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
            }}>
              {COLLABORATORS.map((c) => (
                <PersonCard key={c.name} {...c} />
              ))}
            </div>
          </AnimatedSection>

          {/* Students */}
          <AnimatedSection style={{ marginBottom: "3rem" }}>
            <SectionLabel label="Student Researchers" color="#10b981" />
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#475569",
              marginBottom: "1rem",
            }}>
              Placeholder — details to be added
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}>
              {STUDENTS.map((s) => (
                <PersonCard key={s.name} {...s} />
              ))}
            </div>
          </AnimatedSection>

          {/* Developers */}
          <AnimatedSection>
            <SectionLabel label="Platform Development" color="#818cf8" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}>
              {DEVS.map((d) => (
                <PersonCard key={d.name} {...d} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageShell>
  );
}
