import { useState, useEffect, useRef } from "react";

// ─── ENTROPY ANIMATION ───────────────────────────────────────────────────────
function Entropy({ size = 300 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    const C = "#00ff41";
    class P {
      constructor(x, y, o) {
        this.x = x; this.y = y; this.ox = x; this.oy = y;
        this.size = 2; this.order = o;
        this.vel = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.inf = 0; this.nb = [];
      }
      update() {
        if (this.order) {
          const dx = this.ox - this.x, dy = this.oy - this.y;
          let ci = { x: 0, y: 0 };
          this.nb.forEach(n => {
            if (!n.order) {
              const d = Math.hypot(this.x - n.x, this.y - n.y);
              const s = Math.max(0, 1 - d / 100);
              ci.x += n.vel.x * s; ci.y += n.vel.y * s;
              this.inf = Math.max(this.inf, s);
            }
          });
          this.x += dx * 0.05 * (1 - this.inf) + ci.x * this.inf;
          this.y += dy * 0.05 * (1 - this.inf) + ci.y * this.inf;
          this.inf *= 0.99;
        } else {
          this.vel.x += (Math.random() - 0.5) * 0.5;
          this.vel.y += (Math.random() - 0.5) * 0.5;
          this.vel.x *= 0.95; this.vel.y *= 0.95;
          this.x += this.vel.x; this.y += this.vel.y;
          if (this.x < size / 2 || this.x > size) this.vel.x *= -1;
          if (this.y < 0 || this.y > size) this.vel.y *= -1;
          this.x = Math.max(size / 2, Math.min(size, this.x));
          this.y = Math.max(0, Math.min(size, this.y));
        }
      }
      draw() {
        const a = this.order ? 0.8 - this.inf * 0.5 : 0.8;
        ctx.fillStyle = `${C}${Math.round(a * 255).toString(16).padStart(2, "0")}`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      }
    }
    const gs = 20, sp = size / gs, parts = [];
    for (let i = 0; i < gs; i++) for (let j = 0; j < gs; j++)
      parts.push(new P(sp * i + sp / 2, sp * j + sp / 2, sp * i + sp / 2 < size / 2));
    let t = 0, aid;
    function loop() {
      ctx.clearRect(0, 0, size, size);
      if (t % 30 === 0) parts.forEach(p => { p.nb = parts.filter(o => o !== p && Math.hypot(p.x - o.x, p.y - o.y) < 80); });
      parts.forEach(p => {
        p.update(); p.draw();
        p.nb.forEach(n => {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d < 40) {
            ctx.strokeStyle = `${C}${Math.round(0.15 * (1 - d / 40) * 255).toString(16).padStart(2, "0")}`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        });
      });
      ctx.strokeStyle = `${C}33`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke();
      t++; aid = requestAnimationFrame(loop);
    }
    loop();
    return () => cancelAnimationFrame(aid);
  }, [size]);
  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

const AUTH_CODE = "David-is-theMaster";
const USERS = { admin: "admin123", david: "master2024" };
const SEV_COLOR = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#60a5fa" };

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

const HISTORY = [
  { id: 1, target: "https://testsite.com", type: "FULL", date: "2026-06-18 14:32", findings: 6, user: "david" },
  { id: 2, target: "192.168.1.1", type: "PORT", date: "2026-06-17 09:15", findings: 2, user: "admin" },
  { id: 3, target: "https://demo.target.io", type: "WEB", date: "2026-06-15 17:44", findings: 4, user: "david" },
];

const TOOL_SIM = {
  help: () => `Commands: nmap · whois · dig · curl · nikto · gobuster · sqlmap · sslscan · subfinder · tools · clear`,
  tools: () => `✓ nmap  ✓ nikto  ✓ gobuster  ✓ sqlmap  ✓ whois  ✓ dig  ✓ curl  ✓ sslscan  ✓ subfinder  ✓ httpx`,
  nmap: a => `PORT     STATE  SERVICE\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  open   https\n3306/tcp open   mysql\n\nTarget: ${a || "host"} — 5 open ports found`,
  whois: a => `Domain: ${a || "target.com"}\nRegistrar: GoDaddy\nCreated: 2018-03-14\nExpires: 2026-03-14\nStatus: clientTransferProhibited`,
  dig: a => `${a || "target.com"}.  300  IN  A  192.168.1.100\n${a || "target.com"}.  300  IN  MX  10 mail.target.com.`,
  curl: () => `HTTP/2 200\nServer: nginx/1.18.0\nX-Powered-By: PHP/7.4\n\n[!] Missing: X-Frame-Options, HSTS, CSP`,
  nikto: a => `+ /admin/: Admin login found\n+ /backup/: Directory listing enabled\n+ /phpinfo.php: PHP info exposed\n+ Cookie missing HttpOnly flag\n4 issues found on ${a || "target"}`,
  gobuster: () => `/admin   200\n/backup  200\n/config  403\n/uploads 200\n/api     200\n/login   200`,
  sqlmap: () => `[!] Parameter 'id' vulnerable:\n    - Boolean-based blind SQLi\n    - Time-based blind SQLi\nDB: MySQL 5.7 · Tables: users, orders, sessions`,
  sslscan: () => `TLS 1.0  ENABLED [VULNERABLE]\nTLS 1.1  ENABLED [DEPRECATED]\nTLS 1.2  ENABLED [OK]\nTLS 1.3  ENABLED [OK]\nPOODLE: VULNERABLE`,
  subfinder: a => `api.${a || "target.com"}\nmail.${a || "target.com"}\ndev.${a || "target.com"}\nadmin.${a || "target.com"}\n4 subdomains found`,
  httpx: a => `https://${a || "target.com"} [200] [nginx/1.18] [WordPress]\nhttps://api.${a || "target.com"} [401] [nginx/1.18]`,
};

const s = {
  page: { background: "#000", color: "#00ff41", fontFamily: "monospace", minHeight: "100vh", display: "flex", flexDirection: "column" },
  topbar: { borderBottom: "1px solid #052e16", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000" },
  nav: { borderBottom: "1px solid #052e16", display: "flex", overflowX: "auto", background: "#000" },
  navBtn: (active) => ({ padding: "8px 14px", fontSize: 11, letterSpacing: 2, cursor: "pointer", border: "none", background: active ? "#00ff41" : "transparent", color: active ? "#000" : "#166534", fontFamily: "monospace", whiteSpace: "nowrap" }),
  content: { flex: 1, overflowY: "auto", padding: 16 },
  input: { background: "#000", border: "1px solid #166534", color: "#00ff41", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", outline: "none", width: "100%" },
  btn: (c = "#00ff41") => ({ background: c, color: c === "#00ff41" ? "#000" : "#fff", border: "none", padding: "8px 16px", fontSize: 12, fontFamily: "monospace", fontWeight: "bold", letterSpacing: 2, cursor: "pointer" }),
  box: { border: "1px solid #052e16", padding: 12, marginBottom: 12 },
  label: { fontSize: 10, color: "#166534", letterSpacing: 3, display: "block", marginBottom: 4 },
  tag: (c) => ({ fontSize: 11, border: `1px solid ${c}40`, color: c, padding: "2px 8px", marginRight: 6, marginBottom: 4, display: "inline-block" }),
};

function ScanPanel({ user, onResults }) {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState("full");
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState(false);
  const [codeErr, setCodeErr] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pLabel, setPLabel] = useState("");
  const [results, setResults] = useState(null);
  const [showCode, setShowCode] = useState(false);

  const steps = ["Initializing...", "Resolving DNS...", "Enumerating subdomains...", "Port scanning...", "Fingerprinting...", "Vuln checks...", "Web analysis...", "CVE lookup...", "Compiling...", "Done."];

  const verify = () => { code === AUTH_CODE ? (setAuthed(true), setCodeErr("")) : setCodeErr("Invalid code. Access denied."); };

  const scan = async () => {
    if (!target || !authed) return;
    setScanning(true); setResults(null);
    for (let i = 0; i < steps.length; i++) {
      setPLabel(steps[i]); setProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
    }
    const r = { ...MOCK_RESULTS, target, timestamp: new Date().toISOString(), scanType, user };
    setResults(r); onResults(r); setScanning(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <span style={s.label}>[ SCAN ENGINE ]</span>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>Target Assessment</div>
        <div style={{ fontSize: 11, color: "#166534", marginTop: 4 }}>Only scan systems you have explicit written authorization to test.</div>
      </div>
      <div style={s.box}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <span style={s.label}>TARGET URL / IP</span>
            <input style={s.input} value={target} onChange={e => setTarget(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <span style={s.label}>SCAN TYPE</span>
            <select style={{ ...s.input }} value={scanType} onChange={e => setScanType(e.target.value)}>
              {["recon", "port", "vuln", "web", "full"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        {!authed ? (
          <div style={{ border: "1px solid #713f12", background: "#431407", padding: 12, marginBottom: 12 }}>
            <div style={{ color: "#f97316", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>⚠ AUTHORIZATION CODE REQUIRED</div>
            <div style={{ fontSize: 11, color: "#9a3412", marginBottom: 8 }}>Enter your authorization code to unlock scanning.</div>
            {!showCode
              ? <button style={{ ...s.btn("#f97316"), fontSize: 11 }} onClick={() => setShowCode(true)}>ENTER CODE</button>
              : <div style={{ display: "flex", gap: 8 }}>
                <input type="password" style={{ ...s.input, borderColor: "#713f12", color: "#f97316" }} value={code} onChange={e => setCode(e.target.value)} placeholder="Authorization code" />
                <button style={s.btn("#f97316")} onClick={verify}>VERIFY</button>
              </div>}
            {codeErr && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 6 }}>{codeErr}</div>}
          </div>
        ) : (
          <div style={{ border: "1px solid #166534", background: "#052e16", padding: 8, marginBottom: 12, fontSize: 11, color: "#00ff41" }}>✓ Authorization verified — scan access granted</div>
        )}
        <button style={{ ...s.btn(), width: "100%", opacity: !target || !authed || scanning ? 0.3 : 1 }}
          onClick={scan} disabled={!target || !authed || scanning}>
          {scanning ? "[ SCANNING... ]" : "[ INITIATE SCAN ]"}
        </button>
      </div>
      {scanning && (
        <div style={s.box}>
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
          <div style={s.box}>
            <span style={s.label}>[ SUMMARY ]</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[["TARGET", results.target.slice(0, 20)], ["PORTS", results.openPorts.length], ["SUBDOMAINS", results.subdomains.length], ["FINDINGS", results.findings.length]].map(([l, v]) => (
                <div key={l} style={{ border: "1px solid #052e16", padding: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#166534" }}>{l}</div>
                  <div style={{ fontWeight: "bold", fontSize: 14, color: "#00ff41", marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.box}>
            <span style={s.label}>[ TECHNOLOGIES ]</span>
            {results.technologies.map(t => <span key={t} style={s.tag("#00ff41")}>{t}</span>)}
          </div>
          <div style={s.box}>
            <span style={s.label}>[ SUBDOMAINS ]</span>
            {results.subdomains.map(t => <span key={t} style={s.tag("#60a5fa")}>{t}</span>)}
          </div>
          <div style={s.box}>
            <span style={s.label}>[ OPEN PORTS ]</span>
            {results.openPorts.map(p => <span key={p} style={s.tag("#f97316")}>:{p}</span>)}
          </div>
          <div style={s.box}>
            <span style={s.label}>[ VULNERABILITIES ]</span>
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

function AIAssistant({ scanResults }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "GhostRecon AI online. I can analyze scan results, explain vulnerabilities, suggest remediations, and answer cybersecurity questions." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const newMsgs = [...msgs, { role: "user", content: text }];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const ctx = scanResults ? `\n\nScan context — Target: ${scanResults.target}, Findings: ${scanResults.findings.map(f => `${f.severity}:${f.type}`).join(", ")}, Tech: ${scanResults.technologies?.join(", ")}, Ports: ${scanResults.openPorts?.join(", ")}` : "";
      const apiMsgs = newMsgs.map((m, i) => i === 0 ? { ...m, content: m.content + ctx } : m);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          system: "You are GhostRecon AI, an expert cybersecurity assistant for a professional penetration testing platform. Help authorized security professionals analyze vulnerabilities, understand attack techniques from a defensive perspective, and remediate issues. Be technical, precise, and professional.",
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", content: data.content?.map(b => b.text || "").join("") || "Error." }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]); }
    setLoading(false);
  };

  const quick = scanResults
    ? ["Summarize findings", "Most critical vuln?", "Explain SQL injection found", "Remediation priority list"]
    : ["What is OWASP Top 10?", "Explain SQL injection", "How does XSS work?", "What is a CVE?"];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", height: "72vh" }}>
      <div style={{ marginBottom: 12 }}>
        <span style={s.label}>[ AI AGENT ]</span>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>GhostRecon AI</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {quick.map(q => <button key={q} onClick={() => send(q)} style={{ fontSize: 10, border: "1px solid #052e16", background: "none", color: "#166534", padding: "3px 8px", cursor: "pointer", fontFamily: "monospace" }}>{q}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", border: "1px solid #052e16", background: "#000", padding: 12, marginBottom: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "85%", padding: "8px 12px", border: `1px solid ${m.role === "user" ? "#166534" : "#052e16"}`, background: m.role === "user" ? "#052e16" : "#000", color: "#00ff41", fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              <div style={{ fontSize: 9, color: "#166534", marginBottom: 4 }}>{m.role === "user" ? "YOU" : "GHOSTRECON AI"}</div>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#166534", fontSize: 12 }}>[ Processing... ]</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input style={s.input} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask about vulnerabilities, techniques, scan results..." />
        <button style={{ ...s.btn(), padding: "8px 20px" }} onClick={() => send(input)} disabled={loading || !input.trim()}>SEND</button>
      </div>
    </div>
  );
}

function Terminal() {
  const [hist, setHist] = useState([{ t: "sys", v: "GhostRecon Terminal v2.4.1 — type 'help' for commands" }]);
  const [inp, setInp] = useState("");
  const [cmdHist, setCmdHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inpRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [hist]);

  const run = (cmd) => {
    const t = cmd.trim(); if (!t) return;
    setCmdHist(p => [t, ...p]); setHIdx(-1);
    if (t === "clear") { setHist([{ t: "sys", v: "Cleared." }]); setInp(""); return; }
    const [c, ...a] = t.split(" ");
    const fn = TOOL_SIM[c.toLowerCase()];
    setHist(p => [...p, { t: "in", v: `$ ${t}` }, fn ? { t: "out", v: fn(a.join(" ")) } : { t: "err", v: `Command not found: ${c}. Type 'help'.` }]);
    setInp("");
  };

  const onKey = (e) => {
    if (e.key === "Enter") { run(inp); return; }
    if (e.key === "ArrowUp") { const i = Math.min(hIdx + 1, cmdHist.length - 1); setHIdx(i); setInp(cmdHist[i] || ""); }
    if (e.key === "ArrowDown") { const i = Math.max(hIdx - 1, -1); setHIdx(i); setInp(i === -1 ? "" : cmdHist[i]); }
  };

  const colors = { sys: "#166534", in: "#fff", out: "#00ff41", err: "#ef4444" };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <span style={s.label}>[ TERMINAL ]</span>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>Command Terminal</div>
        <div style={{ fontSize: 11, color: "#166534" }}>↑↓ for history</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {["nmap", "nikto", "gobuster", "sqlmap", "whois", "sslscan", "subfinder"].map(t => (
          <button key={t} onClick={() => { setInp(t + " "); inpRef.current?.focus(); }}
            style={{ fontSize: 10, border: "1px solid #052e16", background: "none", color: "#166534", padding: "3px 8px", cursor: "pointer", fontFamily: "monospace" }}>{t}</button>
        ))}
      </div>
      <div style={{ border: "1px solid #052e16", background: "#000", height: "60vh", overflowY: "auto", padding: 12, cursor: "text" }} onClick={() => inpRef.current?.focus()}>
        {hist.map((h, i) => <div key={i} style={{ fontSize: 12, color: colors[h.t], marginBottom: 4, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{h.v}</div>)}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#00ff41", marginRight: 8 }}>$</span>
          <input ref={inpRef} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={onKey}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 12, fontFamily: "monospace", outline: "none" }} autoFocus spellCheck={false} />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function Reports({ scanResults }) {
  const exportMD = () => {
    const md = `# GhostRecon Report\nTarget: ${scanResults.target}\nDate: ${scanResults.timestamp}\n\n## Findings\n${scanResults.findings.map(f => `### [${f.severity}] ${f.type}\n- ${f.detail}\n- Fix: ${f.fix}`).join("\n\n")}`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    a.download = `report-${Date.now()}.md`; a.click();
  };
  const exportJSON = () => {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(scanResults, null, 2)], { type: "application/json" }));
    a.download = `report-${Date.now()}.json`; a.click();
  };

  if (!scanResults) return (
    <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: 40, border: "1px solid #052e16", color: "#166534" }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>▦</div>
      <div>No scan results yet — run a scan first.</div>
    </div>
  );

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  scanResults.findings.forEach(f => counts[f.severity]++);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <span style={s.label}>[ REPORTS ]</span>
      <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41", marginBottom: 16 }}>Security Report</div>
      <div style={s.box}>
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
      <div style={s.box}>
        <span style={s.label}>[ FINDINGS ]</span>
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
        <button style={{ flex: 1, background: "none", border: "1px solid #166534", color: "#00ff41", padding: 8, fontFamily: "monospace", cursor: "pointer" }} onClick={exportJSON}>Export JSON</button>
        <button style={{ flex: 1, background: "none", border: "1px solid #166534", color: "#00ff41", padding: 8, fontFamily: "monospace", cursor: "pointer" }} onClick={exportMD}>Export Markdown</button>
      </div>
    </div>
  );
}

function ScanHistory() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <span style={s.label}>[ HISTORY ]</span>
      <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41", marginBottom: 16 }}>Scan History</div>
      <div style={{ border: "1px solid #052e16" }}>
        {HISTORY.map((h, i) => (
          <div key={h.id} style={{ padding: "12px 16px", borderBottom: i < HISTORY.length - 1 ? "1px solid #052e16" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#00ff41", fontSize: 13 }}>{h.target}</div>
                <div style={{ fontSize: 10, color: "#166534", marginTop: 2 }}>{h.date} · {h.user.toUpperCase()} · {h.type}</div>
              </div>
              <span style={s.tag(h.findings > 4 ? "#ef4444" : h.findings > 2 ? "#f97316" : "#eab308")}>{h.findings} findings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Landing({ onAuth }) {
  const [step, setStep] = useState("home");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    e.preventDefault(); setLoading(true); setErr("");
    setTimeout(() => {
      USERS[user.toLowerCase()] === pass ? onAuth(user) : setErr("Invalid credentials. Access denied.");
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ ...s.page, alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(#00ff41 1px,transparent 1px),linear-gradient(90deg,#00ff41 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {step === "home" && (
        <div style={{ textAlign: "center", zIndex: 1, padding: 16 }}>
          <div style={{ fontSize: 10, color: "#166534", letterSpacing: 4, marginBottom: 12 }}>[ INITIALIZING SYSTEM ]</div>
          <div style={{ border: "1px solid #052e16", display: "inline-block", marginBottom: 24, boxShadow: "0 0 40px #00ff4120" }}>
            <Entropy size={280} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: "bold", color: "#00ff41", letterSpacing: 2, textShadow: "0 0 20px #00ff41", margin: "0 0 4px" }}>
            GHOST<span style={{ color: "#fff" }}>RECON</span>
          </h1>
          <div style={{ fontSize: 11, color: "#166534", letterSpacing: 3 }}>ADVANCED AI PENETRATION TESTING PLATFORM</div>
          <div style={{ fontSize: 10, color: "#052e16", marginTop: 8, marginBottom: 24 }}>v2.4.1 · AUTHORIZED USE ONLY · ALL ACTIVITY LOGGED</div>
          <button style={{ ...s.btn(), width: 220, border: "1px solid #00ff41", background: "none", color: "#00ff41" }} onClick={() => setStep("login")}>
            [ ACCESS SYSTEM ]
          </button>
        </div>
      )}
      {step === "login" && (
        <div style={{ zIndex: 1, width: "100%", maxWidth: 360, padding: 16 }}>
          <div style={{ border: "1px solid #052e16", background: "#000", padding: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3 }}>[ AUTHENTICATION REQUIRED ]</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#00ff41", marginTop: 4 }}>GHOSTRECON ACCESS</div>
            </div>
            <form onSubmit={login}>
              <div style={{ marginBottom: 12 }}>
                <span style={s.label}>USERNAME</span>
                <input style={s.input} value={user} onChange={e => setUser(e.target.value)} placeholder="Username" required />
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={s.label}>PASSWORD</span>
                <input style={s.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required />
              </div>
              {err && <div style={{ color: "#ef4444", fontSize: 11, border: "1px solid #7f1d1d", padding: 8, marginBottom: 12 }}>{err}</div>}
              <button type="submit" style={{ ...s.btn(), width: "100%", opacity: loading ? 0.5 : 1 }}>
                {loading ? "[ AUTHENTICATING... ]" : "[ AUTHENTICATE ]"}
              </button>
            </form>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button onClick={() => setStep("home")} style={{ background: "none", border: "none", color: "#166534", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>← Back</button>
            </div>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#052e16", marginTop: 8 }}>Try: admin / admin123 · david / master2024</div>
        </div>
      )}
    </div>
  );
}

const NAV = [
  { id: "scan", label: "[ SCAN ]" },
  { id: "ai", label: "[ AI AGENT ]" },
  { id: "terminal", label: "[ TERMINAL ]" },
  { id: "reports", label: "[ REPORTS ]" },
  { id: "history", label: "[ HISTORY ]" },
];

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("scan");
  const [results, setResults] = useState(null);

  if (!authed) return <Landing onAuth={u => { setUser(u); setAuthed(true); }} />;

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <span style={{ fontWeight: "bold", fontSize: 14, textShadow: "0 0 10px #00ff41" }}>
          GHOST<span style={{ color: "#fff" }}>RECON</span>
          <span style={{ fontSize: 10, color: "#166534", marginLeft: 8 }}>v2.4.1</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11 }}>
          <span style={{ color: "#166534" }}>USER: <span style={{ color: "#00ff41" }}>{user?.toUpperCase()}</span></span>
          <button onClick={() => { setAuthed(false); setUser(null); }} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>[ LOGOUT ]</button>
        </div>
      </div>
      <div style={s.nav}>
        {NAV.map(n => <button key={n.id} onClick={() => setTab(n.id)} style={s.navBtn(tab === n.id)}>{n.label}</button>)}
      </div>
      <div style={s.content}>
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
