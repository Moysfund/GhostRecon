import { useState } from "react";
import { Entropy } from "../components/ui/Entropy";

const USERS = { admin: "admin123", david: "master2024" };

export default function LandingPage({ onAuth }) {
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
    <div style={{ background: "#000", color: "#00ff41", fontFamily: "monospace", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
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
          <div style={{ fontSize: 10, color: "#052e16", margin: "8px 0 24px" }}>v2.4.1 · AUTHORIZED USE ONLY · ALL ACTIVITY LOGGED</div>
          <button onClick={() => setStep("login")}
            style={{ background: "none", border: "1px solid #00ff41", color: "#00ff41", padding: "10px 40px", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, cursor: "pointer" }}>
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
                <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>USERNAME</div>
                <input value={user} onChange={e => setUser(e.target.value)} placeholder="Username" required
                  style={{ width: "100%", background: "#000", border: "1px solid #166534", color: "#00ff41", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", outline: "none" }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#166534", letterSpacing: 3, marginBottom: 4 }}>PASSWORD</div>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required
                  style={{ width: "100%", background: "#000", border: "1px solid #166534", color: "#00ff41", padding: "8px 12px", fontSize: 13, fontFamily: "monospace", outline: "none" }} />
              </div>
              {err && <div style={{ color: "#ef4444", fontSize: 11, border: "1px solid #7f1d1d", padding: 8, marginBottom: 12 }}>{err}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", background: "#00ff41", color: "#000", border: "none", padding: "10px", fontFamily: "monospace", fontWeight: "bold", fontSize: 12, letterSpacing: 2, cursor: "pointer", opacity: loading ? 0.5 : 1 }}>
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
