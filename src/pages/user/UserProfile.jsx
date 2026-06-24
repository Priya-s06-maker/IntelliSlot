import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getUserAppointments, syncAppointmentStatuses } from "../../utils/appointments";

export default function UserProfile({ user, setUser }) {
  const [tab, setTab]          = useState("info");
  const [appts, setAppts]      = useState([]);
  const [editName, setEditName]  = useState(user.name);
  const [nameErr, setNameErr]   = useState("");
  const [savingName, setSavingName] = useState(false);

  const [pwForm, setPwForm]    = useState({ current: "", newPw: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [showPw, setShowPw]    = useState({ current: false, newPw: false, confirm: false });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    syncAppointmentStatuses();
    setAppts(getUserAppointments(user.id));
  }, [user.id]);

  const upcoming  = appts.filter(a => a.status === "upcoming").length;
  const completed = appts.filter(a => a.status === "completed").length;
  const cancelled = appts.filter(a => a.status === "cancelled").length;

  // ── Save name ──
//   const handleSaveName = async () => {
//     if (!editName.trim()) { setNameErr("Name cannot be empty."); return; }
//     if (editName.trim().length < 2) { setNameErr("Name must be at least 2 characters."); return; }
//     setNameErr("");
//     setSavingName(true);
//     await new Promise(r => setTimeout(r, 600));

//     let users = [];
//     try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}
//     const idx = users.findIndex(u => u.id === user.id);
//     if (idx !== -1) {
//       users[idx].name = editName.trim();
//       localStorage.setItem("is_users", JSON.stringify(users));
//     }
//     const updated = { ...user, name: editName.trim() };
//     sessionStorage.setItem("is_session", JSON.stringify(updated));
//     setUser(updated);
//     setSavingName(false);
//     toast.success("✅ Name updated successfully!");
//   };
const handleSaveName = async () => {

if (!editName.trim()) {
setNameErr("Name cannot be empty.");
return;
}

if (editName.trim().length < 2) {
setNameErr("Name must be at least 2 characters.");
return;
}

setNameErr("");
setSavingName(true);

try {

const response =
await fetch(
"http://127.0.0.1:8001/profile/update",
{
method: "PUT",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({
email: user.email,
name: editName.trim()
})
}
);

const data =
await response.json();

setSavingName(false);

if (!response.ok) {

toast.error(
data.detail ||
"Update failed"
);

return;

}

const updated = {
...user,
name: editName.trim()
};

sessionStorage.setItem(
"is_session",
JSON.stringify(updated)
);

setUser(updated);

toast.success(
"✅ Profile updated successfully!"
);

}
catch {

setSavingName(false);

toast.error(
"Backend not reachable"
);

}

};
  // ── Change password ──
  const handleChangePw = async (e) => {

e.preventDefault();

const errs = {};

if (!pwForm.current)
errs.current =
"Current password is required.";

if (!pwForm.newPw)
errs.newPw =
"New password is required.";

if (
pwForm.newPw &&
pwForm.newPw.length < 6
)
errs.newPw =
"Must be at least 6 characters.";

if (
pwForm.newPw !==
pwForm.confirm
)
errs.confirm =
"Passwords do not match.";

if (
Object.keys(errs).length
) {

setPwErrors(errs);

return;

}

setSavingPw(true);

try {

const response =
await fetch(
"http://127.0.0.1:8001/profile/change-password",
{
method: "PUT",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({
email:
user.email,

current_password:
pwForm.current,

new_password:
pwForm.newPw
})
}
);

const data =
await response.json();

setSavingPw(false);

if (!response.ok) {

toast.error(
data.detail
);

return;

}

setPwForm({
current: "",
newPw: "",
confirm: ""
});

setPwErrors({});

toast.success(
"🔐 Password updated successfully!"
);

}
catch {

setSavingPw(false);

toast.error(
"Backend not reachable"
);

}

};
//   const handleChangePw = async (e) => {
//     e.preventDefault();
//     const errs = {};
//     // Check current password
//     let users = [];
//     try { users = JSON.parse(localStorage.getItem("is_users") || "[]"); } catch {}
//     const me = users.find(u => u.id === user.id);
//     if (!pwForm.current) { errs.current = "Current password is required."; }
//     else if (me && me.password !== pwForm.current) { errs.current = "Current password is incorrect."; }
//     if (!pwForm.newPw) { errs.newPw = "New password is required."; }
//     else if (pwForm.newPw.length < 6) { errs.newPw = "Must be at least 6 characters."; }
//     else if (pwForm.newPw === pwForm.current) { errs.newPw = "New password must differ from current."; }
//     if (!pwForm.confirm) { errs.confirm = "Please confirm your new password."; }
//     else if (pwForm.newPw !== pwForm.confirm) { errs.confirm = "Passwords do not match."; }

//     if (Object.keys(errs).length) { setPwErrors(errs); return; }

//     setSavingPw(true);
//     await new Promise(r => setTimeout(r, 700));
//     const idx = users.findIndex(u => u.id === user.id);
//     if (idx !== -1) {
//       users[idx].password = pwForm.newPw;
//       localStorage.setItem("is_users", JSON.stringify(users));
//     }
//     setSavingPw(false);
//     setPwForm({ current: "", newPw: "", confirm: "" });
//     setPwErrors({});
//     toast.success("🔐 Password changed successfully!");
//   };

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "var(--bg-input)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "11px 14px",
    color: "var(--text-primary)", fontSize: 14,
    fontFamily: "var(--font-body)", outline: "none",
  };
  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.5px",
    color: "var(--text-secondary)", marginBottom: 8,
  };

  return (
    <div style={{ maxWidth: 680 }}>

      {/* Avatar card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 20, padding: "28px 32px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--cyan))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "#fff",
          flexShrink: 0,
        }}>{user.name?.slice(0,2).toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--text-primary)", margin: "0 0 4px" }}>{user.name}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: "0 0 12px" }}>{user.email}</p>
        
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#0F172A", border: "1px solid var(--border)", borderRadius: 12, padding: 4, marginBottom: 20, width: "fit-content" }}>
        {[
          { key: "info", label: "👤 Profile Info" },
          { key: "password", label: "🔐 Change Password" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "9px 20px", borderRadius: 9, border: "none", cursor: "pointer",
            background: tab === t.key ? "var(--accent)" : "transparent",
            color: tab === t.key ? "#fff" : "var(--text-muted)",
            fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
            fontFamily: "var(--font-body)", transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background: "#0F172A", border: "1px solid var(--border)", borderRadius: 16, padding: "28px" }}>

        {/* Profile Info tab */}
        {tab === "info" && (
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", margin: "0 0 22px" }}>Personal Information</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                value={editName}
                onChange={e => { setEditName(e.target.value); if (nameErr) setNameErr(""); }}
                style={{ ...inputStyle, borderColor: nameErr ? "#EF4444" : undefined }}
                placeholder="Your name"
              />
              {nameErr && <span style={{ color: "#EF4444", fontSize: 12, marginTop: 5, display: "block" }}>{nameErr}</span>}
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                value={user.email} disabled
                style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 5, display: "block" }}>
                Email cannot be changed.
              </span>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Account Role</label>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 8, padding: "8px 16px",
                color: "var(--accent-light)", fontSize: 13, fontWeight: 600,
              }}>
                👤 User
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Member Since</label>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            <button
              onClick={handleSaveName}
              disabled={savingName || editName.trim() === user.name}
              style={{
                background: savingName || editName.trim() === user.name
                  ? "rgba(99,102,241,0.4)"
                  : "linear-gradient(135deg, var(--accent), #818CF8)",
                border: "none", color: "#fff", padding: "12px 28px",
                borderRadius: 10, cursor: savingName || editName.trim() === user.name ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {savingName ? <><span className="spinner" /> Saving…</> : "Save Changes"}
            </button>
          </div>
        )}

        {/* Change Password tab */}
        {tab === "password" && (
          <form onSubmit={handleChangePw} noValidate>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text-primary)", margin: "0 0 22px" }}>Change Password</h3>

            {["current", "newPw", "confirm"].map((field) => {
              const labels = { current: "Current Password", newPw: "New Password", confirm: "Confirm New Password" };
              return (
                <div key={field} style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>{labels[field]}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw[field] ? "text" : "password"}
                      value={pwForm[field]}
                      onChange={e => {
                        setPwForm(f => ({ ...f, [field]: e.target.value }));
                        if (pwErrors[field]) setPwErrors(er => ({ ...er, [field]: "" }));
                      }}
                      style={{ ...inputStyle, paddingRight: 44, borderColor: pwErrors[field] ? "#EF4444" : undefined }}
                      placeholder={field === "current" ? "Your current password" : "Min. 6 characters"}
                    />
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18 }}>
                      {showPw[field] ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {pwErrors[field] && <span style={{ color: "#EF4444", fontSize: 12, marginTop: 5, display: "block" }}>{pwErrors[field]}</span>}
                  {field === "confirm" && !pwErrors.confirm && pwForm.confirm && pwForm.newPw === pwForm.confirm && (
                    <span style={{ color: "#10B981", fontSize: 12, marginTop: 5, display: "block" }}>✓ Passwords match</span>
                  )}
                </div>
              );
            })}

            <button type="submit" disabled={savingPw} style={{
              marginTop: 8,
              background: savingPw ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, var(--accent), #818CF8)",
              border: "none", color: "#fff", padding: "12px 28px",
              borderRadius: 10, cursor: savingPw ? "not-allowed" : "pointer",
              fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {savingPw ? <><span className="spinner" /> Updating…</> : "🔐 Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}