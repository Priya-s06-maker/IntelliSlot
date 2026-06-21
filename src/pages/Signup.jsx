import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  return score; // 0-3
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong"];
const STRENGTH_COLORS = ["", "#EF4444", "#F59E0B", "#10B981"];

export default function Signup() {
  const navigate = useNavigate();
  // const [form, setForm]        = useState({ name: "", email: "", password: "", confirm: "" });
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "user" });
  const [errors, setErrors]    = useState({});
  const [showPw, setShowPw]    = useState(false);
  const [showCf, setShowCf]    = useState(false);
  const [loading, setLoading]  = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (!form.confirm) {
      errs.confirm = "Please confirm your password.";
    } else if (form.password !== form.confirm) {
      errs.confirm = "Passwords do not match.";
    }
    //added new
    if (!form.role) { errs.role = "Please select a role."; }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

//     // Load existing users
//     let users = [];
//     try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}

//     // Seed admin
//     if (!users.find(u => u.email === "admin@intellislot.com")) {
//       users.push({ id: "admin-1", name: "Admin User", email: "admin@intellislot.com", password: "Admin@123", role: "admin" });
//     }

//     // Check duplicate email
//     const exists = users.find(u => u.email.toLowerCase() === form.email.trim().toLowerCase());
//     if (exists) {
//       setLoading(false);
//       toast.error("An account with this email already exists. Please sign in instead.");
//       setErrors({ email: "Account already exists with this email." });
//       return;
//     }

//     // Create new user
//     const initials = form.name.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//     // const newUser = {
//     //   id:        "user-" + Date.now(),
//     //   name:      form.name.trim(),
//     //   email:     form.email.trim().toLowerCase(),
//     //   password:  form.password,
//     //   role:      "user",
//     //   avatar:    initials,
//     //   createdAt: new Date().toISOString(),
//     // };
//     const newUser = { id: "user-" + Date.now(), name: form.name.trim(), email: form.email .trim() .toLowerCase(), password: form.password, role: form.role, role_id: form.role === "admin" ? 1 : 2, avatar: initials, createdAt: new Date() .toISOString(), };
//     users.push(newUser);
//     localStorage.setItem("is_users", JSON.stringify(users));
//     setLoading(false);

//     toast.success(`Account created! Welcome to IntelliSlot, ${newUser.name}! 🎉`);
//     // sessionStorage.setItem("is_session", JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }));
// sessionStorage.setItem( "is_session", JSON.stringify({ id:newUser.id, name:newUser.name, email:newUser.email, role:newUser.role, role_id:newUser.role_id }));
//     setTimeout(() => navigate("/user/dashboard"), 1200);
try {

const response =
await fetch(
"http://127.0.0.1:8001/signup",
{
method: "POST",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({
name:
form.name,

email:
form.email,

password:
form.password,

role:form.role
})
}
);

const data =
await response.json();

setLoading(false);

if (!response.ok) {

toast.error(
data.detail ||
"Signup failed"
);

return;

}

toast.success(
"Account created successfully 🎉"
);

sessionStorage.setItem(
"is_session",

JSON.stringify({
name:
form.name,

email:
form.email,

role:form.role
})
);

setTimeout(
() =>
navigate(
"/user/dashboard"
),

1000
);

}
catch {

setLoading(false);

toast.error(
"Backend not reachable"
);

}
  };

  const strength = getStrength(form.password);

  return (
    <div className="page-shell">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <div className="logo-badge">IS</div>
          <span className="logo-name">IntelliSlot</span>
        </div>
        <div className="navbar-actions">
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>Have an account?</span>
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">🚀</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Start scheduling smarter today — it's free</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className={`form-input${errors.name ? " error-field" : ""}`}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className={`form-input${errors.email ? " error-field" : ""}`}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>


<div className="form-group"> <label className="form-label">Account Type</label> <select className={`form-input${errors.role ? " error-field" : ""}`} name="role" value={form.role} onChange={handleChange} > <option value="user">User</option> <option value="admin">Admin</option> </select> {errors.role && ( <span className="field-error"> {errors.role} </span> )} </div>


            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  className={`form-input has-toggle${errors.password ? " error-field" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? "Hide" : "Show"}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}

              {/* Strength bar */}
              {form.password.length > 0 && (
                <>
                  <div className="strength-bar" style={{ marginTop: 8 }}>
                    {[1,2,3].map(i => (
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
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <input
                  className={`form-input has-toggle${errors.confirm ? " error-field" : ""}`}
                  type={showCf ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowCf(s => !s)}
                  aria-label={showCf ? "Hide" : "Show"}>
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
              {loading ? <><span className="spinner" />&nbsp;Creating Account…</> : "Create Account →"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="auth-footer">
            Already have an account?{" "}
            <button className="btn-link" onClick={() => navigate("/login")}>Sign in</button>
          </p>
          <p className="auth-footer">
            <button className="btn-link" style={{ color: "var(--text-muted)", fontSize: 13 }} onClick={() => navigate("/")}>
              ← Back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}