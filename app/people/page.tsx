import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";
import ReducedMotion from "@/components/site/ReducedMotion";
import { PI, COLLABORATORS, DEVS } from "@/lib/people";

export const metadata = {
  title: "People — DB²",
  description: "Davidson Lab team members and contributors to the DB² platform",
};

/*
 * Arcade styling note: lib/people.ts still carries hex `accent` values for the
 * old design (shared data, also used by /contact). Cards here ignore them and
 * use the section's token colour instead.
 */
function PersonCard({
  name,
  title,
  role,
  department,
  institution,
  location,
  email,
  website,
  image,
  description,
  large = false,
  tone = "var(--db-cyan)",
}: {
  name: string;
  title?: string;
  role: string;
  department?: string;
  institution?: string;
  location?: string;
  email?: string;
  website?: string;
  image?: string;
  description?: string;
  accent: string;
  accentRgb: string;
  large?: boolean;
  tone?: string;
}) {
  const avatarSize = large ? "88px" : "64px";
  const pad = large ? 24 : 20;
  return (
    <div
      className="arcade-panel"
      style={{
        padding: `0 ${pad}px ${pad}px`,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Avatar: square block (shown below the name bar via flex order; DOM order unchanged) */}
      <div
        style={{
          order: 1,
          width: avatarSize,
          height: avatarSize,
          background: "var(--db-black)",
          border: `var(--arcade-border) solid ${tone}`,
          boxShadow: "4px 4px 0 var(--db-black)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: large ? "1.6rem" : "1.2rem",
          marginBottom: "1rem",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : (
          <span>🪲</span>
        )}
      </div>

      {/* Name = title bar */}
      <h3
        className="arcade-panel__bar"
        style={{
          order: 0,
          margin: `0 -${pad}px 18px`,
          fontSize: large ? "0.68rem" : "0.6rem",
          lineHeight: 1.5,
        }}
      >
        {name}
      </h3>
      <div style={{ order: 2, display: "flex", flexDirection: "column" }}>
        {title && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--db-cream)",
              marginBottom: "0.35rem",
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "0.55rem",
            lineHeight: 1.6,
            color: tone,
            textTransform: "uppercase",
            marginBottom: "0.7rem",
          }}
        >
          {role}
        </div>
        {department && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "var(--db-stone)",
              marginBottom: "0.15rem",
            }}
          >
            {department}
          </div>
        )}
        {institution && (
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "var(--db-stone)",
              marginBottom: "0.15rem",
            }}
          >
            {institution}
          </div>
        )}
        {location && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              color: "var(--db-stone)",
              marginBottom: "0.85rem",
            }}
          >
            {location}
          </div>
        )}
        {(email || website) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              marginBottom: description ? "1rem" : 0,
            }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                className="auth-inline-link focus-ring"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  color: tone,
                  overflowWrap: "anywhere",
                  width: "fit-content",
                }}
              >
                {email}
              </a>
            )}
            {website && (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="auth-inline-link focus-ring"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                  color: "var(--db-cream)",
                  overflowWrap: "anywhere",
                  width: "fit-content",
                }}
              >
                {website}
              </a>
            )}
          </div>
        )}
        {description && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--db-stone)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
      </div>
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
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          width: "14px",
          height: "14px",
          background: accent,
          boxShadow: "3px 3px 0 var(--db-black)",
          flexShrink: 0,
        }}
      />
      <h2
        className="arcade-title"
        style={{
          fontSize: "clamp(0.8rem, 1.6vw, 1rem)",
          lineHeight: 1.4,
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
      <ReducedMotion>
        {/* ── Cinematic header ── */}
        <section
          style={{
            position: "relative",
            minHeight: "280px",
            overflow: "hidden",
            borderBottom: "var(--arcade-border) solid var(--db-cream)",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          >
            <source src="/directory-bg.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "2rem 1.25rem",
              maxWidth: "1540px",
              margin: "0 auto",
            }}
          >
            <AnimatedSection>
              {/* Solid panel keeps the header text readable over any video frame */}
              <div className="arcade-panel" style={{ padding: "20px 22px", maxWidth: "620px" }}>
                <p className="db-eyebrow">DB² · Team</p>
                <h1
                  className="arcade-title"
                  style={{
                    fontSize: "clamp(1.4rem, 3.2vw, 2rem)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  People
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--db-cream)",
                    marginTop: "14px",
                    marginBottom: 0,
                    maxWidth: "540px",
                  }}
                >
                  The researchers, students, and developers building the DB²
                  platform and advancing{" "}
                  <em style={{ fontStyle: "italic" }}>Onthophagus taurus</em>{" "}
                  genomics.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Content ── */}
        <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
          {/* PI */}
          <AnimatedSection style={{ marginBottom: "3.5rem" }}>
            <SectionLabel label="Principal Investigator" accent="var(--db-cyan)" />
            <div style={{ maxWidth: "600px" }}>
              <PersonCard {...PI} large tone="var(--db-cyan)" />
            </div>
          </AnimatedSection>

          {/* Collaborators */}
          <AnimatedSection style={{ marginBottom: "3.5rem" }}>
            <SectionLabel label="Collaborators" accent="var(--db-violet)" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
                gap: "24px",
              }}
            >
              {COLLABORATORS.map((c) => (
                <PersonCard key={c.name} {...c} tone="var(--db-violet)" />
              ))}
            </div>
          </AnimatedSection>

          {/* Developers */}
          <AnimatedSection>
            <SectionLabel label="Platform Development" accent="var(--db-green)" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
                gap: "24px",
              }}
            >
              {DEVS.map((d) => (
                <PersonCard key={d.name} {...d} tone="var(--db-green)" />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </ReducedMotion>
    </PageShell>
  );
}
