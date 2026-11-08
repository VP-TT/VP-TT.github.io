"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Award, Briefcase, FileCode2, FolderGit2, GitPullRequest, House, Mail, Search, UserRound } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { CommandSearch, type CommandItem } from "@/components/watermelon/command-search";
import { Dock, type DockItem } from "@/components/watermelon/dock";
import { profile, projects } from "@/data/portfolio";
import { scrollToId } from "./smooth-scroll";

const SECTIONS = [
  { id: "top", label: "Home", Icon: House },
  { id: "about", label: "About", Icon: UserRound },
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "open-source", label: "Open source", Icon: GitPullRequest },
  { id: "achievements", label: "Achievements", Icon: Award },
  { id: "contact", label: "Contact", Icon: Mail },
];

function openProject(slug: string) {
  scrollToId("projects");
  setTimeout(() => window.dispatchEvent(new CustomEvent("open-card", { detail: slug })), 900);
}

/** Bottom dock (appears after the hero), scroll progress bar and the ⌘K command palette. */
export function NavDock({ paletteOpen, setPaletteOpen }: { paletteOpen: boolean; setPaletteOpen: (o: boolean) => void }) {
  const [active, setActive] = useState("top");
  const [showDock, setShowDock] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => scrollY.on("change", (y) => setShowDock(y > window.innerHeight * 0.6)), [scrollY]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const dockItems: DockItem[] = [
    ...SECTIONS.map((s) => ({
      id: s.id,
      label: s.label,
      Icon: s.Icon,
      className: s.id === "top" ? "hidden sm:block" : undefined,
      onClick: () => scrollToId(s.id),
    })),
    { id: "search", label: "Search  ⌘K", Icon: Search, onClick: () => setPaletteOpen(true) },
  ];

  const commands: CommandItem[] = useMemo(
    () => [
      ...SECTIONS.map((s) => ({ id: `go-${s.id}`, title: s.label, section: "Go to", icon: <s.Icon size={16} />, action: () => scrollToId(s.id) })),
      ...projects
        .filter((p) => !p.hidden)
        .map((p) => ({
          id: `p-${p.slug}`,
          title: p.name,
          section: "Projects",
          hint: p.media?.video ? "demo video" : undefined,
          keywords: `${p.oneLiner} ${p.stack.join(" ")}`,
          icon: <FileCode2 size={16} />,
          action: () => openProject(p.slug),
        })),
      { id: "l-gh", title: "GitHub", section: "Links", icon: <FaGithub size={15} />, action: () => window.open(profile.github, "_blank") },
      { id: "l-li", title: "LinkedIn", section: "Links", icon: <FaLinkedin size={15} />, action: () => window.open(profile.linkedin, "_blank") },
      { id: "l-mail", title: "Email me", section: "Links", hint: profile.email, icon: <Mail size={16} />, action: () => (window.location.href = `mailto:${profile.email}`) },
    ],
    [],
  );

  return (
    <>
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-linear-to-r from-flesh via-amber-400 to-rind" style={{ scaleX: progress }} />
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6"
          >
            <Dock items={dockItems} activeId={active} />
          </motion.div>
        )}
      </AnimatePresence>
      <CommandSearch items={commands} open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
