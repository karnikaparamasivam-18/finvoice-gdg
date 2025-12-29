import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "@/backend/auth/auth.service";

export default function TestAuth() {
  const navigate = useNavigate();

  // ✅ STATE VARIABLES (THIS WAS MISSING)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TREASURER");

  const handleSignup = async () => {
    try {
      await registerUser(email, password, role);
      alert("Signup successful");
      navigate("/language"); // or /dashboard
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      alert("Login successful");
      navigate("/language"); // or /dashboard
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Firebase Auth Test</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="PRESIDENT">President</option>
        <option value="TREASURER">Treasurer</option>
        <option value="MEMBER">Member</option>
      </select>

      <br /><br />

      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin} style={{ marginLeft: 10 }}>
        Login
      </button>
    </div>
  );
}
