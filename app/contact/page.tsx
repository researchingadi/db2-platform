import Link from "next/link";
import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Contact Us — DB²",
  description: "Contact the Davidson Lab about DB² data, bugs, or collaboration",
};

/* Card styling mirrors PersonCard on the People page */
function ContactCard({
  heading,
  accent,
  accentRgb,
  children,
}: {
  heading: string;
  accent: string;
  accentRgb: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="db-glass"
      style={{
        padding: "1.4rem",
        borderRadius: "20px",
        borderColor: `rgba(${accentRgb}, 0.22)`,
        position: "relative",
        overflow: "hidden",
        height: "100%",
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
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          fontSize: "0.68rem",
          color: accent,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: "0 0 0.9rem",
        }}
      >
        {heading}
      </h2>
      {children}
    </div>
  );
}

const nameStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 700,
  fontSize: "0.95rem",
  color: "var(--db-cream)",
  margin: "0 0 0.1rem",
  letterSpacing: "-0.025em",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.78rem",
  color: "var(--db-stone)",
  marginBottom: "0.5rem",
};

const metaStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.78rem",
  color: "var(--db-muted)",
  marginBottom: "0.15rem",
};

const locationStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.65rem",
  color: "var(--db-muted)",
  letterSpacing: "0.04em",
  opacity: 0.7,
  marginBottom: "0.75rem",
};

const noteStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.85rem",
  color: "var(--db-stone)",
  lineHeight: 1.68,
  margin: "0.8rem 0 0",
};

function linkStyle(color: string): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color,
    letterSpacing: "0.03em",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    width: "fit-content",
  };
}

export default function ContactPage() {
  return (
    <PageShell>
      {/* ── Header ── */}
      <section
        style={{
          borderBottom: "1px solid rgba(0,240,255,0.12)",
        }}
      >
        <div
          style={{
            maxWidth: "1540px",
            margin: "0 auto",
            padding: "4rem 1.25rem 2.5rem",
          }}
        >
          <AnimatedSection>
            <p className="db-eyebrow">DB² · Contact</p>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "var(--db-cream)",
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Contact Us
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "var(--db-stone)",
                marginTop: "10px",
                maxWidth: "520px",
              }}
            >
              Questions about the data, found a bug, or want to collaborate?
              Reach out to the Davidson Lab.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Cards ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <AnimatedSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.75rem",
            }}
          >
            <ContactCard
              heading="General inquiries & collaboration"
              accent="var(--db-cyan)"
              accentRgb="0,240,255"
            >
              <h3 style={nameStyle}>Dr. Philip L. Davidson</h3>
              <div style={titleStyle}>Principal Investigator</div>
              <div style={metaStyle}>Department of Biological Sciences</div>
              <div style={metaStyle}>Mississippi State University</div>
              <div style={locationStyle}>Starkville, MS, USA</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <a
                  href="mailto:pld59@msstate.edu"
                  className="focus-ring"
                  style={linkStyle("var(--db-cyan)")}
                >
                  pld59@msstate.edu
                </a>
                <a
                  href="https://davidsonlab-msu.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring"
                  style={linkStyle("var(--db-stone)")}
                >
                  davidsonlab-msu.github.io
                </a>
              </div>
            </ContactCard>

            <ContactCard
              heading="Website & technical issues"
              accent="var(--db-violet)"
              accentRgb="141,124,255"
            >
              <h3 style={nameStyle}>Adi Singh</h3>
              <div style={titleStyle}>Bioinformatics Developer</div>
              <a
                href="mailto:as5142@msstate.edu"
                className="focus-ring"
                style={linkStyle("var(--db-violet)")}
              >
                as5142@msstate.edu
              </a>
              <p style={noteStyle}>Report bugs, broken links, or data problems on the site.</p>
            </ContactCard>

            <ContactCard
              heading="Collaborating PIs"
              accent="var(--db-green)"
              accentRgb="73,255,182"
            >
              <p style={{ ...noteStyle, marginTop: 0 }}>
                Contact details for our collaborating PIs are on the{" "}
                <Link href="/people" className="focus-ring" style={{ color: "var(--db-green)", textUnderlineOffset: "3px" }}>
                  People page
                </Link>
                .
              </p>
            </ContactCard>
          </div>
        </AnimatedSection>
      </div>
    </PageShell>
  );
}
