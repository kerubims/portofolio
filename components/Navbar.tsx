"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Tentang", href: "#about" },
  { label: "Proyek", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Kontak", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scroll-spy: section yang menyentuh pita tengah viewport jadi aktif.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
        // di atas semua section (area hero) -> tidak ada yang aktif
        const first = sections[0].getBoundingClientRect().top;
        if (first > window.innerHeight / 2) setActive("");
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav className="flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest/70 backdrop-blur-xl shadow-sm">
        {/* Brand mark */}
        <a href="#" className="flex items-center gap-2 px-2 py-1 text-sm font-semibold font-display">
          <span className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-on-primary text-[10px] font-bold">U</span>
          <span className="hidden sm:inline">ubim.dev</span>
        </a>

        {/* Center links */}
        <ul className="hidden md:flex items-center gap-0.5 ml-2">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary-container/70"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-secondary hover:text-foreground hover:bg-surface-container"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Trailing actions */}
        <div className="flex items-center gap-1 pl-2 ml-1 border-l border-outline-variant/40">
          <a
            href="mailto:ubimdonk@gmail.com"
            aria-label="Email"
            className="inline-flex items-center justify-center p-1.5 text-secondary hover:text-primary rounded-full hover:bg-primary-container/40 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </a>
          <a
            href={encodeURI("/CV_ATS_KERUBIM SERAFIM MAHANAIM.pdf")}
            download="CV_ATS_KERUBIM SERAFIM MAHANAIM.pdf"
            className="btn-sweep inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-foreground text-background rounded-full transition-colors hover:text-on-primary active:scale-[0.99]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="hidden sm:inline">Unduh CV</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="md:hidden ml-1 p-1.5 text-secondary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18 18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-auto w-fit flex flex-col gap-1 px-2 py-2 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest/95 backdrop-blur-xl shadow-sm"
        >
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-1.5 text-sm font-medium text-secondary hover:text-foreground hover:bg-surface-container rounded-lg"
              >
                {l.label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </motion.header>
  );
}
