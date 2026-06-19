import { useState } from "react";
import ScanPanel from "../components/ui/ScanPanel";
import AIAssistant from "../components/ui/AIAssistant";
import Terminal from "../components/ui/Terminal";
import Reports from "../components/ui/Reports";
import ScanHistory from "../components/ui/ScanHistory";

const NAV = [
  { id: "scan", label: "[ SCAN ]" },
  { id: "ai", label: "[ AI AGENT ]" },
  { id: "terminal", label: "[ TERMINAL ]" },
  { id: "reports", label: "[ REPORTS ]" },
  { id: "history", label: "[ HISTORY ]" },
];

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("scan");
  const [results, setResults] = useState(null);

  return (
    <div style={{ background: "#000", color: "#00ff41", fontFamily: "monospace", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ borderBottom: "1px solid #052e16", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "bold", fontSize: 14, textShadow: "0 0 10px #00ff41" }}>
          GHOST<span style={{ color: "#fff" }}>RECON</span>
          <span style={{ fontSize: 10, color: "#166534", marginLeft: 8 }}>v2.4.1</span>
        </span>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 11 }}>
          <span style={{ color: "#166534" }}>USER: <span style={{ color: "#00ff41" }}>{user?.toUpperCase()}</span></span>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>[ LOGOUT ]</button>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #052e16", display: "flex", overflowX: "auto" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            style={{ padding: "8px 14px", fontSize: 11, letterSpacing: 2, cursor: "pointer", border: "none", background: tab === n.id ? "#00ff41" : "transparent", color: tab === n.id ? "#000" : "#166534", fontFamily: "monospace", whiteSpace: "nowrap" }}>
            {n.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {tab === "scan" && <ScanPanel user={user} onResults={setResults} />}
        {tab === "ai" && <AIAssistant scanResults={results} />}
        {tab === "terminal" && <Terminal />}
        {tab === "reports" && <Reports scanResults={results} />}
        {tab === "history" && <ScanHistory />}
      </div>
      <div style={{ borderTop: "1px solid #052e16", padding: "4px 16px", fontSize: 10, color: "#052e16", display: "flex", justifyContent: "space-between" }}>
        <span>ALL ACTIVITY LOGGED · AUTHORIZED USE ONLY</span>
        <span>GHOSTRECON © 2026</span>
      </div>
    </div>
  );
        }
