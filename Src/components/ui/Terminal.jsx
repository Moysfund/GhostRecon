import { useState, useRef, useEffect } from "react";

const TOOLS = {
  help: () => `Commands: nmap · whois · dig · curl · nikto · gobuster · sqlmap · sslscan · subfinder · httpx · tools · clear`,
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

const colors = { sys: "#166534", in: "#fff", out: "#00ff41", err: "#ef4444" };

export default function Terminal() {
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
    const fn = TOOLS[c.toLowerCase()];
    setHist(p => [...p,
      { t: "in", v: `$ ${t}` },
      fn ? { t: "out", v: fn(a.join(" ")) } : { t: "err", v: `Command not found: ${c}. Type 'help'.` }
    ]);
    setInp("");
  };

  const onKey = (e) => {
    if (e.key === "Enter") { run(inp); return; }
    if (e.key === "ArrowUp") { const i = Math.min(hIdx + 1, cmdHist.length - 1); setHIdx(i); setInp(cmdHist[i] || ""); }
    if (e.key === "ArrowDown") { const i = Math.max(hIdx - 1, -1); setHIdx(i); setInp(i === -1 ? "" : cmdHist[i]); }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>[ TERMINAL ]</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>Command Terminal</div>
        <div style={{ fontSize: 11, color: "#166534" }}>↑↓ for history · Click terminal and type</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {["nmap", "nikto", "gobuster", "sqlmap", "whois", "sslscan", "subfinder"].map(t => (
          <button key={t} onClick={() => { setInp(t + " "); inpRef.current?.focus(); }}
            style={{ fontSize: 10, border: "1px solid #052e16", background: "none", color: "#166534", padding: "3px 8px", cursor: "pointer", fontFamily: "monospace" }}>{t}</button>
        ))}
      </div>
      <div style={{ border: "1px solid #052e16", background: "#000", height: "60vh", overflowY: "auto", padding: 12, cursor: "text" }}
        onClick={() => inpRef.current?.focus()}>
        {hist.map((h, i) => (
          <div key={i} style={{ fontSize: 12, color: colors[h.t], marginBottom: 4, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{h.v}</div>
        ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "#00ff41", marginRight: 8 }}>$</span>
          <input ref={inpRef} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={onKey} autoFocus spellCheck={false}
            style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 12, fontFamily: "monospace", outline: "none" }} />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
                                                                                      }
