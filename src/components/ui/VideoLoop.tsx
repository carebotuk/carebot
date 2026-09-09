"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; poster: string; title: string; className?: string };

/**
 * Poster-first, muted, looping video. The file itself is only fetched once the
 * block scrolls into view, and it never autoplays for reduced-motion visitors.
 */
export function VideoLoop({ src, poster, title, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls
      preload="none"
      aria-label={title}
    />
  );
}
