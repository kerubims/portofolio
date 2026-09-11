"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section id="contact" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground leading-tight">
          Let&apos;s ship something{" "}
          <span className="text-gradient-primary">real.</span>
        </h2>

        <p className="mt-4 text-secondary font-body max-w-xl mx-auto leading-relaxed">
          I work with enterprise teams and SMB owners who need code that runs, not slides.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:ubim@systems.dev"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-medium hover:gap-3 transition-all"
          >
            Send Email
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/60 bg-surface-container-lowest/50 text-foreground font-medium hover:bg-surface-container transition-all"
          >
            Schedule a call
          </a>
        </div>
      </motion.div>
    </section>
  );
}
