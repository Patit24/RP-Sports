"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update inner dot instantly
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const updateTrail = () => {
      // Smooth interpolation (lerp) for the trailing ring
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;
      
      trailX += dx * 0.12;
      trailY += dy * 0.12;

      if (trail) {
        trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }

      requestAnimationFrame(updateTrail);
    };

    const animationId = requestAnimationFrame(updateTrail);
    window.addEventListener("mousemove", onMouseMove);

    // Hover effect on clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer")
      ) {
        cursor.classList.add("scale-150", "bg-lime-accent");
        cursor.classList.remove("bg-cyan-accent");
        trail.classList.add("scale-150", "border-lime-accent");
        trail.classList.remove("border-cyan-accent");
      } else {
        cursor.classList.remove("scale-150", "bg-lime-accent");
        cursor.classList.add("bg-cyan-accent");
        trail.classList.remove("scale-150", "border-lime-accent");
        trail.classList.add("border-cyan-accent");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-accent pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out hidden md:block"
      />
      {/* Outer ring */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-accent pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out hidden md:block"
      />
    </>
  );
}
