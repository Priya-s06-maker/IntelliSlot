import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong"];
const STRENGTH_COLORS = ["", "#EF4444", "#F59E0B", "#10B981"];

export default function ResetPassword() {
  const navigate        = useNavigate();
  const [searchParams]  = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm]        = useState({ password: "", confirm: "" });
  const [errors, setErrors]    = useState({});
  const [showPw, setShowPw]    = useState(false);
  const [showCf, setShowCf]    = useState(false);
  const [loading, setLoading]  = useState(false);
  const [done, setDone]        = useState(false);
  const [validLink, setValidLink] = useState(true);

  // Validate that the link has token + email
  useEffect(() => {
    if (!token || !email) {
      setValidLink(false);
      return;
    }
    // Check email exists in our users
    let users = [];
    try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) setValidLink(false);
  }, [token, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.password) {
      errs.password = "New password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (!form.confirm) {
      errs.confirm = "Please confirm your new password.";
    } else if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    // Update password in localStorage
    let users = [];
    try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}

    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) {
      setLoading(false);
      toast.error("Account not found. Please sign up.");
      return;
    }

    users[idx].password = form.password;
    localStorage.setItem("is_users", JSON.stringify(users));

    setLoading(false);
    setDone(true);
    toast.success("Password reset successfully! You can now sign in. ✅");
  };

  const strength = getStrength(form.password);

  /* ── Invalid link state ── */
  if (!validLink) {
    return (
      <div className="page-shell">
        <div className="orb orb-1" />
        <nav className="navbar">
          <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="logo-badge">IS</div>
            <span className="logo-name">IntelliSlot</span>
          </div>
        </nav>
        <div className="auth-center">
          <div className="auth-card" style={{ textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
              border: "2px solid rgba(239,68,68,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, margin: "0 auto 20px"
            }}>❌</div>
            <h1 className="auth-title">Invalid Reset Link</h1>
            <p className="auth-subtitle" style={{ marginBottom: 32 }}>
              This password reset link is invalid or has expired.
              Please request a new one.
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate("/forgot")}
            >
              Request New Link
            </button>
            <p className="auth-footer" style={{ marginTop: 16 }}>
              <button className="btn-link" onClick={() => navigate("/login")}>
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="page-shell">
        <div className="orb orb-1" />
        <nav className="navbar">
          <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <div className="logo-badge">IS</div>
            <span className="logo-name">IntelliSlot</span>
          </div>
        </nav>
        <div className="auth-center">
          <div className="auth-card" style={{ textAlign: "center" }}>
            <div className="success-circle">🔐</div>
            <h1 className="auth-title">Password Reset!</h1>
            <p className="auth-subtitle" style={{ marginBottom: 12 }}>
              Your password has been updated successfully.
            </p>
            <p style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: 15, marginBottom: 32 }}>
              {email}
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate("/login")}
            >
              Sign In with New Password →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Reset form ── */
  return (
    <div className="page-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <nav className="navbar">
        <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <div className="logo-badge">IS</div>
          <span className="logo-name">IntelliSlot</span>
        </div>
      </nav>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🔐</div>
            <h1 className="auth-title">Set New Password</h1>
            <p className="auth-subtitle">
              Resetting password for<br />
              <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrap">
                <input
                  className={`form-input has-toggle${errors.password ? " error-field" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button" className="eye-btn"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? "Hide" : "Show"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}

              {/* Strength bar */}
              {form.password.length > 0 && (
                <>
                  <div className="strength-bar" style={{ marginTop: 8 }}>
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="strength-seg"
                        style={{ background: i <= strength ? STRENGTH_COLORS[strength] : undefined }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-wrap">
                <input
                  className={`form-input has-toggle${errors.confirm ? " error-field" : ""}`}
                  type={showCf ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
                <button
                  type="button" className="eye-btn"
                  onClick={() => setShowCf(s => !s)}
                  aria-label={showCf ? "Hide" : "Show"}
                >
                  {showCf ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
              {/* Live match indicator */}
              {!errors.confirm && form.confirm && form.password === form.confirm && (
                <span className="field-error" style={{ color: "var(--success)" }}>✓ Passwords match</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 6 }}
            >
              {loading
                ? <><span className="spinner" />&nbsp;Updating Password…</>
                : "Reset Password →"
              }
            </button>
          </form>

          <p className="auth-footer" style={{ marginTop: 20 }}>
            <button
              className="btn-link"
              style={{ color: "var(--text-muted)", fontSize: 13 }}
              onClick={() => navigate("/login")}
            >
              ← Back to Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}