export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(244,241,232,0.12)",
        background: "var(--db-black)",
        padding: "3rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "1540px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
          color: "var(--db-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span>DB² · Dung Beetle Database</span>
        <span>Onthophagus taurus · Genome + Transcriptomics</span>
      </div>
    </footer>
  );
}