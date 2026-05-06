import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://docmind-backend-31ib.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        showToast(data.message, "success");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
      } else {
        showToast(data.message, "error");
      }
    } catch (e) {
      console.log(e);
      showToast("Signup failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const strengthScore =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;

  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#f87171", "#fbbf24", "#34d399"];

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
            <div className="auth-title">Create account</div>
            <div className="auth-subtitle">
              Start querying your documents in seconds
            </div>
          </div>

          {success && (
            <div className="success-toast">
              ✓ Account created! You can now sign in.
            </div>
          )}

          <div className="field-group">
            <div>
              <label className="input-label">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  style={{ paddingRight: "42px" }}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {password.length > 0 && (
                <div className="strength-bar">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="strength-seg"
                      style={{
                        background:
                          strengthScore >= i
                            ? strengthColor[strengthScore]
                            : undefined,
                      }}
                    />
                  ))}
                  <span
                    className="strength-text"
                    style={{ color: strengthColor[strengthScore] }}
                  >
                    {strengthLabel[strengthScore]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div> Creating account…
              </>
            ) : (
              <>✦ Create Account</>
            )}
          </button>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">OR</span>
            <div className="divider-line"></div>
          </div>

          <div className="auth-footer">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
