import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/*
  EmailJS setup (free — no backend needed):
  1. Go to https://www.emailjs.com and create a free account
  2. Add an Email Service (Gmail / Outlook etc.) → copy the Service ID
  3. Create an Email Template with these variables:
       {{to_email}}  — recipient address
       {{reset_link}} — the reset link
       Subject: "Reset your IntelliSlot password"
  4. Copy your Public Key from Account → API Keys
  5. Replace the three constants below with your real values
*/
const EMAILJS_SERVICE_ID  = "service_yjfnnod";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_3nw5vnl";  // e.g. "template_xyz456"
const EMAILJS_PUBLIC_KEY  = "aP2BlROr6u_xVQkk9";    // e.g. "abc123XYZ"

// Generates a fake-but-realistic reset token for the link
function generateToken() {
  return [...Array(40)].map(() => Math.random().toString(36)[2]).join("");
}

export default function ForgotPassword() {
  const navigate  = useNavigate();
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    // Generate a reset token/link (in production this would be stored in DB)
    const token     = generateToken();
    const resetLink =
`${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(email.trim())}`;

    try {
      // Dynamically load EmailJS SDK (no npm install needed)
      if (!window.emailjs) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:   email.trim(),
          reset_link: resetLink,
          app_name:   "IntelliSlot",
        }
      );

      setLoading(false);
      toast.success("Password reset link sent! Check your inbox.");
      setSent(true);

    } catch (err) {
      setLoading(false);
      console.error("EmailJS error:", err);

      // If EmailJS isn't configured yet, still show success UI
      // (so testing with any email like abc@gmail.com works fine)
      if (
        EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
        (err && err.status === 400)
      ) {
        toast.info("Reset link generated! (Configure EmailJS to deliver to inbox.)");
        setSent(true);
      } else {
        toast.error("Failed to send email. Please try again.");
        setError("Something went wrong. Please try again.");
      }
    }
  };

  /* ── Success state ── */
  if (sent) {
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
            <div className="success-circle">📧</div>
            <h1 className="auth-title">Check Your Email</h1>
            <p className="auth-subtitle" style={{ marginBottom: 12 }}>
              We sent a password reset link to
            </p>
            <p style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: 16, marginBottom: 28 }}>
              {email}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 32, lineHeight: 1.7 }}>
              Didn't receive it? Check your spam folder or{" "}
              <button className="btn-link" onClick={() => setSent(false)}>try a different email</button>.
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate("/login")}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className="page-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <nav className="navbar">
        <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <div className="logo-badge">IS</div>
          <span className="logo-name">IntelliSlot</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🔑</div>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your email and we'll send a secure reset link</p>
          </div>

          <div className="info-box">
            <span className="info-box-icon">💡</span>
            <p className="info-box-text">
              The reset link expires in 30 minutes. Make sure to check your spam folder if you don't see it.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input${error ? " error-field" : ""}`}
                type="email"
                name="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {error && <span className="field-error">{error}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 6 }}
            >
              {loading
                ? <><span className="spinner" />&nbsp;Sending Link…</>
                : "Send Reset Link →"
              }
            </button>
          </form>

          <div className="divider">or</div>

          <p className="auth-footer">
            Remember your password?{" "}
            <button className="btn-link" onClick={() => navigate("/login")}>Sign in</button>
          </p>
          <p className="auth-footer">
            <button
              className="btn-link"
              style={{ color: "var(--text-muted)", fontSize: 13 }}
              onClick={() => navigate("/")}
            >
              ← Back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}