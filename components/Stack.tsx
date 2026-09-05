import { StackIcon } from "./StackIcon";
import { FadeIn, StaggerContainer, StaggerItem } from "./motion/FadeIn";
import { stackItems } from "@/data/stack";

export function Stack() {
  return (
    <section id="stack" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-10">
          <div className="text-[11px] uppercase tracking-widest text-secondary font-mono mb-2">Tooling</div>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-foreground">
            Stack &amp; Tools
          </h2>
          <p className="mt-3 text-secondary font-body max-w-2xl">
            Production-tested across 50+ projects. I pick boring technology that ships.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stackItems.map((item) => (
            <StaggerItem key={item.slug}>
              <StackIcon item={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
