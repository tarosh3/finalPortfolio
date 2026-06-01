import { ImageResponse } from "next/og";

export const alt = "Tarosh Mathuria — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* TM mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "linear-gradient(135deg, #2a2a2a, #0d0d0d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
              border: "1px solid #333",
            }}
          >
            <span>T</span>
            <span style={{ color: "#ffd600" }}>M</span>
          </div>
          <span style={{ fontSize: 26, color: "#888", letterSpacing: 1 }}>Tarosh OS</span>
        </div>

        {/* Name + title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Tarosh Mathuria</div>
          <div style={{ fontSize: 34, color: "#ffd600", fontWeight: 600 }}>
            Senior Software Engineer · Go &amp; Distributed Systems
          </div>
          <div style={{ fontSize: 26, color: "#aaaaaa", marginTop: 8 }}>
            60,000+ merchants on ONDC · Kafka · Microservices · Magicpin
          </div>
        </div>

        {/* Footer stats */}
        <div style={{ display: "flex", gap: 56, fontSize: 24, color: "#777" }}>
          <span>4+ yrs experience</span>
          <span>3K+ daily txns</span>
          <span>40% infra cost saved</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
