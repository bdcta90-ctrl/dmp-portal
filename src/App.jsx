import { useState } from "react";
import ClaimsAgentMVP from "./ClaimsAgent.jsx";
import SecurityDashboard from "./SecurityDashboard.jsx";

export default function App() {
  const [agent, setAgent] = useState("claims"); // "claims" | "security"

  if (agent === "claims") {
    return <ClaimsAgentMVP onBack={() => setAgent("security")} />;
  }

  return <SecurityDashboard onBack={() => setAgent("claims")} />;
}
