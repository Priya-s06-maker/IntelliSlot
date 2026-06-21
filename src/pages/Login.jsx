import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    }
    return errs;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errs = validate();
  //   if (Object.keys(errs).length) { setErrors(errs); return; }

  //   setLoading(true);
  //   await new Promise(r => setTimeout(r, 700));

  //   // Load users from localStorage
  //   let users = [];
  //   try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}

  //   // Seed admin if not present
  //   const adminExists = users.find(u => u.email === "admin@intellislot.com");
  //   if (!adminExists) {
  //     users.push({ id: "admin-1", name: "Admin User", email: "admin@intellislot.com", password: "Admin@123", role: "admin" });
  //     localStorage.setItem("is_users", JSON.stringify(users));
  //   }

  //   const user = users.find(
  //     u => u.email.toLowerCase() === form.email.trim().toLowerCase() &&
  //          u.password === form.password
  //   );

  //   setLoading(false);

  //   if (!user) {
  //     // Be specific about what's wrong
  //     const emailMatch = users.find(u => u.email.toLowerCase() === form.email.trim().toLowerCase());
  //     if (!emailMatch) {
  //       toast.error("No account found with this email address.");
  //       setErrors({ email: "No account found with this email." });
  //     } else {
  //       toast.error("Incorrect password. Please try again.");
  //       setErrors({ password: "Incorrect password." });
  //     }
  //     return;
  //   }

  //   toast.success(`Welcome back, ${user.name}! 👋`);
  //   sessionStorage.setItem("is_session", JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));

  //   setTimeout(() => {
  //     navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
  //   }, 800);
  // };
const handleSubmit = async (e) => {

e.preventDefault();

const errs = validate();

if (Object.keys(errs).length) {
setErrors(errs);
return;
}

setLoading(true);

try {

const response =
await fetch(
"http://127.0.0.1:8001/login",
{
method: "POST",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({
email:
form.email,

password:
form.password
})
}
);

const data =
await response.json();

setLoading(false);

if (
!response.ok
||
data.detail
) {

if (
data.detail ===
"No account found"
) {

setErrors({
email:
"No account found with this email."
});

}

else {

setErrors({
password:
"Incorrect password."
});

}

toast.error(
data.detail ||
"Login failed"
);

return;

}

toast.success(
`Welcome back, ${data.name}! 👋`
);

sessionStorage.setItem(
"is_session",

JSON.stringify({

id:
data.user_id,

name:
data.name,

email:
data.email,

role_id:
data.role_id

})
);

setTimeout(
() => {

navigate(
data.role_id === 1
?
"/admin/dashboard"
:
"/user/dashboard"
);

},

800
);

}

catch {

setLoading(false);

toast.error(
"Backend not reachable"
);

}

};
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
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>No account?</span>
          <button className="btn btn-primary" onClick={() => navigate("/signup")}>Sign Up Free</button>
        </div>
      </nav>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">👋</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your IntelliSlot account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
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

            {/* Password */}
            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Password</span>
                <button type="button" className="btn-link" style={{ fontSize: 12 }} onClick={() => navigate("/forgot")}>
                  Forgot password?
                </button>
              </label>
              <div className="input-wrap">
                <input
                  className={`form-input has-toggle${errors.password ? " error-field" : ""}`}
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPw(s => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? <><span className="spinner" /> &nbsp;Signing In…</> : "Sign In →"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="auth-footer">
            Don't have an account?{" "}
            <button className="btn-link" onClick={() => navigate("/signup")}>Create one free</button>
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