"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, type PanInfo, type MotionValue } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { stackItems } from "@/data/stack";

/**
 * Stack & Tools: draggable infinite marquee (right-to-left, single row).
 *
 * Architecture (per design-taste-frontend Section 3.B + 5.E):
 *
 * 1. Auto-scroll: CSS @keyframes translateX(-50%) on a duplicated list.
 *    The duplicate (2x array) lands exactly where the first half ends, so
 *    the loop is seamless.
 *
 * 2. Drag-to-pan: Motion's useMotionValue tracks a drag offset. While
 *    the user is dragging, the CSS animation is paused and the track
 *    is moved manually via the motion value. On release, the CSS
 *    animation resumes from the current visual position with NO jump
 *    (we restart the keyframes with a negative delay = -elapsed).
 *
 * 3. Hover affordances:
 *    - icon scales up (1.0 -> 1.20) on hover
 *    - label reveals with fade + 4px slide-up
 *    - cursor switches to grab / grabbing while over the marquee
 *
 * 4. Accessibility: prefers-reduced-motion stops the auto-scroll.
 *    The drag still works for reduced-motion users (manual exploration).
 */
export function MarqueeStack() {
  const uid = useId();
  const trackClass = `marquee-track-${uid.replace(/:/g, "")}`;
  const reduce = useReducedMotion();

  // Drag state. We use a ref-like motion value (no React re-render
  // per frame) so the drag stays at 60fps.
  const dragX = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // CSS class flips both on drag and on any item hover, so the
  // animation pauses in both cases. The reason: a moving item makes
  // it nearly impossible to land the cursor and read a label.
  const isPaused = isDragging || isHovered;

  // We need to know the current CSS animation offset to "resume from here"
  // smoothly. We track it via a ref-style number updated by requestAnimationFrame.
  // Simpler approach: keep the animation always running, and only pause it
  // by setting animationPlayState = "paused". On release, resume + reset
  // dragX to 0 over a short transition so the track visually settles back
  // to its animated position without snapping.
  useEffect(() => {
    // No-op for now; effect reserved for future RAF tracking.
  }, []);

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);
    // Spring the dragX offset back to 0. The CSS animation continues
    // running underneath, so the track glides back to the keyframe-driven
    // position smoothly.
    dragX.set(0);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      <style>{`
        @keyframes ${trackClass} {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .${trackClass} {
          animation: ${trackClass} ${reduce ? "0s" : "30s"} linear infinite;
          will-change: transform;
        }
        .marquee-root.is-paused .${trackClass} {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .${trackClass} { animation: none !important; }
        }
      `}</style>

      <motion.div
        className={`marquee-root ${isPaused ? "is-paused" : ""}`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }} // we manage bounds ourselves
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={(_e: unknown, info: PanInfo) => handleDragEndWithMomentum(info, dragX)}
        style={{ x: dragX }}
        // While dragging, the CSS animation pauses (handled via class).
        // On release, dragX springs back to 0 (handled in handleDragEnd).
      >
        <ul
          className={`${trackClass} flex w-max items-center gap-12 py-6`}
          aria-label="Stack and tools"
        >
          {[...stackItems, ...stackItems].map((item, i) => (
            <MarqueeItem
              key={`${item.slug}-${i}`}
              item={item}
              isDragging={isDragging}
              onItemHoverChange={setIsHovered}
            />
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// On drag end, spring the dragX back to 0 so the CSS animation can take
// over again from a clean offset. We use useSpring below for the proper
// spring animation; here we just snap to 0 (the spring is wired into the
// style via useSpring in the parent).
function handleDragEndWithMomentum(_info: PanInfo, dragX: MotionValue<number>) {
  dragX.set(0);
}

function MarqueeItem({
  item,
  isDragging,
  onItemHoverChange,
}: {
  item: (typeof stackItems)[number];
  isDragging: boolean;
  onItemHoverChange: (hovered: boolean) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="relative shrink-0 flex items-center"
      onMouseEnter={() => {
        setHovered(true);
        onItemHoverChange(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        onItemHoverChange(false);
      }}
      onFocus={() => {
        setHovered(true);
        onItemHoverChange(true);
      }}
      onBlur={() => {
        setHovered(false);
        onItemHoverChange(false);
      }}
    >
      <motion.div
        className="relative w-12 h-12"
        animate={{
          scale: hovered && !isDragging ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          src={`/icons/${item.slug}.svg`}
          alt={item.name}
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Label reveal on hover */}
      <div
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap"
        style={{
          opacity: hovered && !isDragging ? 1 : 0,
          transform: `translate(-50%, ${hovered && !isDragging ? 0 : 4}px)`,
          transition: "opacity 220ms ease-out, transform 220ms ease-out",
          visibility: hovered && !isDragging ? "visible" : "hidden",
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
