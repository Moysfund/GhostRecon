import { useState } from "react";

const AUTH_CODE = "David-is-theMaster";

const MOCK_RESULTS = {
  openPorts: [22, 80, 443, 3306, 8080],
  subdomains: ["api.target.com", "mail.target.com", "dev.target.com", "admin.target.com"],
  technologies: ["Nginx 1.18", "PHP 7.4", "WordPress 6.1", "MySQL 5.7"],
  findings: [
    { severity: "CRITICAL", type: "SQL Injection", detail: "Login endpoint vulnerable to blind SQLi", cve: "CVE-2023-1234", fix: "Use parameterized queries" },
    { severity: "HIGH", type: "XSS Reflected", detail: "Search parameter not sanitized", cve: "CVE-2023-5678", fix: "Encode all user output, implement CSP" },
    { severity: "HIGH", type: "Exposed Admin Panel", detail: "/admin accessible without auth", cve: "N/A", fix: "Restrict by IP or require strong auth" },
    { severity: "MEDIUM", type: "Outdated TLS 1.0", detail: "TLS 1.0 still enabled on port 443", cve: "CVE-2021-3449", fix: "Disable TLS 1.0/1.1, enforce TLS 1.2+" },
    { severity: "MEDIUM", type: "Open SSH Port 22", detail: "SSH exposed to internet", cve: "N/A", fix: "Restrict SSH to known IPs" },
    { severity: "LOW", type: "Missing Security Headers", detail: "No X-Frame-Options, no HSTS", cve: "N/A", fix: "Add HSTS, X-Frame-Options headers" },
  ],
};

const SEV_COLOR = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#60a5fa" };

const inp = { width: "100%", background: "#000", border: "1px solid #166534", color: "#00ff41", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", outline: "none" };
const box = { border: "1px solid #052e16", padding: 12, marginBottom: 12 };
const lbl = { fontSize: 10, color: "#166534", letterSpacing: 3, display: "block", marginBottom: 4 };

export default function ScanPanel({ user, onResults }) {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState("full");
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [codeErr, setCodeErr] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pLabel, setPLabel] = useState("");
  const [results, setResults] = useState(null);

  const steps = ["Initializing...", "Resolving DNS...", "Enumerating subdomains...", "Port scanning...", "Fingerprinting...", "Vuln checks...", "Web analysis...", "CVE lookup...", "Compiling...", "Done."];

  const verify = () => code === AUTH_CODE ? (setAuthed(true), setCodeErr("")) : setCodeErr("Invalid code. Access denied.");

  const scan = async () => {
    if (!target || !authed) return;
    setScanning(true); setResults(null);
    for (let i = 0; i < steps.length; i++) {
      setPLabel(steps[i]);
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
    }
    const r = { ...MOCK_RESULTS, target, timestamp: new Date().toISOString(), scanType, user };
    setResults(r); onResults(r); setScanning(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <span style={lbl}>[ SCAN ENGINE ]</span>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>Target Assessment</div>
        <div style={{ fontSize: 11, color: "#166534", marginTop: 4 }}>Only scan systems you have explicit written authorization to test.</div>
      </div>

      <div style={box}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <span style={lbl}>TARGET URL / IP</span>
            <input style={inp} value={target} onChange={e => setTarget(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <span style={lbl}>SCAN TYPE</span>
            <select style={inp} value={scanType} onChange={e => setScanType(e.target.value)}>
              {["recon", "port", "vuln", "web", "full"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {!authed ? (
          <div style={{ border: "1px solid #713f12", background: "#431407", padding: 12, marginBottom: 12 }}>
            <div style={{ color: "#f97316", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>⚠ AUTHORIZATION CODE REQUIRED</div>
            <div style={{ fontSize: 11, color: "#9a3412", marginBottom: 8 }}>Enter your authorization code to unlock scanning.</div>
            {!showCode
              ? <button onClick={() => setShowCode(true)} style={{ background: "#f97316", border: "none", color: "#000", padding: "6px 14px", fontFamily: "monospace", fontWeight: "bold", fontSize: 11, cursor: "pointer" }}>ENTER CODE</button>
              : <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" style={{ ...inp, borderColor: "#713f12", color: "#f97316" }} value={code} onChange={e => setCode(e.target.value)} placeholder="Authorization code" />
                  <button onClick={verify} style={{ background: "#f97316", border: "none", color: "#000", padding: "6px 14px", fontFamily: "monospace", fontWeight: "bold", cursor: "pointer" }}>VERIFY</button>
                </div>}
            {codeErr && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 6 }}>{codeErr}</div>}
          </div>
        ) : (
          <div style={{ border: "1px solid #166534", background: "#052e16", padding: 8, marginBottom: 12, fontSize: 11, color: "#00ff41" }}>✓ Authorization verified — scan access granted</div>
        )}

        <button onClick={scan} disabled={!target || !authed || scanning}
          style={{ width: "100%", background: "#00ff41", color: "#000", border: "none", padding: 10, fontFamily: "monospace", fontWeight: "bold", fontSize: 12, letterSpacing: 2, cursor: "pointer", opacity: (!target || !authed || scanning) ? 0.3 : 1 }}>
          {scanning ? "[ SCANNING... ]" : "[ INITIATE SCAN ]"}
        </button>
      </div>

      {scanning && (
        <div style={box}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
            <span style={{ color: "#00ff41" }}>{pLabel}</span>
            <span style={{ color: "#166534" }}>{progress}%</span>
          </div>
          <div style={{ background: "#052e16", height: 4, borderRadius: 2 }}>
            <div style={{ background: "#00ff41", height: 4, borderRadius: 2, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {results && (
        <div>
          <div style={box}>
            <span style={lbl}>[ SUMMARY ]</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[["TARGET", results.target.slice(0, 18)], ["PORTS", results.openPorts.length], ["SUBDOMAINS", results.subdomains.length], ["FINDINGS", results.findings.length]].map(([l, v]) => (
                <div key={l} style={{ border: "1px solid #052e16", padding: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#166534" }}>{l}</div>
                  <div style={{ fontWeight: "bold", fontSize: 14, color: "#00ff41", marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={box}>
            <span style={lbl}>[ TECHNOLOGIES ]</span>
            {results.technologies.map(t => <span key={t} style={{ fontSize: 11, border: "1px solid #00ff4140", color: "#00ff41", padding: "2px 8px", marginRight: 6, display: "inline-block" }}>{t}</span>)}
          </div>
          <div style={box}>
            <span style={lbl}>[ SUBDOMAINS ]</span>
            {results.subdomains.map(t => <span key={t} style={{ fontSize: 11, border: "1px solid #60a5fa40", color: "#60a5fa", padding: "2px 8px", marginRight: 6, display: "inline-block" }}>{t}</span>)}
          </div>
          <div style={box}>
            <span style={lbl}>[ OPEN PORTS ]</span>
            {results.openPorts.map(p => <span key={p} style={{ fontSize: 11, border: "1px solid #f9731640", color: "#f97316", padding: "2px 8px", marginRight: 6, display: "inline-block" }}>:{p}</span>)}
          </div>
          <div style={box}>
            <span style={lbl}>[ VULNERABILITIES ]</span>
            {results.findings.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${SEV_COLOR[f.severity]}30`, background: `${SEV_COLOR[f.severity]}08`, padding: 10, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: "bold", fontSize: 12, color: SEV_COLOR[f.severity] }}>[{f.severity}] {f.type}</span>
                  <span style={{ fontSize: 10, color: "#444" }}>{f.cve}</span>
                </div>
                <div style={{ fontSize: 11, color: "#6ee7b7", marginBottom: 4 }}>{f.detail}</div>
                <div style={{ fontSize: 11, color: "#166534" }}>FIX: {f.fix}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
                                  }
