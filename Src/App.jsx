import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return authenticated ? (
    <Dashboard user={user} onLogout={() => { setAuthenticated(false); setUser(null); }} />
  ) : (
    <LandingPage onAuth={u => { setUser(u); setAuthenticated(true); }} />
  );
}
