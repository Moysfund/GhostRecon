const SEV_COLOR = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#60a5fa" };

export default function Reports({ scanResults }) {
  const exportJSON = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(scanResults, null, 2)], { type: "application/json" }));
    a.download = `ghostrecon-${Date.now()}.json`; a.click();
  };
  const exportMD = () => {
    const md = `# GhostRecon Security Report\nTarget: ${scanResults.target}\nDate: ${scanResults.timestamp}\n\n## Findings\n${scanResults.findings.map(f => `### [${f.severity}] ${f.type}\n- Detail: ${f.detail}\n- CVE: ${f.cve}\n- Fix: ${f.fix}`).join("\n\n")}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    a.download = `ghostrecon-${Date.now()}.md`; a.click();
  };

  if (!scanResults) return (
    <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: 60, border: "1px solid #052e16", color: "#166534" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>▦</div>
      <div>No scan results yet — run a scan first.</div>
    </div>
  );

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  scanResults.findings.forEach(f => counts[f.severity]++);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>[ REPORTS ]</div>
      <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41", marginBottom: 16 }}>Security Report</div>

      <div style={{ border: "1px solid #052e16", padding: 12, marginBottom: 12 }}>
        {[["TARGET", scanResults.target], ["DATE", scanResults.timestamp?.slice(0, 10)], ["TYPE", scanResults.scanType?.toUpperCase()], ["ANALYST", scanResults.user?.toUpperCase()]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 12 }}>
            <span style={{ color: "#166534", minWidth: 80 }}>{l}:</span>
            <span style={{ color: "#00ff41" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
        {Object.entries(counts).map(([sev, n]) => (
          <div key={sev} style={{ border: "1px solid #052e16", padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: SEV_COLOR[sev] }}>{n}</div>
            <div style={{ fontSize: 10, color: "#166534", marginTop: 4 }}>{sev}</div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #052e16", padding: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 8 }}>[ FINDINGS ]</div>
        {scanResults.findings.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #052e16", padding: "8px 0", fontSize: 11 }}>
            <span style={{ color: SEV_COLOR[f.severity], fontWeight: "bold" }}>[{f.severity}] {f.type}</span>
            <span style={{ color: "#444", marginLeft: 8 }}>{f.cve}</span>
            <div style={{ color: "#6ee7b7", marginTop: 2 }}>{f.detail}</div>
            <div style={{ color: "#166534", marginTop: 2 }}>Fix: {f.fix}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={exportJSON} style={{ flex: 1, background: "none", border: "1px solid #166534", color: "#00ff41", padding: 10, fontFamily: "monospace", fontSize: 12, cursor: "pointer" }}>Export JSON</button>
        <button onClick={exportMD} style={{ flex: 1, background: "none", border: "1px solid #166534", color: "#00ff41", padding: 10, fontFamily: "monospace", fontSize: 12, cursor: "pointer" }}>Export Markdown</button>
      </div>
    </div>
  );
      }
