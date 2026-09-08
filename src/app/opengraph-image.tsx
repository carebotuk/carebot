import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Carebot UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#FFFFFF", color: "#1C1B19", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
          Carebot <span style={{ color: "#2F5D50", marginLeft: 12 }}>UK</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1000 }}>Give your carers back the hours they spend walking.</div>
          <div style={{ fontSize: 28, color: "#6B6A66", maxWidth: 900 }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
