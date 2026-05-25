export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-12">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Dung Beetle Database
        </p>
        <h1 className="mt-4 text-5xl font-bold">DB²</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          A modern genome and transcriptomics database for Onthophagus taurus.
        </p>
        <a
          href="/genome-browser"
          className="mt-8 inline-flex rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Open Genome Browser
        </a>
      </section>
    </main>
  );
}