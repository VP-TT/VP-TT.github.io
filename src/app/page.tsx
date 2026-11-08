"use client";

import { useState } from "react";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { NavDock } from "@/components/site/nav-dock";
import { Projects } from "@/components/site/projects";
import { About, Achievements, Band, Experience, OpenSource, Skills } from "@/components/site/sections";
import { SmoothScroll } from "@/components/site/smooth-scroll";

export default function Home() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <main className="relative">
      <SmoothScroll />
      <Hero onOpenPalette={() => setPaletteOpen(true)} />
      <Band />
      <About />
      <Experience />
      <Projects />
      <OpenSource />
      <Achievements />
      <Skills />
      <Contact />
      <NavDock paletteOpen={paletteOpen} setPaletteOpen={setPaletteOpen} />
    </main>
  );
}
