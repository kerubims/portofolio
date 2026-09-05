"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

// WebGL fallback: always rendered (SSR-safe, no dependencies)
import { WebGLFallback } from "./3d/Hero3DBackground";

// R3F Canvas: lazy-loaded enhancement ONLY when WebGL works
const ThreeCanvas = dynamic(
  () => import("./3d/Hero3DBackground").then((m) => m.ThreeCanvas),
  { ssr: false, loading: () => null }
);

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
      {/* 3D background - WebGLFallback guaranteed, R3F enhancement optional */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <WebGLFallback />
        <ThreeCanvas />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <motion.div
          className="lg:col-span-7"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-6 border border-blue-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Available for work
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Full-stack engineer who ships{" "}
            <span className="text-primary">production systems.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-secondary leading-relaxed max-w-xl mb-8"
          >
            Laravel and Next.js, with AI where it pays off. 50+ projects live, mostly in enterprise and SMB.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              View Featured Work
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant/60 text-foreground font-medium rounded-full hover:bg-surface-container transition-colors"
            >
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        {/* Right: portrait card */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container shadow-2xl">
            {/* Hero photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-photo.jpg"
              alt="Portrait of Ubim, full-stack engineer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Floating activity card */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-secondary font-mono">Live now</div>
                <div className="text-sm font-medium">uchat - 6 personas</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
