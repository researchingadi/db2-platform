import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageShellProps {
  children: React.ReactNode;
  /** extra top padding — set false for pages with their own hero that starts at the top */
  padTop?: boolean;
}

export default function PageShell({ children, padTop = true }: PageShellProps) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--db-bg)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: padTop ? "64px" : "0" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
