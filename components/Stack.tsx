import { FadeIn } from "./motion/FadeIn";
import { MarqueeStack } from "./MarqueeStack";

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
            Dipakai sehari-hari di sistem pemerintahan, kampus, dan ritel. Saya pilih teknologi yang membosankan tapi terbukti jalan.
          </p>
        </FadeIn>
      </div>

      {/* Full-bleed marquee lives outside the centered container so the
          right-to-left motion has room to breathe edge-to-edge. */}
      <FadeIn>
        <MarqueeStack />
      </FadeIn>
    </section>
  );
}
