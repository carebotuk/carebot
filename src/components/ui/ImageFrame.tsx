import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  label?: string;
  aspect?: "square" | "video" | "portrait" | "wide";
  priority?: boolean;
  sizes?: string;
  className?: string;
  rounded?: boolean;
};

const ratios = { square: "aspect-square", video: "aspect-video", portrait: "aspect-[4/5]", wide: "aspect-[16/7]" };

/**
 * Renders a real image when one exists, otherwise a neutral placeholder.
 * Placeholders are deliberately plain: the brief forbids manufacturer environment
 * photography, and real UK photography is coming.
 */
export function ImageFrame({ src, alt, label, aspect = "square", priority, sizes = "(min-width: 1024px) 33vw, 100vw", className = "", rounded = true }: Props) {
  const r = rounded ? "rounded-[var(--radius)]" : "";
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-mist ${ratios[aspect]} ${r} ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
      </div>
    );
  }
  return (
    <div role="img" aria-label={alt} className={`relative flex items-center justify-center overflow-hidden border border-stone bg-mist ${ratios[aspect]} ${r} ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 64 64" className="h-12 w-12 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="16" y="10" width="32" height="44" rx="6" />
        <rect x="22" y="18" width="20" height="10" rx="2" />
        <path d="M22 36h20M22 44h20" />
        <circle cx="24" cy="57" r="3" /><circle cx="40" cy="57" r="3" />
      </svg>
      {label ? <span className="absolute bottom-3 left-3 text-(length:--step--1) text-slate">{label}</span> : null}
    </div>
  );
}
