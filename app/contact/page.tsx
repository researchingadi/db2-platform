import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";
import { PI, COLLABORATORS, DEVS } from "@/lib/people";

export const metadata = {
  title: "Contact Us — DB²",
  description: "Contact the DB² help desk or the DB² team",
};

const HELP_EMAIL = "dungbeetledatabase@gmail.com";
// PI email is not stored in lib/people.ts (adding it would show it on the People page)
const PI_EMAIL = "pld59@msstate.edu";

const ADI = DEVS.find((d) => d.name === "Adi Singh")!;

type Row = {
  position: string;
  name: string;
  website?: string;
  affiliation: string;
  email: string;
};

const TEAMS: { team: string; rows: Row[] }[] = [
  {
    team: "Davidson Lab · Mississippi State University",
    rows: [
      {
        position: "PI",
        name: PI.name,
        website: PI.website,
        affiliation: PI.department,
        email: PI_EMAIL,
      },
      {
        position: "Bioinformatics Developer",
        name: ADI.name,
        affiliation: ADI.department,
        email: ADI.email,
      },
    ],
  },
  {
    team: "Collaborating Principal Investigators",
    rows: COLLABORATORS.map((c) => ({
      position: "Collaborating PI",
      name: c.name,
      website: c.website,
      affiliation: `${c.department}, ${c.institution}`,
      email: c.email,
    })),
  },
];

const bodyText: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  lineHeight: 1.7,
  color: "var(--db-stone)",
};

const inlineLink: React.CSSProperties = {
  color: "var(--db-cyan)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  overflowWrap: "anywhere",
};

function href(website: string) {
  return website.startsWith("http") ? website : `https://${website}`;
}

export default function ContactPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        {/* ── Header ── */}
        <AnimatedSection>
          <p className="db-eyebrow">DB² · Contact</p>
          <h1 className="arcade-title" style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}>
            Contact Us
          </h1>
        </AnimatedSection>

        {/* ── Help desk ── */}
        <AnimatedSection style={{ marginTop: "2.5rem", maxWidth: "860px" }}>
          <ul style={{ ...bodyText, margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.9rem" }}>
            <li>
              <strong style={{ color: "var(--db-cream)" }}>Help desk:</strong> To ask questions,
              point out any problem with content, or suggest improvements to DB², please email{" "}
              <a href={`mailto:${HELP_EMAIL}`} className="focus-ring" style={inlineLink}>
                {HELP_EMAIL}
              </a>
              .
            </li>
            <li>
              <strong style={{ color: "var(--db-cream)" }}>Software bugs:</strong> To report a bug,
              email{" "}
              <a href={`mailto:${HELP_EMAIL}`} className="focus-ring" style={inlineLink}>
                {HELP_EMAIL}
              </a>{" "}
              and include the page URL, the species you were viewing, what you expected, and what
              happened (a screenshot helps).
            </li>
          </ul>
        </AnimatedSection>

        {/* ── Team table ── */}
        <AnimatedSection style={{ marginTop: "3.5rem" }}>
          <h2
            className="arcade-title"
            style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.1rem)", marginBottom: "1.5rem" }}
          >
            DB² Team Contact Information
          </h2>

          <table className="contact-table">
            <caption className="sr-only">
              DB² team members grouped by team, with position, affiliation and e-mail
            </caption>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Person</th>
                <th scope="col">Affiliation</th>
                <th scope="col">E-Mail</th>
              </tr>
            </thead>
            {TEAMS.map(({ team, rows }) => (
              <tbody key={team}>
                <tr className="team-row">
                  <th scope="colgroup" colSpan={4}>
                    {team}
                  </th>
                </tr>
                {rows.map((r) => (
                  <tr key={r.name} className="person-row">
                    <td data-label="Position">{r.position}</td>
                    <th scope="row" data-label="Person">
                      {r.website ? (
                        <a
                          href={href(r.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring"
                        >
                          {r.name}
                        </a>
                      ) : (
                        r.name
                      )}
                    </th>
                    <td data-label="Affiliation">{r.affiliation}</td>
                    <td data-label="E-Mail">
                      <a href={`mailto:${r.email}`} className="focus-ring">
                        {r.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </AnimatedSection>
      </div>
    </PageShell>
  );
}
