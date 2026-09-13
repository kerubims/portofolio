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
          <motion.div variants={item} className="mb-5">
            <div className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-2">
              Kerubim Serafim Mahanaim · Engineer Full-Stack
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Saya bangun sistem informasi{" "}
            <span className="text-primary">yang dipakai kerja tiap hari.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-secondary leading-relaxed max-w-xl mb-8"
          >
            Kebanyakan Laravel dan Next.js, untuk kantor pemerintah, kampus, dan UMKM. Semuanya saya kerjakan sendiri dari server sampai fitur, live dan bisa Anda cek langsung di halaman ini.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Lihat Proyek Pilihan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant/60 text-foreground font-medium rounded-full hover:bg-surface-container transition-colors"
            >
              Hubungi Saya
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
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            {/* Hero photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-photo.jpg"
              alt="Foto Ubim, engineer full-stack"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom-to-top white fade gradient overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/50 to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
