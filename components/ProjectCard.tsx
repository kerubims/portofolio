"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { PublicProject } from "@/lib/db";

const toneMap = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
} as const;

const categoryTone = "bg-primary-container text-on-primary-container border-primary/20";

export function ProjectCard({ project, index = 0 }: { project: PublicProject; index?: number }) {
  return (
    <motion.article
      className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-xl"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Header: tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${categoryTone}`}>
          {project.category}
        </span>
        <span className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full border ${toneMap[project.statusTone] || toneMap.blue}`}>
          {project.status}
        </span>
      </div>

      {/* Title — clickable to detail page */}
      <h3 className="text-xl font-semibold font-display text-foreground">
        <Link href={`/projects/${project.slug}`} className="hover:underline decoration-2 underline-offset-4">
          {project.title}
        </Link>
      </h3>

      {/* Description */}
      <p className="text-sm text-secondary leading-relaxed font-body flex-1">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.techTags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-code px-2 py-0.5 rounded-md bg-surface-container text-secondary border border-outline-variant/40"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: path + view */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
        <code className="text-[11px] text-secondary font-code truncate max-w-[200px]" title={project.path}>
          {project.path}
        </code>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          View
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
