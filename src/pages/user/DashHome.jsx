// import { useState, useEffect } from "react";
// import {
//   getUserAppointments, syncAppointmentStatuses,
//   formatDate, formatTime, getTypeColor, getStatusColor
// } from "../../utils/appointments";

// function StatCard({ icon, label, value, sub, color }) {
//   return (
//     <div style={{
//       background: "#0F172A", border: "1px solid var(--border)",
//       borderRadius: 16, padding: "22px 24px",
//       display: "flex", alignItems: "flex-start", gap: 16,
//       transition: "border-color 0.2s",
//       cursor: "default",
//     }}
//       onMouseEnter={e => e.currentTarget.style.borderColor = color || "rgba(99,102,241,0.3)"}
//       onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
//     >
//       <div style={{
//         width: 48, height: 48, borderRadius: 12, flexShrink: 0,
//         background: `${color}20` || "rgba(99,102,241,0.12)",
//         border: `1px solid ${color}30` || "1px solid rgba(99,102,241,0.2)",
//         display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
//       }}>{icon}</div>
//       <div>
//         <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
//         <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{value}</div>
//         {sub && <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>{sub}</div>}
//       </div>
//     </div>
//   );
// }

// function AppointmentRow({ appt, compact }) {
//   const tc = getTypeColor(appt.type);
//   const sc = getStatusColor(appt.status);
//   return (
//     <div style={{
//       display: "flex", alignItems: "center", gap: 14,
//       padding: compact ? "12px 16px" : "16px 20px",
//       borderBottom: "1px solid var(--border)",
//       transition: "background 0.15s",
//     }}
//       onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
//       onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//     >
//       {/* Type dot */}
//       <div style={{
//         width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//         background: tc.bg, border: `1px solid ${tc.border}`,
//         display: "flex", alignItems: "center", justifyContent: "center",
//         fontSize: 16,
//       }}>
//         {appt.type === "meeting"   ? "🤝" :
//          appt.type === "review"   ? "📋" :
//          appt.type === "interview"? "💼" :
//          appt.type === "personal" ? "👤" : "📌"}
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{appt.title}</div>
//         <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
//           {formatDate(appt.date)} · {formatTime(appt.time)} · {appt.duration}min
//         </div>
//       </div>
//       <div style={{
//         padding: "3px 10px", borderRadius: 100,
//         background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 600,
//         flexShrink: 0, textTransform: "capitalize",
//       }}>{appt.status}</div>
//     </div>
//   );
// }

// export default function DashHome({ user, setActive }) {
//   const [appts, setAppts] = useState([]);

//   useEffect(() => {
//     syncAppointmentStatuses();
//     setAppts(getUserAppointments(user.id));
//   }, [user.id]);

//   const upcoming  = appts.filter(a => a.status === "upcoming");
//   const completed = appts.filter(a => a.status === "completed");
//   const cancelled = appts.filter(a => a.status === "cancelled");

//   // Today's appointments
//   const today = new Date().toISOString().split("T")[0];
//   const todayAppts = upcoming.filter(a => a.date === today);

//   // This week's upcoming
//   const now = new Date();
//   const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
//   const thisWeek = upcoming.filter(a => {
//     const d = new Date(a.date);
//     return d >= now && d <= weekEnd;
//   }).sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));

//   // Next appointment
//   const next = upcoming
//     .filter(a => new Date(a.date + "T" + a.time) >= now)
//     .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time))[0];

//   const greeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return "Good morning";
//     if (h < 17) return "Good afternoon";
//     return "Good evening";
//   };

//   return (
//     <div style={{ maxWidth: 1100 }}>

//       {/* ── Greeting banner ── */}
//       <div style={{
//         background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,238,0.08))",
//         border: "1px solid rgba(99,102,241,0.2)",
//         borderRadius: 20, padding: "28px 32px", marginBottom: 28,
//         display: "flex", justifyContent: "space-between", alignItems: "center",
//         flexWrap: "wrap", gap: 16,
//         position: "relative", overflow: "hidden",
//       }}>
//         {/* bg glow */}
//         <div style={{
//           position: "absolute", right: -60, top: -60,
//           width: 200, height: 200, borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)",
//           pointerEvents: "none",
//         }} />
//         <div>
//           <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 6px" }}>
//             {greeting()}, 👋
//           </p>
//           <h2 style={{
//             fontFamily: "var(--font-display)", fontWeight: 800,
//             fontSize: 28, color: "var(--text-primary)", margin: "0 0 8px",
//             letterSpacing: "-0.5px",
//           }}>{user.name}</h2>
//           <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
//             {todayAppts.length === 0
//               ? "You have no appointments today. Enjoy the free time!"
//               : `You have ${todayAppts.length} appointment${todayAppts.length > 1 ? "s" : ""} today.`}
//           </p>
//         </div>
//         <button
//           onClick={() => setActive("book")}
//           style={{
//             background: "linear-gradient(135deg, var(--accent), #818CF8)",
//             border: "none", color: "#fff", padding: "12px 24px",
//             borderRadius: 10, cursor: "pointer", fontSize: 14,
//             fontWeight: 600, fontFamily: "var(--font-body)",
//             display: "flex", alignItems: "center", gap: 8,
//             zIndex: 1,
//           }}
//         >
//           <span style={{ fontSize: 18 }}>➕</span> Book Appointment
//         </button>
//       </div>

//       {/* ── Stats ── */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//         gap: 16, marginBottom: 28,
//       }}>
//         <StatCard icon="🗓️" label="Total Booked"  value={appts.length}     sub="All time"         color="#6366F1" />
//         <StatCard icon="⏳" label="Upcoming"      value={upcoming.length}  sub="Scheduled ahead"  color="#22D3EE" />
//         <StatCard icon="✅" label="Completed"     value={completed.length} sub="Successfully done" color="#10B981" />
//         <StatCard icon="❌" label="Cancelled"     value={cancelled.length} sub="Cancelled slots"   color="#EF4444" />
//       </div>

//       {/* ── Two columns: Next up + This week ── */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>

//         {/* Next appointment */}
//         <div style={{ background: "#0F172A", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
//           <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>⚡ Next Up</h3>
//           </div>
//           {next ? (
//             <div style={{ padding: "20px" }}>
//               <div style={{
//                 background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
//                 borderRadius: 12, padding: "16px 18px",
//               }}>
//                 <div style={{
//                   display: "inline-flex", padding: "3px 10px", borderRadius: 100,
//                   background: getTypeColor(next.type).bg, color: getTypeColor(next.type).text,
//                   fontSize: 11, fontWeight: 600, marginBottom: 10, textTransform: "capitalize",
//                 }}>{next.type}</div>
//                 <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{next.title}</div>
//                 <div style={{ color: "var(--accent-light)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
//                   📅 {formatDate(next.date)}
//                 </div>
//                 <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
//                   🕐 {formatTime(next.time)} · {next.duration} min
//                 </div>
//                 {next.location && (
//                   <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
//                     📍 {next.location}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div style={{ padding: "40px 20px", textAlign: "center" }}>
//               <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
//               <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No upcoming appointments.</p>
//               <button onClick={() => setActive("book")} style={{
//                 marginTop: 12, background: "var(--accent)", border: "none",
//                 color: "#fff", padding: "8px 18px", borderRadius: 8,
//                 cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)",
//               }}>Book one now</button>
//             </div>
//           )}
//         </div>

//         {/* This week */}
//         <div style={{ background: "#0F172A", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
//           <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>📅 This Week</h3>
//             <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{thisWeek.length} upcoming</span>
//           </div>
//           {thisWeek.length === 0 ? (
//             <div style={{ padding: "40px 20px", textAlign: "center" }}>
//               <div style={{ fontSize: 36, marginBottom: 12 }}>😌</div>
//               <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Nothing this week.</p>
//             </div>
//           ) : (
//             <div style={{ maxHeight: 240, overflowY: "auto" }}>
//               {thisWeek.slice(0, 5).map(a => <AppointmentRow key={a.id} appt={a} compact />)}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Recent activity ── */}
//       <div style={{ background: "#0F172A", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
//         <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>🕐 Recent Activity</h3>
//           <button onClick={() => setActive("appointments")} style={{
//             background: "none", border: "none", color: "var(--accent-light)",
//             fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)",
//           }}>View all →</button>
//         </div>
//         {appts.length === 0 ? (
//           <div style={{ padding: "48px 20px", textAlign: "center" }}>
//             <div style={{ fontSize: 42, marginBottom: 14 }}>📭</div>
//             <p style={{ color: "var(--text-secondary)", fontWeight: 600, marginBottom: 6 }}>No appointments yet</p>
//             <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Your scheduling journey starts here.</p>
//             <button onClick={() => setActive("book")} style={{
//               background: "linear-gradient(135deg, var(--accent), #818CF8)",
//               border: "none", color: "#fff", padding: "10px 24px",
//               borderRadius: 8, cursor: "pointer", fontSize: 14,
//               fontWeight: 600, fontFamily: "var(--font-body)",
//             }}>Book Your First Appointment</button>
//           </div>
//         ) : (
//           [...appts]
//             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//             .slice(0, 5)
//             .map(a => <AppointmentRow key={a.id} appt={a} />)
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  getUserAppointments,
  syncAppointmentStatuses,
  getNotifications,
  markAllNotificationsRead,
  getUnreadCount,
  formatDate,
  formatTime,
  getStatusColor,
  ROOMS,
} from "../../utils/appointments";

export default function DashHome() {
  const session = JSON.parse(sessionStorage.getItem("is_session") || "null");
  const [appts, setAppts]   = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  function load() {
    syncAppointmentStatuses();
    const a = getUserAppointments(session.id);
    setAppts(a);
    setNotifs(getNotifications(session.id));
  }

  useEffect(() => { load(); }, []);

  const now = new Date();

  const upcoming = appts.filter(a =>
    ["pending","approved"].includes(a.status) && new Date(`${a.date}T${a.time}`) > now
  ).sort((a,b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const thisWeekEnd = new Date(now);
  thisWeekEnd.setDate(now.getDate() + 7);

  const thisWeek = upcoming.filter(a => {
    const d = new Date(`${a.date}T${a.time}`);
    return d >= now && d <= thisWeekEnd;
  });

  const stats = [
    { label: "Total",     value: appts.length,                                            icon: "📋", color: "#818CF8" },
    { label: "Upcoming",  value: upcoming.length,                                          icon: "🗓️", color: "#22D3EE" },
    { label: "Approved",  value: appts.filter(a => a.status==="approved").length,          icon: "✅", color: "#10B981" },
    { label: "Pending",   value: appts.filter(a => a.status==="pending").length,           icon: "⏳", color: "#FBB444" },
  ];

  const next = upcoming[0];
  const unread = notifs.filter(n => !n.read).length;

  function handleNotifOpen() {
    setShowNotifs(true);
    markAllNotificationsRead(session.id);
    setNotifs(getNotifications(session.id));
  }

  const S = styles;

  return (
    <div style={S.page}>
      {/* Top bar with greeting + bell */}
      <div style={S.topBar}>
        <div>
          <h2 style={S.greeting}>Good {getGreeting()}, {session?.name?.split(" ")[0]} 👋</h2>
          <p style={S.sub}>Here's what's on your schedule today.</p>
        </div>
        <button style={S.bellBtn} onClick={handleNotifOpen}>
          🔔
          {unread > 0 && <span style={S.badge}>{unread}</span>}
        </button>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <span style={{ ...S.statValue, color: s.color }}>{s.value}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Next Up */}
      {next ? (
        <div style={S.nextCard}>
          <div style={S.nextLabel}>⚡ Next Appointment</div>
          <h3 style={S.nextTitle}>{next.title}</h3>
          <div style={S.nextMeta}>
            <span>📅 {formatDate(next.date)}</span>
            <span>⏰ {formatTime(next.time)}</span>
            <span>⏱ {next.duration} min</span>
            <span>{ROOMS.find(r=>r.id===next.roomId)?.label || next.roomId}</span>
          </div>
          <div style={{ ...S.statusPill, ...getStatusPillStyle(next.status) }}>
            {next.status}
          </div>
        </div>
      ) : (
        <div style={S.emptyNext}>
          <span style={{ fontSize: 32 }}>🗓️</span>
          <p style={{ color: "#64748B", margin: "8px 0 0" }}>No upcoming appointments. Book one!</p>
        </div>
      )}

      {/* This Week */}
      {thisWeek.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>This Week</div>
          <div style={S.weekList}>
            {thisWeek.slice(0,5).map(a => {
              const sc = getStatusColor(a.status);
              const room = ROOMS.find(r => r.id === a.roomId);
              return (
                <div key={a.id} style={S.weekItem}>
                  <div style={S.weekLeft}>
                    <span style={S.weekDay}>{new Date(a.date+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}</span>
                    <span style={S.weekDate}>{new Date(a.date+"T00:00:00").getDate()}</span>
                  </div>
                  <div style={S.weekInfo}>
                    <span style={S.weekTitle}>{a.title}</span>
                    <span style={S.weekMeta}>{formatTime(a.time)} · {room?.label}</span>
                  </div>
                  <span style={{ ...S.miniStatus, background: sc.bg, color: sc.text }}>{a.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifs && (
        <div style={S.overlay} onClick={() => setShowNotifs(false)}>
          <div style={S.notifPanel} onClick={e => e.stopPropagation()}>
            <div style={S.notifHeader}>
              <span style={S.notifTitle}>Notifications</span>
              <button style={S.closeBtn} onClick={() => setShowNotifs(false)}>✕</button>
            </div>
            {notifs.length === 0 ? (
              <div style={{ color:"#64748B", fontSize:14, padding:"30px 0", textAlign:"center" }}>
                No notifications yet.
              </div>
            ) : (
              <div style={S.notifList}>
                {notifs.map(n => (
                  <div key={n.id} style={S.notifItem}>
                    <span style={S.notifIcon}>{getNotifIcon(n.type)}</span>
                    <div>
                      <p style={S.notifMsg}>{n.message}</p>
                      <p style={S.notifTime}>{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

function getStatusPillStyle(status) {
  const map = {
    pending:   { background:"rgba(245,158,11,0.15)", color:"#FBB444" },
    approved:  { background:"rgba(16,185,129,0.15)", color:"#10B981" },
    rejected:  { background:"rgba(239,68,68,0.15)",  color:"#EF4444" },
    completed: { background:"rgba(99,102,241,0.15)", color:"#818CF8" },
    cancelled: { background:"rgba(148,163,184,0.12)",color:"#94A3B8" },
  };
  return map[status] || map.pending;
}

function getNotifIcon(type) {
  const map = { approved:"✅", rejected:"❌", "auto-declined":"⚠️", "room-conflict":"🔴" };
  return map[type] || "🔔";
}

const styles = {
  page: { padding: "0 0 40px" },

  topBar: { alignItems: "flex-start", display: "flex", justifyContent: "space-between", marginBottom: 28 },
  greeting: { color: "#F1F5F9", fontSize: 26, fontWeight: 700, margin: "0 0 4px" },
  sub: { color: "#64748B", fontSize: 14, margin: 0 },

  bellBtn: {
    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 12, color: "#F1F5F9", cursor: "pointer", fontSize: 20,
    padding: "10px 14px", position: "relative", flexShrink: 0,
  },
  badge: {
    background: "#EF4444", borderRadius: "50%", color: "#fff", fontSize: 10,
    fontWeight: 700, padding: "1px 5px", position: "absolute", right: -4, top: -4,
  },

  statsGrid: { display: "grid", gap: 14, gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 },
  statCard: {
    alignItems: "center", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.18)",
    borderRadius: 14, display: "flex", flexDirection: "column", gap: 6, padding: "20px 12px",
  },
  statValue: { fontSize: 28, fontWeight: 800 },
  statLabel: { color: "#64748B", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" },

  nextCard: {
    background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))",
    border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16,
    marginBottom: 24, padding: "22px 24px",
  },
  nextLabel: { color: "#818CF8", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8, textTransform: "uppercase" },
  nextTitle: { color: "#F1F5F9", fontSize: 20, fontWeight: 700, margin: "0 0 10px" },
  nextMeta: { color: "#64748B", display: "flex", flexWrap: "wrap", fontSize: 13, gap: 16, marginBottom: 14 },
  statusPill: {
    alignSelf: "flex-start", borderRadius: 8, display: "inline-block",
    fontSize: 12, fontWeight: 700, padding: "4px 12px", textTransform: "capitalize",
  },

  emptyNext: {
    alignItems: "center", background: "rgba(15,23,42,0.5)", border: "1px dashed rgba(99,102,241,0.2)",
    borderRadius: 16, display: "flex", flexDirection: "column", marginBottom: 24, padding: "40px 20px",
  },

  section: { marginBottom: 24 },
  sectionTitle: { color: "#94A3B8", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 12, textTransform: "uppercase" },

  weekList: { display: "flex", flexDirection: "column", gap: 10 },
  weekItem: {
    alignItems: "center", background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.15)",
    borderRadius: 12, display: "flex", gap: 16, padding: "14px 18px",
  },
  weekLeft: { alignItems: "center", display: "flex", flexDirection: "column", gap: 2, minWidth: 36 },
  weekDay: { color: "#64748B", fontSize: 11, fontWeight: 600, textTransform: "uppercase" },
  weekDate: { color: "#818CF8", fontSize: 20, fontWeight: 800 },
  weekInfo: { display: "flex", flex: 1, flexDirection: "column", gap: 3 },
  weekTitle: { color: "#F1F5F9", fontSize: 14, fontWeight: 600 },
  weekMeta: { color: "#64748B", fontSize: 12 },
  miniStatus: { borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "3px 9px", textTransform: "capitalize" },

  overlay: {
    alignItems: "center", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
    bottom: 0, display: "flex", justifyContent: "center", left: 0,
    position: "fixed", right: 0, top: 0, zIndex: 1000,
  },
  notifPanel: {
    background: "#0F172A", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 18,
    maxHeight: "80vh", maxWidth: 420, overflowY: "auto", padding: 24, width: "90%",
  },
  notifHeader: { alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 18 },
  notifTitle: { color: "#F1F5F9", fontSize: 18, fontWeight: 700 },
  closeBtn: {
    background: "rgba(30,41,59,0.8)", border: "none", borderRadius: 8,
    color: "#94A3B8", cursor: "pointer", fontSize: 16, padding: "6px 10px",
  },
  notifList: { display: "flex", flexDirection: "column", gap: 12 },
  notifItem: {
    alignItems: "flex-start", background: "rgba(30,41,59,0.6)", borderRadius: 10,
    display: "flex", gap: 12, padding: "12px 14px",
  },
  notifIcon: { fontSize: 18, flexShrink: 0 },
  notifMsg: { color: "#CBD5E1", fontSize: 13, lineHeight: 1.5, margin: 0 },
  notifTime: { color: "#475569", fontSize: 11, margin: "4px 0 0" },
};