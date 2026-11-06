import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { NavDock } from "@/components/site/nav-dock";
import { Projects } from "@/components/site/projects";
import { About, Achievements, Experience, OpenSource, Skills } from "@/components/site/sections";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <OpenSource />
      <Achievements />
      <Skills />
      <Contact />
      <NavDock />
    </main>
  );
}
