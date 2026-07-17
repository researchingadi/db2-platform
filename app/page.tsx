"use client";

import PageShell from "@/components/site/PageShell";
import ScrollHero from "./components/home/ScrollHero";
import StatsBar from "./components/home/StatsBar";
import SpeciesSection from "./components/home/SpeciesSection";
import FeaturesSection from "./components/home/FeaturesSection";
import AssemblyCard from "./components/home/AssemblyCard";
import ClosingCTA from "./components/home/ClosingCTA";

export default function HomePage() {
  return (
    <PageShell padTop={false}>
      <ScrollHero />
      <StatsBar />
      <SpeciesSection />
      <FeaturesSection />
      <AssemblyCard />
      <ClosingCTA />
    </PageShell>
  );
}
