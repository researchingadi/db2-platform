export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "var(--arcade-border) solid var(--db-cream)",
        background: "var(--db-black)",
        padding: "2.5rem 1.25rem",
      }}
    >
      <div
        className="arcade-label"
        style={{
          maxWidth: "1540px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          flexWrap: "wrap",
          color: "var(--db-stone)",
        }}
      >
        <span>DB² · Dung Beetle Database</span>
        <span>Onthophagus taurus · Genome + Transcriptomics</span>
      </div>
    </footer>
  );
}
