import { useState, useRef, useEffect } from "react";

export default function AIAssistant({ scanResults }) {
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
      const ctx = scanResults
        ? `\n\nScan context — Target: ${scanResults.target}, Findings: ${scanResults.findings.map(f => `${f.severity}:${f.type}`).join(", ")}, Tech: ${scanResults.technologies?.join(", ")}, Ports: ${scanResults.openPorts?.join(", ")}`
        : "";
      const apiMsgs = newMsgs.map((m, i) => i === 0 ? { ...m, content: m.content + ctx } : m);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are GhostRecon AI, an expert cybersecurity assistant for a professional penetration testing platform. Help authorized security professionals analyze vulnerabilities, understand attack techniques from a defensive perspective, and remediate issues. Be technical, precise, and professional.",
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", content: data.content?.map(b => b.text || "").join("") || "Error." }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const quick = scanResults
    ? ["Summarize findings", "Most critical vuln?", "Explain SQL injection found", "Remediation priority list"]
    : ["What is OWASP Top 10?", "Explain SQL injection", "How does XSS work?", "What is a CVE?"];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", height: "72vh" }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>[ AI AGENT ]</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#00ff41" }}>GhostRecon AI</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {quick.map(q => (
          <button key={q} onClick={() => send(q)}
            style={{ fontSize: 10, border: "1px solid #052e16", background: "none", color: "#166534", padding: "3px 8px", cursor: "pointer", fontFamily: "monospace" }}>{q}</button>
        ))}
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
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask about vulnerabilities, techniques, scan results..."
          style={{ flex: 1, background: "#000", border: "1px solid #166534", color: "#00ff41", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", outline: "none" }} />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          style={{ background: "#00ff41", color: "#000", border: "none", padding: "8px 20px", fontFamily: "monospace", fontWeight: "bold", fontSize: 12, cursor: "pointer", opacity: loading || !input.trim() ? 0.4 : 1 }}>SEND</button>
      </div>
    </div>
  );
    }
