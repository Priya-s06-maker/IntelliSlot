import { useEffect, useState } from "react";

const navBtn = {
  width: "100%",
  padding: "14px 20px",
  marginBottom: "8px",
  border: "none",
  borderRadius: "12px",
  background: "#1E2937",
  color: "#E2E8F0",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "15px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "all 0.2s"
};

export default function AdminDashboard() {
  const session = JSON.parse(sessionStorage.getItem("is_session") || "{}");

  const [appointments, setAppointments] = useState([]);
  const now = new Date();

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending" && 
      new Date(`${a.appointment_date}T${a.appointment_time}`) > now).length,
    accepted:appointments.filter(a=>a.status==="accepted" && new Date(`${a.appointment_date}T${a.appointment_time}`)>now).length,
    cancelled: appointments.filter(a => ["cancelled", "rejected"].includes(a.status)).length,
    missed:
appointments.filter(
a=>

a.status==="accepted"

&&

new Date(
`${a.appointment_date}T${a.appointment_time}`
)

<

now
)
.length
  };

  async function loadAppointments() {
    try {
      const response = await fetch(`http://127.0.0.1:8001/admin/${session.id}/appointments`);
      const data = await response.json();
      setAppointments(data.sort((a, b) => {
        const order = { pending: 1, accepted: 2, cancelled: 3, rejected: 3, missed: 4 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      }));
    } catch (err) {
      console.error("Failed to load appointments", err);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id, status) {
    await fetch(`http://127.0.0.1:8001/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    loadAppointments();
  }

  const statCards = [
    { icon: "📋", label: "Total", value: stats.total, color: "#64748B" },
    { icon: "⏳", label: "Pending", value: stats.pending, color: "#FBBF24" },
    { icon: "✅", label: "Accepted", value: stats.accepted, color: "#34D399" },
    { icon: "❌", label: "Cancelled", value: stats.cancelled, color: "#EF4444" },
    { icon: "⌛", label: "Missed", value: stats.missed, color: "#8B5CF6" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F172A",
      display: "flex",
      color: "#E2E8F0",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        background: "#1E2937",
        padding: "24px",
        borderRight: "1px solid #334155"
      }}>
        <h2 style={{ color: "#60A5FA", marginBottom: "40px", fontSize: "28px" }}>IntelliSlot</h2>
        
        <div>
          <button style={{ ...navBtn, background: "#3B82F6", color: "white" }}>📊 Dashboard</button>
          <button style={navBtn}>👤 Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "32px" }}>Admin Dashboard</h1>

        {/* Stats Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          {statCards.map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#1E2937",
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${stat.color}22`,
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgb(0 0 0 / 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "42px", marginBottom: "12px", opacity: 0.9 }}>{stat.icon}</div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ color: "#94A3B8", fontSize: "15px", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "24px", marginBottom: "8px" }}>Appointments</h3>
          <h4 style={{ color: "#94A3B8", fontWeight: "500" }}>Action Queue</h4>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "20px"
        }}>
          {appointments.map(a => (
            <div
              key={a.appointment_id}
              style={{
                background: "#1E2937",
                borderRadius: "16px",
                padding: "24px",
                borderLeft: `5px solid ${
                  a.status === "pending" ? "#FBBF24" :
                  a.status === "accepted" ? "#34D399" : "#EF4444"
                }`,
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "22px" }}>👤</span>
                    <h3 style={{ margin: 0, fontSize: "20px" }}>{a.user_name}</h3>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "15px" }}>
                    🏢 {a.room_name}
                  </div>
                </div>

                <span style={{
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: "600",
                  background: a.status === "pending" ? "#78350F" :
                             a.status === "accepted" ? "#14532D" : "#7F1D1D",
                  color: a.status === "pending" ? "#FDE047" :
                        a.status === "accepted" ? "#34D399" : "#F87171"
                }}>
                  {a.status.toUpperCase()}
                </span>
              </div>

              <div style={{ color: "#CBD5E1", lineHeight: "1.7", marginBottom: "20px" }}>
                <div><strong>📝</strong> {a.appointment_title}</div>
                <div><strong>📅</strong> {a.appointment_date}</div>
                <div><strong>⏰</strong> {a.appointment_time?.slice(0, 5)}</div>
              </div>

              {a.status === "pending" && (
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <button
                    onClick={() => updateStatus(a.appointment_id, "accepted")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#34D399",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => updateStatus(a.appointment_id, "rejected")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#EF4444",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}