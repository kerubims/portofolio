import { ProjectCard } from "./ProjectCard";
import { StaggerContainer, StaggerItem, FadeIn } from "./motion/FadeIn";
import { listProjects, toPublic } from "@/lib/db";

export async function Projects() {
  const projects = listProjects().map(toPublic);
  return (
    <section id="work" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-2">Proyek Pilihan</div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
            Sistem yang saya kerjakan.
          </h2>
          <p className="mt-3 text-secondary font-body max-w-2xl">
            Semuanya jalan di produksi atau tahap uji coba — bukan demo data.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProjectCard project={p} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="mt-10 flex justify-center">
          <a
            href="https://github.com/kerubims"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-foreground transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>dan proyek lainnya di GitHub</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              aria-hidden
            >
              <path d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
