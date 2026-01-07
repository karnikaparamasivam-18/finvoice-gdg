import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "@/backend/auth/auth.service";
import { useAuth } from "@/backend/auth/useAuth";

export const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already authenticated, redirect to home
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, "admin");
      }
      // ✅ After auth, redirect to smart route ("/") which will handle the flow
      navigate("/", { replace: true });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-3 bg-primary text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-center mt-4 text-sm text-primary cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};
