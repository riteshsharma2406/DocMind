import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://docmind-backend-31ib.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      console.log(e);
      showToast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-wrapper">
        {toast.show && (
          <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
        )}
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-badge">
              <div className="logo-dot"></div>DocMind AI
            </div>
            <div className="auth-title">Welcome back</div>
            <div className="auth-subtitle">
              Sign in to continue to your workspace
            </div>
          </div>

          <div className="field-group">
            <div>
              <label className="input-label">Username</label>
              <input
                type="text"
                placeholder="e.g. johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{ paddingRight: "42px" }}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div> Signing in…
              </>
            ) : (
              <>→ Sign In</>
            )}
          </button>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          <div className="auth-footer">
            Don't have an account? <a href="/signup">Create one</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
