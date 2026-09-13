"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "6", label: "Systems built & maintained" },
  { value: "3+", label: "Years of professional experience" },
  { value: "3", label: "Sectors served: gov, edu, SME" },
  { value: "100%", label: "Deployed & maintained myself" },
];

function Counter({ value, inView }: { value: string; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="text-3xl sm:text-4xl font-display font-semibold text-foreground"
    >
      {value}
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 border-y border-outline-variant/40" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Counter value={s.value} inView={inView} />
            <div className="text-xs uppercase tracking-wider text-secondary font-mono leading-relaxed">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
