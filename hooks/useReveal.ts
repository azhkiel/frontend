"use client";

import { useEffect, useRef, RefObject } from "react";

/**
 * Intersection Observer hook — additive animation guard
 * Sesuai Anti-AI-SLop: prefers-reduced-motion, tidak universal, tidak layout-props
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} className="reveal"> ... </div>
 */
export function useReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Jika user prefer reduced-motion, skip animasi sama sekali
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // fire once only
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
        ...options,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * Stagger group: animasi berurutan pada children `.reveal`
 * Sesuai Anti-AI-SLop: per-item delay, bukan universal, max 300ms stagger
 */
export function useRevealGroup<T extends HTMLElement>(
  staggerMs = 80,
  options: IntersectionObserverInit = {}
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const children = Array.from(container.querySelectorAll(".reveal"));

    // Set delay per-item
    children.forEach((child, i) => {
      (child as HTMLElement).style.transitionDelay = `${i * staggerMs}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            children.forEach((child) => child.classList.add("reveal-visible"));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, ...options }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [staggerMs]);

  return ref;
}
