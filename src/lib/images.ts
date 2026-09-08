import fs from "node:fs";
import path from "node:path";

/** Returns the public path if the file exists under /public, else undefined (renders a placeholder). */
export function resolveImage(src?: string): string | undefined {
  if (!src) return undefined;
  const full = path.join(process.cwd(), "public", src);
  return fs.existsSync(full) ? src : undefined;
}
