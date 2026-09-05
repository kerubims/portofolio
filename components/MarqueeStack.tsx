"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { stackItems } from "@/data/stack";

/**
 * Stack & Tools: draggable infinite marquee (right-to-left, single row).
 *
 * Architecture (per design-taste-frontend Section 3.B + 5.E):
 *
 * The previous version mixed CSS @keyframes with Motion drag, and that
 * fight over `transform` was the cause of the "stuck on mobile" bug.
 * Two layers writing to the same `transform` property on touch devices
 * means one of them always wins, the other gets ignored, and the result
 * feels frozen.
 *
 * This rewrite drives the entire loop from Motion (single source of
 * truth for `x`). Auto-scroll is a constant velocity added per frame,
 * drag offsets the same value, and the label/icon scale is a separate
 * animation that does not touch `transform` of the track.
 *
 * 1. Auto-scroll: `useAnimationFrame` increments a baseX motion value
 *    by `speed * dt` per frame. When the offset has travelled past
 *    the loop width, it wraps to 0 (modulo) so the row appears infinite.
 *
 * 2. Drag-to-pan: pointer/touch drag adds a transient offset
 *    (dragDelta). The base auto-scroll continues underneath, so when
 *    the user releases, the track is still moving at the same speed
 *    they had when they let go. The transient offset is removed in
 *    a single frame (no spring-back), so there is no visible jump.
 *
 * 3. Hover affordances:
 *    - icon scales up (1.0 -> 1.20) on hover
 *    - label reveals with fade + 4px slide-up
 *    - cursor switches to grab / grabbing while over the marquee
 *
 * 4. Accessibility: prefers-reduced-motion stops the auto-scroll.
 *    The drag still works for reduced-motion users (manual exploration).
 */
const SPEED_PX_PER_SECOND = 60; // gentle drift

export function MarqueeStack() {
  const uid = useId();
  const reduce = useReducedMotion();

  // The x offset of the track, in pixels. Negative = scrolled left.
  const x = useMotionValue(0);

  // Live loop width in pixels. We measure the track after mount so
  // we know how far one full loop travels.
  const trackRef = useRef<HTMLUListElement | null>(null);
  const loopWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);

  // Drag state.
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // dragDelta holds the user's drag offset on top of the auto-scroll.
  const dragDeltaRef = useRef(0);
  const dragStartXRef = useRef(0);

  // The final transform is the auto-scroll x + the drag offset.
  // useTransform returns a MotionValue that reactively tracks the
  // sum. We subscribe via the transform so the DOM only writes
  // one transform per frame.
  const composedX = useTransform(x, (v) => v + dragDeltaRef.current);

  // Measure loop width after mount. The list is duplicated 2x, so
  // total / 2 is one loop distance. We re-measure on resize too.
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      loopWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Drive the auto-scroll at ~60fps.
  useAnimationFrame((time, delta) => {
    if (reduce) return;
    if (lastTimeRef.current == null) {
      lastTimeRef.current = time;
      return;
    }
    const dt = Math.min(delta, 50); // clamp huge frame gaps (tab switch)
    const dx = SPEED_PX_PER_SECOND * (dt / 1000);
    const current = x.get();
    const width = loopWidthRef.current;
    if (width > 0) {
      // Move left (negative direction). Wrap when we've gone one
      // full loop so the duplicated list appears infinite.
      let next = current - dx;
      if (next <= -width) {
        next += width;
      }
      x.set(next);
    } else {
      x.set(current - dx);
    }
    lastTimeRef.current = time;
  });

  const handleDragStart = () => {
    setIsDragging(true);
    dragStartXRef.current = dragDeltaRef.current;
  };
  const handleDrag = (_e: unknown, info: { offset: { x: number } }) => {
    // info.offset.x is the cumulative drag since drag start.
    dragDeltaRef.current = dragStartXRef.current + info.offset.x;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    // Reset the drag offset in a single frame. The auto-scroll x
    // value has been ticking the whole time, so the track is still
    // moving smoothly from the same point. No jump, no spring-back.
    dragDeltaRef.current = 0;
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
        touchAction: "pan-y", // allow vertical page scroll, capture horizontal
      }}
    >
      <motion.ul
        ref={trackRef as unknown as React.Ref<HTMLUListElement>}
        className="flex w-max items-center gap-12 py-6"
        aria-label="Stack and tools"
        drag="x"
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ x: composedX, willChange: "transform" }}
      >
        {[...stackItems, ...stackItems].map((item, i) => (
          <MarqueeItem
            key={`${item.slug}-${i}`}
            item={item}
            isDragging={isDragging}
            onItemHoverChange={setIsHovered}
          />
        ))}
      </motion.ul>
    </div>
  );
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
      onPointerEnter={() => {
        setHovered(true);
        onItemHoverChange(true);
      }}
      onPointerLeave={() => {
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
