import { ProjectCard } from "./ProjectCard";
import { StaggerContainer, StaggerItem, FadeIn } from "./motion/FadeIn";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="work" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-2">Selected Work</div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
            Six projects, six real systems.
          </h2>
          <p className="mt-3 text-secondary font-body max-w-2xl">
            Each one is in production or pilot. No demo data, no vaporware.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProjectCard project={p} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
