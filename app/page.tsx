"use client";

import PageShell from "@/components/site/PageShell";
import ScrollHero from "./components/home/ScrollHero";
import IntroSection from "./components/home/IntroSection";
import StatsBar from "./components/home/StatsBar";
import SpeciesSection from "./components/home/SpeciesSection";
import FeaturesSection from "./components/home/FeaturesSection";
import AssemblyCard from "./components/home/AssemblyCard";
import ClosingCTA from "./components/home/ClosingCTA";

export default function HomePage() {
  return (
    <PageShell padTop={false}>
      <ScrollHero />
      <IntroSection />
      <StatsBar />
      <SpeciesSection />
      <FeaturesSection />
      <AssemblyCard />
      <ClosingCTA />
    </PageShell>
  );
}
