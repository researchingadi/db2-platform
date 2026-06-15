import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Directory — DB²",
  description: "Principal Investigators, Developers & Collaborators",
};

type Person = {
  initials: string;
  gradient: [string, string];
  badge: string;
  name: string;
  title?: string;
  department: string;
  institution: string;
  location: string;
  email?: string;
  website?: string;
  websiteLabel?: string;
};

const DAVIDSON_LAB: Person[] = [
  {
    initials: "PD",
    gradient: ["#6366f1", "#8b5cf6"],
    badge: "Principal Investigator",
    name: "Dr. Philip L. Davidson",
    title: "Assistant Professor",
    department: "Department of Biological Sciences",
    institution: "Mississippi State University",
    location: "Starkville, MS, USA",
    website: "https://davidsonlab-msu.github.io",
    websiteLabel: "davidsonlab-msu.github.io",
  },
  {
    initials: "AS",
    gradient: ["#06b6d4", "#0891b2"],
    badge: "Bioinformatics Developer",
    name: "Adi Singh",
    title: "Graduate Student",
    department: "Computer Science & Engineering",
    institution: "Mississippi State University",
    location: "Starkville, MS, USA",
  },
];

const COLLABORATING_PIS: Person[] = [
  {
    initials: "SC",
    gradient: ["#10b981", "#059669"],
    badge: "Collaborating PI",
    name: "Dr. Sofía Casasa",
    department: "Department of Biology",
    institution: "Boston University",
    location: "Boston, MA, USA",
    email: "ascasasa@bu.edu",
    website: "https://www.casasalab.com",
    websiteLabel: "casasalab.com",
  },
  {
    initials: "YH",
    gradient: ["#f59e0b", "#d97706"],
    badge: "Collaborating PI",
    name: "Dr. Yonggang Hu",
    department: "State Key Laboratory of Resource Insects",
    institution: "Southwest University",
    location: "Chongqing, China",
    email: "yongganghu@swu.edu.cn",
    website: "https://www.researchgate.net/profile/Yonggang-Hu-2",
    websiteLabel: "researchgate.net/profile/Yonggang-Hu-2",
  },
  {
    initials: "AM",
    gradient: ["#8b5cf6", "#6d28d9"],
    badge: "Collaborating PI",
    name: "Dr. Armin Moczek",
    department: "Department of Biology",
    institution: "Indiana University",
    location: "Bloomington, IN, USA",
    email: "armin@iu.edu",
    website: "https://www.ecoevodevo.com",
    websiteLabel: "ecoevodevo.com",
  },
  {
    initials: "PR",
    gradient: ["#ef4444", "#dc2626"],
    badge: "Collaborating PI",
    name: "Dr. Patrick Rohner",
    department: "Department of Ecology, Behavior & Evolution",
    institution: "University of California San Diego",
    location: "San Diego, CA, USA",
    email: "prohner@ucsd.edu",
    website: "https://rohnerlab.biosci.ucsd.edu",
    websiteLabel: "rohnerlab.biosci.ucsd.edu",
  },
];

function PersonCard({ person }: { person: Person }) {
  const [from, to] = person.gradient;
  return (
    <div className="dir-card">
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${from}, ${to})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Syne', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#ffffff",
            userSelect: "none",
          }}
        >
          {person.initials}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "2px" }}>
          <span className="dir-badge">{person.badge}</span>
          <p className="dir-name">{person.name}</p>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {person.title && <p className="dir-meta">{person.title}</p>}
        <p className="dir-meta">{person.department}</p>
        <p className="dir-meta">{person.institution}</p>
        <p className="dir-loc">
          <span style={{ fontSize: "12px" }}>📍</span>
          {person.location}
        </p>
      </div>

      {/* Links */}
      {(person.email || person.website) && (
        <div className="dir-links">
          {person.email && (
            <a href={`mailto:${person.email}`} className="dir-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {person.email}
            </a>
          )}
          {person.website && (
            <a href={person.website} target="_blank" rel="noreferrer" className="dir-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              {person.websiteLabel ?? person.website}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <PageShell>
      <div style={{ background: "#06081a", minHeight: "100vh", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom: "56px" }}>
            <p
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "#6366f1",
                margin: "0 0 10px",
              }}
            >
              DB² · People
            </p>
            <h1
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "28px",
                color: "#f1f5f9",
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              Directory
            </h1>
            <p
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
                fontSize: "15px",
                color: "#64748b",
                margin: 0,
              }}
            >
              Principal Investigators, Developers &amp; Collaborators
            </p>
          </div>

          {/* Davidson Lab */}
          <section style={{ marginBottom: "56px" }}>
            <h2 className="dir-section-label">Davidson Lab</h2>
            <div className="dir-grid-2">
              {DAVIDSON_LAB.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </section>

          {/* Collaborating PIs */}
          <section>
            <h2 className="dir-section-label">Collaborating Principal Investigators</h2>
            <div className="dir-grid-2">
              {COLLABORATING_PIS.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
