import Navbar from "./Navbar";
import Footer from "./Footer";

type PageShellProps = {
  children: React.ReactNode;
  padTop?: boolean;
};

export default function PageShell({ children, padTop = true }: PageShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--db-black)",
        color: "var(--db-cream)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flex: 1, paddingTop: padTop ? "72px" : 0 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}