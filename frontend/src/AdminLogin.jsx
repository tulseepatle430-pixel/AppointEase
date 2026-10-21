
import { useState } from "react";
import { LockKeyhole, ShieldCheck, Eye, EyeOff } from "lucide-react";

const API_URL = "http://localhost:5000/api";

function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("admin@appoint-ease.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(data.message || "Admin login failed.");
      }

      onLogin(data.token);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={32} />
        </div>

        <p className="admin-eyebrow">SECURE ACCESS</p>
        <h1>Admin Login</h1>
        <p className="admin-login-description">
          Sign in to manage AppointEase appointments.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Admin email</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <div className="admin-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="admin-show-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="admin-alert error">{error}</div>}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            <LockKeyhole size={18} />
            {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <button type="button" className="admin-back-button" onClick={onBack}>
          Back to AppointEase
        </button>
      </section>
    </main>
  );
}

export default AdminLogin;
