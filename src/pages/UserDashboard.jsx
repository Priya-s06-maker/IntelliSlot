import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashHome from "./user/DashHome";
import BookAppointment from "./user/BookAppointment";
import MyAppointments from "./user/MyAppointments";
import UserProfile from "./user/UserProfile";

const NAV_ITEMS = [
  { key: "home",         icon: "⚡", label: "Dashboard"       },
  { key: "book",         icon: "➕", label: "Book Appointment" },
  { key: "appointments", icon: "🗓️", label: "My Appointments"  },
  { key: "profile",      icon: "👤", label: "Profile"          },
];

export default function UserDashboard() {
  const navigate    = useNavigate();
  const [active, setActive]       = useState("home");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]           = useState(null);

  useEffect(() => {
    const session = sessionStorage.getItem("is_session");
    if (!session) { navigate("/login"); return; }
    const u = JSON.parse(session);
    if (u.role === "admin") { navigate("/admin/dashboard"); return; }
    setUser(u);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("is_session");
    toast.success("Logged out successfully. See you soon! 👋");
    setTimeout(() => navigate("/login"), 800);
  };

  if (!user) return null;

  const pages = {
    home:         <DashHome         user={user} setActive={setActive} />,
    book:         <BookAppointment  user={user} setActive={setActive} />,
    appointments: <MyAppointments   user={user} />,
    profile:      <UserProfile      user={user} setUser={setUser} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-deep)", fontFamily: "var(--font-body)" }}>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? "72px" : "240px",
        minHeight: "100vh",
        background: "#080D1A",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "sticky", top: 0, height: "100vh",
        zIndex: 50, flexShrink: 0,
        // Mobile: slide in
        ...(window.innerWidth < 768 ? {
          position: "fixed", left: mobileOpen ? 0 : "-240px",
          width: "240px", transition: "left 0.3s ease",
        } : {}),
      }}>
        {/* Logo */}
        <div style={{
          height: 68, display: "flex", alignItems: "center",
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1px solid var(--border)",
          gap: 10, overflow: "hidden",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#fff",
          }}>IS</div>
          {!collapsed && (
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: 18, color: "var(--text-primary)", whiteSpace: "nowrap",
              letterSpacing: "-0.3px",
            }}>IntelliSlot</span>
          )}
        </div>

        {/* User mini card */}
        {!collapsed && (
          <div style={{
            margin: "16px 12px 8px",
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 12, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, color: "#fff",
            }}>{user.name?.slice(0,2).toUpperCase()}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>User</div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActive(item.key); setMobileOpen(false); }}
                style={{
                  display: "flex", alignItems: "center",
                  gap: 12, padding: collapsed ? "11px 0" : "11px 14px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 10, border: "none", cursor: "pointer",
                  background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  color: isActive ? "var(--accent-light)" : "var(--text-secondary)",
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s", position: "relative", width: "100%",
                  borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
                title={collapsed ? item.label : ""}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle + Logout */}
        <div style={{ padding: "10px 10px 20px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "10px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "var(--text-muted)",
              fontFamily: "var(--font-body)", fontSize: 13,
              transition: "all 0.2s", width: "100%",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
            title={collapsed ? "Expand sidebar" : ""}
          >
            <span style={{ fontSize: 16 }}>{collapsed ? "→" : "←"}</span>
            {!collapsed && <span>Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "10px 0" : "10px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: "transparent", color: "#EF4444",
              fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
              transition: "all 0.2s", width: "100%",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            title={collapsed ? "Logout" : ""}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          height: 68, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 28px",
          borderBottom: "1px solid var(--border)",
          background: "rgba(8,13,26,0.8)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{
                display: window.innerWidth < 768 ? "flex" : "none",
                background: "none", border: "none", color: "var(--text-secondary)",
                fontSize: 22, cursor: "pointer", padding: 4,
              }}
            >☰</button>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: 20, color: "var(--text-primary)", margin: 0,
              }}>
                {NAV_ITEMS.find(n => n.key === active)?.label}
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setActive("book")}
              style={{
                background: "linear-gradient(135deg, var(--accent), #818CF8)",
                border: "none", color: "#fff", padding: "8px 18px",
                borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span>+</span> New Booking
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--cyan))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, color: "#fff", cursor: "pointer",
              flexShrink: 0,
            }}
              onClick={() => setActive("profile")}
              title="Profile"
            >
              {user.name?.slice(0,2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {pages[active]}
        </main>
      </div>
    </div>
  );
}