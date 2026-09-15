"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
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
const SPEED_PX_PER_SECOND = 60; // gentle drift base speed

export function MarqueeStack() {
  const uid = useId();
  const reduce = useReducedMotion();

  // The x offset of the track, in pixels. Negative = scrolled left.
  // This is now the SINGLE source of truth for position: it
  // receives both the auto-scroll increment (each frame) AND
  // Motion's drag+momentum spring output. They compose cleanly
  // because Motion uses the same `x` MotionValue.
  const x = useMotionValue(0);

  // Live loop width in pixels. We measure the track after mount so
  // we know how far one full loop travels.
  const trackRef = useRef<HTMLUListElement | null>(null);
  const loopWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  // Low-pass-filtered auto-scroll speed. We exponentially approach
  // -SPEED_PX_PER_SECOND with a 100ms time constant so the base
  // drift fades in smoothly after a drag (no sudden "the track
  // suddenly starts moving at 60px/s again" feel).
  const currentAutoSpeedRef = useRef(0);

  // Drag state.
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // The user's transient drag offset. We keep this as a MotionValue
  // (not a React ref) so that `useTransform` reactively recomputes
  // the composed x when it changes. A plain `useRef` would not
  // trigger re-computation - that was the previous "blink" bug
  // where the drag offset was applied once and then ignored.
  const dragDelta = useMotionValue(0);
  // The drag offset captured at the moment drag started, used to
  // compose with the live Motion drag offset.
  const dragStartX = useMotionValue(0);

  // The final transform is the auto-scroll x + the drag offset.
  // useTransform returns a MotionValue that reactively tracks the
  // sum, so the DOM only writes one transform per frame and every
  // change to either input is reflected.
  const composedX = useTransform(
    [x, dragDelta] as [MotionValue<number>, MotionValue<number>],
    (values) => (values[0] as number) + (values[1] as number)
  );

  // Measure loop width after mount. The list is duplicated 2x, so
  // the loop distance equals the sum of the first half's items and
  // gaps. We do NOT use `scrollWidth / 2` because that includes
  // trailing space from `w-max` / flex layout, which gives a
  // loop width that is larger than the visual content. Using that
  // wrong value makes the wrap-around jump by 24px every cycle -
  // a noticeable stutter. The accurate measurement is the sum
  // of the first N items' widths and the N-1 gaps between them.
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const ul = trackRef.current;
      const items = ul.querySelectorAll("li");
      const halfCount = items.length / 2;
      let width = 0;
      for (let i = 0; i < halfCount; i++) {
        width += items[i].getBoundingClientRect().width;
        if (i < halfCount - 1) {
          const a = items[i].getBoundingClientRect();
          const b = items[i + 1].getBoundingClientRect();
          width += b.left - a.right;
        }
      }
      loopWidthRef.current = width;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Drive the auto-scroll at ~60fps. The auto-scroll value
  // accumulates into the same `x` MotionValue that Motion's
  // drag+momentum uses, so they compose without conflict.
  //
  // Smoothness strategy:
  //
  // 1. We use a low-pass filter on the auto-scroll increment
  //    to avoid frame-rate dependent jitter. Instead of
  //    adding `speed * dt` directly (which can be 0 if the
  //    frame takes too long, or spiky if dt varies), we
  //    exponentially approach the target speed.
  //
  // 2. When Motion's drag is active, the drag value overrides
  //    the auto-scroll contribution naturally (we skip the
  //    auto-scroll add on those frames, see below).
  //
  // 3. On drag release, Motion's `dragTransition` runs a
  //    spring-decay that uses the release velocity to compute
  //    the inertia. This is the smoothest possible result
  //    because the spring is GPU-composited and frame-rate
  //    independent.
  useAnimationFrame((time, delta) => {
    if (reduce) return;
    if (lastTimeRef.current == null) {
      lastTimeRef.current = time;
      return;
    }
    const dt = Math.min(delta, 50); // clamp huge frame gaps (tab switch)

    // While dragging, don't accumulate auto-scroll - Motion's
    // drag is the source of truth and adding to it would fight.
    if (isDragging) {
      lastTimeRef.current = time;
      return;
    }

    // Smooth auto-scroll with a low-pass filter: target speed
    // is -SPEED_PX_PER_SECOND, we approach it exponentially
    // with a time constant of 100ms. This means: if the spring
    // from drag release just settled at velocity ~0, the auto-
    // scroll fades in smoothly instead of appearing as a sudden
    // -60px/s jump.
    const TIME_CONSTANT_MS = 100;
    const alpha = 1 - Math.exp(-dt / TIME_CONSTANT_MS);
    currentAutoSpeedRef.current +=
      (-SPEED_PX_PER_SECOND - currentAutoSpeedRef.current) * alpha;

    const dx = (currentAutoSpeedRef.current * dt) / 1000;
    const current = x.get();
    const width = loopWidthRef.current;
    if (width > 0) {
      let next = current + dx;
      // Wrap-around for infinite loop. Modulo into [-width, 0].
      // This works for both directions: leftward and rightward swipes.
      while (next <= -width) next += width;
      while (next > 0) next -= width;
      x.set(next);
    } else {
      x.set(current + dx);
    }
    lastTimeRef.current = time;
  });

  const handleDragStart = () => {
    setIsDragging(true);
    // While dragging, the auto-scroll speed is not added to x
    // (see useAnimationFrame guard). Reset our low-pass-filter
    // state so it picks up from 0 when the drag releases.
    currentAutoSpeedRef.current = 0;
    // Snapshot the current drag delta at drag start. Motion's
    // `onDrag` event passes `info.offset.x` as the cumulative
    // displacement since the gesture began, so we add our
    // current transient offset to it to compute the new total.
    dragStartX.set(dragDelta.get());
  };
  const handleDrag = (_e: unknown, info: { offset: { x: number } }) => {
    // info.offset.x is the cumulative drag since drag start.
    // Total transient offset = start snapshot + live delta.
    dragDelta.set(dragStartX.get() + info.offset.x);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    // Critical: absorb the drag delta into the base x so the
    // auto-scroll continues from the user's release point.
    // x.set(x.get() + dragDelta.get()) shifts the loop origin
    // by the drag distance. Then dragDelta = 0 means the
    // composed x is unchanged for that frame, so there is NO
    // visible jump - the next frame the auto-scroll just
    // keeps moving at its low-pass-filter speed.
    x.set(x.get() + dragDelta.get());
    dragDelta.set(0);
  };

  return (
    <div
      className="relative w-full overflow-hidden select-none pb-12"
      style={{
        // Edge fade, horizontal only. pb-12 on this wrapper reserves
        // room INSIDE the clipping box for the hover tooltip that
        // hangs below the 48px icons: the track box is only 96px tall
        // (py-6 + icon), while the tooltip bottom reaches ~108px, so
        // overflow-hidden used to slice the label. The padding extends
        // the clip box itself; the mask gradient is unaffected because
        // it is directionless along y.
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        // Cursor is set on the track (motion.ul) itself via the `cursor`
        // prop below, NOT on the wrapper, so the wrapper's default
        // cursor (the OS arrow) is what users see most of the time.
        // The track then changes to grab/grabbing only while actually
        // dragging. This avoids a permanent "grab" cursor that would
        // mislead users into thinking the section is drag-only and
        // would suppress the hover affordance on the icons.
        touchAction: "pan-y", // allow vertical page scroll, capture horizontal
      }}
    >
      <motion.ul
        ref={trackRef as unknown as React.Ref<HTMLUListElement>}
        className="flex w-max items-center gap-12 py-6"
        aria-label="Stack dan tools"
        drag="x"
        dragMomentum={true}
        // Motion's built-in momentum: spring-based inertia on
        // release. We customize the transition so the spring
        // gives a long, smooth glide (low stiffness + high
        // damping = slow oscillation = iOS-like settle).
        //
        // Tuning notes:
        // - max 1800px: a real flick can carry the track almost
        //   a full loop width before settling. Combined with
        //   the wrap-around, this feels like the track glides
        //   for "ages" before slowing down.
        // - min 200px: even a tiny tap-and-release produces a
        //   visible glide. Users never see a "did it register?"
        //   stop.
        // - bounceStiffness 80 / bounceDamping 18: very soft
        //   spring. The track barely overshoots and the residual
        //   oscillation is so small it reads as "still moving
        //   slowly" rather than a bounce.
        // - power 0.55: very gentle ease-out. The track loses
        //   velocity slowly (long tail). Compare to default 0.8
        //   which is "eager to stop" and 0.3 which is "drifts
        //   forever".
        // - restDelta 0.1: clean stop, no perceptible wobble.
        dragTransition={{
          power: 0.55,
          min: 200,
          max: 1800,
          bounceStiffness: 80,
          bounceDamping: 18,
          restDelta: 0.1,
        }}
        dragElastic={0.1}
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
        className="relative w-12 h-12 marquee-icon"
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

      {/* Label reveal on hover.
          Centering caveat (Tailwind v4): do NOT add -translate-x-1/2
          as a class here. In v4 that utility writes the standalone
          `translate` CSS property, which COMPOSES with the inline
          `transform` below instead of overriding it. The label would
          shift -50% twice and sit visibly left of the icon. The inline
          transform already handles centering plus the reveal slide. */}
      <div
        className="pointer-events-none absolute left-1/2 top-full mt-2 whitespace-nowrap"
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
