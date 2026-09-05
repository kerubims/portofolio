"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { stackItems } from "@/data/stack";

/**
 * Stack & Tools marquee (right-to-left, single row, infinite loop).
 *
 * - Pure CSS keyframes for the continuous translateX motion
 * - Duplicate item list 2x so the seam is invisible (no visual "jump")
 * - On hover (any item): that item reveals its label with a smooth fade+slide
 * - Respects prefers-reduced-motion (stops scroll, still shows labels)
 * - Pause on hover (UX): scrolling freezes while pointer is over the track
 *
 * Marquee = the one allowed marquee on the page per design-taste-frontend
 * section 5 (max-one-per-page).
 */
export function MarqueeStack() {
  // useId ensures the keyframes/animation-name is unique if there are
  // multiple marquees on a page in the future.
  const uid = useId();
  const trackClass = `marquee-track-${uid.replace(/:/g, "")}`;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        // Two layered masks: soft fade-out on both edges so items don't
        // pop in/out at the boundary (smoother than a hard clip).
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ${trackClass} {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .${trackClass} {
          animation: ${trackClass} 30s linear infinite;
          will-change: transform;
        }
        .marquee-root:hover .${trackClass},
        .marquee-root:focus-within .${trackClass} {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .${trackClass} { animation: none; }
        }
      `}</style>

      <div className="marquee-root">
        <ul
          className={`${trackClass} flex w-max items-center gap-12 py-6`}
          aria-label="Stack and tools"
        >
          {/* Render the list twice so the -50% translateX produces a seamless loop. */}
          {[...stackItems, ...stackItems].map((item, i) => (
            <MarqueeItem key={`${item.slug}-${i}`} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function MarqueeItem({
  item,
}: {
  item: (typeof stackItems)[number];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="relative shrink-0 flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative w-12 h-12 transition-transform duration-300 ease-out hover:scale-110">
        <Image
          src={`/icons/${item.slug}.svg`}
          alt={item.name}
          width={48}
          height={48}
          className="w-full h-full object-contain"
          // No priority: this row is decorative on first paint; lazy is fine.
        />
      </div>

      {/*
        Label reveals on hover with a fade+slide-up.
        We render it always (kept in layout) but transform+opacity-gated so
        the transition stays smooth without remounting.
      */}
      <div
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap"
        style={{
          opacity: hovered ? 1 : 0,
          transform: `translate(-50%, ${hovered ? 0 : 4}px)`,
          transition: "opacity 220ms ease-out, transform 220ms ease-out",
          // Always render so transitions are smooth, but stay hidden until hover
          visibility: hovered ? "visible" : "hidden",
        }}
        aria-hidden={!hovered}
      >
        <div className="px-3 py-1.5 rounded-lg bg-foreground/95 text-background text-xs font-mono font-medium shadow-lg backdrop-blur-sm">
          {item.name}
        </div>
      </div>
    </li>
  );
}
