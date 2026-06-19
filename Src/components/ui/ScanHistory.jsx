import { useState } from "react";

const HISTORY = [
  { id: 1, target: "https://testsite.com", type: "FULL", date: "2026-06-18 14:32", findings: 6, user: "david" },
  { id: 2, target: "192.168.1.1", type: "PORT", date: "2026-06-17 09:15", findings: 2, user: "admin" },
  { id: 3, target: "https://demo.target.io", type: "WEB", date: "2026-06-15 17:44", findings: 4, user: "david" },
  { id: 4, target: "https://api.example.com", type: "RECON", date: "2026-06-12 11:20", findings: 1, user: "admin" },
];

const SEV_COLOR = (n) => n > 4 ? "#ef4444" : n > 2 ? "#f97316" : "#eab308";

export default function ScanHistory() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>[ HISTORY ]</div>
      <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41", marginBottom: 16 }}>Scan History</div>
      <div style={{ border: "1px solid #052e16" }}>
        {HISTORY.map((h, i) => (
          <div key={h.id} onClick={() => setSelected(selected?.id === h.id ? null : h)}
            style={{ padding: "12px 16px", borderBottom: i < HISTORY.length - 1 ? "1px solid #052e16" : "none", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#00ff41", fontSize: 13 }}>{h.target}</div>
                <div style={{ fontSize: 10, color: "#166534", marginTop: 2 }}>{h.date} · {h.user.toUpperCase()} · {h.type}</div>
              </div>
              <span style={{ fontSize: 11, border: `1px solid ${SEV_COLOR(h.findings)}40`, color: SEV_COLOR(h.findings), padding: "2px 8px" }}>{h.findings} findings</span>
            </div>
            {selected?.id === h.id && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #052e16", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11, color: "#166534" }}>
                <div>Type: <span style={{ color: "#00ff41" }}>{h.type}</span></div>
                <div>Status: <span style={{ color: "#00ff41" }}>COMPLETE</span></div>
                <div>Analyst: <span style={{ color: "#00ff41" }}>{h.user.toUpperCase()}</span></div>
                <div>Findings: <span style={{ color: "#00ff41" }}>{h.findings}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#052e16", marginTop: 8 }}>Connect backend for persistent storage across sessions.</div>
    </div>
  );
}
