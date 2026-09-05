"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load 3D background (no SSR)
const Hero3DBackground = dynamic(() => import("./3d/Hero3DBackground").then(m => m.Hero3DBackground), {
  ssr: false,
  loading: () => null,
});

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* 3D background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <Hero3DBackground />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          className="lg:col-span-7"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
            Available for work
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl sm:text-4xl lg:text-4xl font-display font-semibold text-foreground leading-[1.1] tracking-tight"
          >
            Full-stack engineer who ships{" "}
            <span className="text-gradient-primary">production systems.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 text-lg text-secondary font-body max-w-xl leading-relaxed"
          >
            Laravel and Next.js, with AI where it pays off. 50+ projects live, mostly in enterprise and SMB.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-medium hover:bg-primary/90 transition-all hover:gap-3"
            >
              View Featured Work
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest/50 text-foreground font-medium hover:bg-surface-container hover:border-foreground/20 transition-all"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        {/* Right: photo */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/hero-photo.jpg"
              alt="Ubim portrait"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
          </div>

          {/* Floating accent badge */}
          <motion.div
            className="absolute -bottom-3 -left-3 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl px-4 py-3 shadow-lg"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-[10px] uppercase tracking-wider text-secondary font-mono">Live now</div>
            <div className="text-sm font-semibold text-foreground font-display">uchat · 6 personas</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
