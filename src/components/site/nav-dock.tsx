"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Award, Briefcase, FolderGit2, GitPullRequest, House, Mail, UserRound } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Dock, type DockItem } from "@/components/watermelon/dock";
import { SwitchMode } from "@/components/watermelon/switch-mode";
import { profile } from "@/data/portfolio";

const SECTIONS: { id: string; label: string; Icon: DockItem["Icon"] }[] = [
  { id: "top", label: "Home", Icon: House },
  { id: "about", label: "About", Icon: UserRound },
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: FolderGit2 },
  { id: "open-source", label: "Open source", Icon: GitPullRequest },
  { id: "achievements", label: "Achievements", Icon: Award },
  { id: "contact", label: "Contact", Icon: Mail },
];

function GithubIcon(props: { className?: string }) {
  return <FaGithub className={props.className} />;
}

export function NavDock() {
  const [active, setActive] = useState<string>("top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const items: DockItem[] = [
    ...SECTIONS.map((s) => ({
      id: s.id,
      label: s.label,
      Icon: s.Icon,
      className: s.id === "top" ? "hidden sm:block" : undefined,
      onClick: () => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }),
    })),
    { id: "github", label: "GitHub", Icon: GithubIcon, href: profile.github, className: "hidden sm:block" },
  ];

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-linear-to-r from-flesh via-amber-400 to-rind"
        style={{ scaleX: progress }}
      />
      <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6">
        <Dock
          items={items}
          activeId={active}
          trailing={<SwitchMode width={52} height={26} />}
        />
      </div>
    </>
  );
}
