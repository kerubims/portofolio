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

      {/* Footer: live link + view */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Buka situs live: ${project.title}`}
            className="inline-flex items-center gap-1 text-[11px] font-code text-secondary hover:text-primary truncate max-w-[200px] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span className="truncate">{project.liveUrl}</span>
          </a>
        ) : (
          <code className="text-[11px] text-secondary font-code truncate max-w-[200px]" title={project.path}>
            {project.path}
          </code>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="btn-sweep inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:text-white active:scale-[0.99]"
        >
          Detail
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}
