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
  accent: "#00f0ff",
  accentRgb: "0,240,255",
};

/* Placeholder team members — not real people */
const COLLABORATORS = [
  {
    name: "Collaborator A",
    role: "Genome Assembly",
    affiliation: "Placeholder affiliation",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
  },
  {
    name: "Collaborator B",
    role: "Bioinformatics",
    affiliation: "Placeholder affiliation",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
  },
];

const STUDENTS = [
  {
    name: "Graduate Student A",
    role: "PhD Student — Genomics",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
  },
  {
    name: "Graduate Student B",
    role: "PhD Student — RNA-seq",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
  },
  {
    name: "Undergraduate A",
    role: "Undergraduate Researcher",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
  },
];

const DEVS = [
  {
    name: "Platform Developer",
    role: "Full-stack · DB² Platform",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
  },
];

function PersonCard({
  name,
  role,
  affiliation,
  description,
  accent,
  accentRgb,
  large = false,
}: {
  name: string;
  role: string;
  affiliation?: string;
  description?: string;
  accent: string;
  accentRgb: string;
  large?: boolean;
}) {
  return (
    <div
      className="db-glass"
      style={{
        padding: large ? "1.8rem" : "1.4rem",
        borderRadius: "20px",
        borderColor: `rgba(${accentRgb}, 0.22)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${accent}, transparent 70%)`,
          opacity: 0.65,
        }}
      />

      {/* Avatar */}
      <div
        style={{
          width: large ? "60px" : "46px",
          height: large ? "60px" : "46px",
          borderRadius: "50%",
          background: `rgba(${accentRgb}, 0.12)`,
          border: `1px solid rgba(${accentRgb}, 0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: large ? "1.5rem" : "1.1rem",
          marginBottom: "1rem",
        }}
      >
        🪲
      </div>

      <h3
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: large ? "1.1rem" : "0.95rem",
          color: "var(--db-cream)",
          margin: "0 0 0.25rem",
          letterSpacing: "-0.025em",
        }}
      >
        {name}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: accent,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: affiliation ? "0.3rem" : 0,
        }}
      >
        {role}
      </div>
      {affiliation && (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--db-muted)",
            marginBottom: description ? "0.8rem" : 0,
          }}
        >
          {affiliation}
        </div>
      )}
      {description && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--db-stone)",
            lineHeight: 1.68,
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.25rem",
      }}
    >
      <div
        style={{
          width: "3px",
          height: "18px",
          borderRadius: "2px",
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "0.68rem",
          color: "var(--db-muted)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {label}
      </h2>
    </div>
  );
}

export default function PeoplePage() {
  return (
    <PageShell>
      {/* ── Hero ── */}
      <div
        style={{
          padding: "6rem 1.25rem 4rem",
          borderBottom: "1px solid var(--db-line)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 35% 60%, rgba(73,255,182,0.06), transparent 38%), var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <AnimatedSection>
            <p className="db-eyebrow" style={{ color: "var(--db-green)" }}>
              DB² · Team
            </p>
            <h1
              className="db-section-title"
              style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)" }}
            >
              People
            </h1>
            <p className="db-section-copy" style={{ marginTop: "1.25rem" }}>
              The researchers, students, and developers building the DB² platform
              and advancing{" "}
              <em style={{ color: "var(--db-stone)", fontStyle: "italic" }}>
                Onthophagus taurus
              </em>{" "}
              genomics.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        {/* PI */}
        <AnimatedSection style={{ marginBottom: "3.5rem" }}>
          <SectionLabel label="Principal Investigator" accent="var(--db-cyan)" />
          <div style={{ maxWidth: "560px" }}>
            <PersonCard {...PI} large />
          </div>
        </AnimatedSection>

        {/* Collaborators */}
        <AnimatedSection style={{ marginBottom: "3.5rem" }}>
          <SectionLabel label="Collaborators" accent="var(--db-violet)" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {COLLABORATORS.map((c) => (
              <PersonCard key={c.name} {...c} />
            ))}
          </div>
        </AnimatedSection>

        {/* Students */}
        <AnimatedSection style={{ marginBottom: "3.5rem" }}>
          <SectionLabel label="Student Researchers" accent="var(--db-green)" />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              color: "var(--db-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Placeholder — details to be added
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {STUDENTS.map((s) => (
              <PersonCard key={s.name} {...s} />
            ))}
          </div>
        </AnimatedSection>

        {/* Developers */}
        <AnimatedSection>
          <SectionLabel label="Platform Development" accent="var(--db-violet)" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {DEVS.map((d) => (
              <PersonCard key={d.name} {...d} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </PageShell>
  );
}
