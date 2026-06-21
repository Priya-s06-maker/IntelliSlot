// // ── Keys ──────────────────────────────────────────────
// const APPTS_KEY = "is_appointments";

// // ── Helpers ───────────────────────────────────────────
// export function getAllAppointments() {
//   try {
//     return JSON.parse(localStorage.getItem(APPTS_KEY) || "[]");
//   } catch { return []; }
// }

// export function saveAllAppointments(appts) {
//   localStorage.setItem(APPTS_KEY, JSON.stringify(appts));
// }

// export function getUserAppointments(userId) {
//   return getAllAppointments().filter(a => a.userId === userId);
// }

// export function createAppointment(data) {
//   const appts = getAllAppointments();
//   const newAppt = {
//     id:          "appt-" + Date.now(),
//     userId:      data.userId,
//     title:       data.title,
//     description: data.description || "",
//     date:        data.date,        // "YYYY-MM-DD"
//     time:        data.time,        // "HH:MM"
//     duration:    data.duration,    // minutes: 30 | 60 | 90 | 120
//     type:        data.type,        // "meeting" | "review" | "interview" | "personal" | "other"
//     location:    data.location || "",
//     status:      "upcoming",       // "upcoming" | "completed" | "cancelled"
//     createdAt:   new Date().toISOString(),
//   };
//   appts.push(newAppt);
//   saveAllAppointments(appts);
//   return newAppt;
// }

// export function updateAppointment(id, updates) {
//   const appts = getAllAppointments();
//   const idx = appts.findIndex(a => a.id === id);
//   if (idx === -1) return null;
//   appts[idx] = { ...appts[idx], ...updates, updatedAt: new Date().toISOString() };
//   saveAllAppointments(appts);
//   return appts[idx];
// }

// export function cancelAppointment(id) {
//   return updateAppointment(id, { status: "cancelled" });
// }

// export function deleteAppointment(id) {
//   const appts = getAllAppointments().filter(a => a.id !== id);
//   saveAllAppointments(appts);
// }

// // Check if a slot is already booked for this user
// export function isSlotTaken(userId, date, time, excludeId = null) {
//   const appts = getAllAppointments();
//   return appts.some(a =>
//     a.userId   === userId &&
//     a.date     === date &&
//     a.time     === time &&
//     a.status   !== "cancelled" &&
//     a.id       !== excludeId
//   );
// }

// // Auto-mark past appointments as completed
// export function syncAppointmentStatuses() {
//   const appts = getAllAppointments();
//   const now = new Date();
//   let changed = false;
//   appts.forEach(a => {
//     if (a.status === "upcoming") {
//       const apptDate = new Date(`${a.date}T${a.time}`);
//       if (apptDate < now) {
//         a.status = "completed";
//         changed = true;
//       }
//     }
//   });
//   if (changed) saveAllAppointments(appts);
//   return appts;
// }

// // Format helpers
// export function formatDate(dateStr) {
//   const d = new Date(dateStr + "T00:00:00");
//   return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
// }

// export function formatTime(timeStr) {
//   const [h, m] = timeStr.split(":").map(Number);
//   const ampm = h >= 12 ? "PM" : "AM";
//   const hour = h % 12 || 12;
//   return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
// }

// export function getTypeColor(type) {
//   const colors = {
//     meeting:   { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.4)",  text: "#818CF8" },
//     review:    { bg: "rgba(34,211,238,0.12)",  border: "rgba(34,211,238,0.35)", text: "#22D3EE" },
//     interview: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)", text: "#FBB444" },
//     personal:  { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.35)", text: "#10B981" },
//     other:     { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", text: "#94A3B8" },
//   };
//   return colors[type] || colors.other;
// }

// export function getStatusColor(status) {
//   const colors = {
//     upcoming:  { bg: "rgba(99,102,241,0.15)",  text: "#818CF8",  dot: "#6366F1" },
//     completed: { bg: "rgba(16,185,129,0.12)",  text: "#10B981",  dot: "#10B981" },
//     cancelled: { bg: "rgba(239,68,68,0.12)",   text: "#EF4444",  dot: "#EF4444" },
//   };
//   return colors[status] || colors.upcoming;
// }

// ── Keys ──────────────────────────────────────────────
const APPTS_KEY   = "is_appointments";
const NOTIFS_KEY  = "is_notifications";

// ── Rooms & Admin Mapping ─────────────────────────────
export const ROOMS = [
  { id: "wimbledon",  label: "🎾 Wimbledon",      adminId: "admin-1", adminName: "Admin Wimbledon"  },
  { id: "wembley",    label: "🏟️ Wembley",         adminId: "admin-2", adminName: "Admin Wembley"    },
  { id: "madison",    label: "🏀 Madison Square",  adminId: "admin-3", adminName: "Admin Madison"    },
  { id: "carnegie",   label: "🎭 Carnegie Hall",   adminId: "admin-4", adminName: "Admin Carnegie"   },
  { id: "silverstone",label: "🏎️ Silverstone",     adminId: "admin-5", adminName: "Admin Silverstone"},
];

export function getRoomById(roomId) {
  return ROOMS.find(r => r.id === roomId) || null;
}

export function getRoomByAdminId(adminId) {
  return ROOMS.find(r => r.adminId === adminId) || null;
}

// ── Admin Seeding ─────────────────────────────────────
// Call once on app load to ensure admin accounts exist
export function seedAdmins() {
  const users = JSON.parse(localStorage.getItem("is_users") || "[]");
  let changed = false;
  ROOMS.forEach(room => {
    const exists = users.find(u => u.id === room.adminId);
    if (!exists) {
      users.push({
        id:       room.adminId,
        name:     room.adminName,
        email:    `${room.id}@intellislot.com`,
        password: "Admin@123",
        role:     "admin",
        roomId:   room.id,
      });
      changed = true;
    }
  });
  if (changed) localStorage.setItem("is_users", JSON.stringify(users));
}

// ── Appointment Helpers ───────────────────────────────
export function getAllAppointments() {
  try {
    return JSON.parse(localStorage.getItem(APPTS_KEY) || "[]");
  } catch { return []; }
}

export function saveAllAppointments(appts) {
  localStorage.setItem(APPTS_KEY, JSON.stringify(appts));
}

export function getUserAppointments(userId) {
  return getAllAppointments().filter(a => a.userId === userId);
}

// Get all appointments for a specific room (for admin)
export function getRoomAppointments(roomId) {
  return getAllAppointments().filter(a => a.roomId === roomId);
}

export function createAppointment(data) {
  const appts = getAllAppointments();

  const newAppt = {
    id:          "appt-" + Date.now(),
    userId:      data.userId,
    userName:    data.userName || "User",
    title:       data.title,
    description: data.description || "",
    date:        data.date,        // "YYYY-MM-DD"
    time:        data.time,        // "HH:MM"
    duration:    data.duration,    // minutes
    type:        data.type,        // "meeting" | "review" | "interview" | "personal" | "other"
    roomId:      data.roomId,      // "wimbledon" | "wembley" | etc.
    status:      "pending",        // "pending" | "approved" | "rejected" | "cancelled" | "completed"
    createdAt:   new Date().toISOString(),
  };

  appts.push(newAppt);
  saveAllAppointments(appts);
  return newAppt;
}

export function updateAppointment(id, updates) {
  const appts = getAllAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return null;
  appts[idx] = { ...appts[idx], ...updates, updatedAt: new Date().toISOString() };
  saveAllAppointments(appts);
  return appts[idx];
}

export function cancelAppointment(id) {
  return updateAppointment(id, { status: "cancelled" });
}

// ── Admin: Approve ────────────────────────────────────
// When admin approves an appointment:
// 1. Set it to "approved"
// 2. Lock that room+timeslot
// 3. Auto-decline any other PENDING bookings by the same user at the same date+time
export function approveAppointment(apptId) {
  const appts = getAllAppointments();
  const target = appts.find(a => a.id === apptId);
  if (!target) return;

  // Approve this one
  target.status = "approved";
  target.updatedAt = new Date().toISOString();

  // Auto-decline: same user, same date+time, different appointment, still pending
  appts.forEach(a => {
    if (
      a.id       !== apptId &&
      a.userId   === target.userId &&
      a.date     === target.date &&
      a.time     === target.time &&
      a.status   === "pending"
    ) {
      a.status    = "rejected";
      a.rejectReason = "auto-declined: You already have an approved meeting at this time.";
      a.updatedAt = new Date().toISOString();

      // Push a notification to the user
      pushNotification(target.userId, {
        type:    "auto-declined",
        message: `Your booking "${a.title}" at ${formatTime(a.time)} on ${formatDate(a.date)} was auto-declined because "${target.title}" was approved at the same time.`,
        apptId:  a.id,
      });
    }
  });

  // Also decline any OTHER pending appointments for the SAME ROOM at the SAME DATE+TIME
  appts.forEach(a => {
    if (
      a.id      !== apptId &&
      a.roomId  === target.roomId &&
      a.date    === target.date &&
      a.time    === target.time &&
      a.status  === "pending"
    ) {
      a.status      = "rejected";
      a.rejectReason = "auto-declined: This room is already booked at this time.";
      a.updatedAt   = new Date().toISOString();

      pushNotification(a.userId, {
        type:    "room-conflict",
        message: `Your booking "${a.title}" for ${getRoomById(a.roomId)?.label} at ${formatTime(a.time)} on ${formatDate(a.date)} was declined — the room was approved for another user.`,
        apptId:  a.id,
      });
    }
  });

  saveAllAppointments(appts);

  // Notify the approved user
  pushNotification(target.userId, {
    type:    "approved",
    message: `Your booking "${target.title}" at ${formatTime(target.time)} on ${formatDate(target.date)} has been approved! 🎉`,
    apptId:  target.id,
  });
}

// ── Admin: Reject ─────────────────────────────────────
export function rejectAppointment(apptId, reason = "") {
  const appts  = getAllAppointments();
  const target = appts.find(a => a.id === apptId);
  if (!target) return;

  target.status       = "rejected";
  target.rejectReason = reason || "Rejected by admin.";
  target.updatedAt    = new Date().toISOString();

  saveAllAppointments(appts);

  pushNotification(target.userId, {
    type:    "rejected",
    message: `Your booking "${target.title}" on ${formatDate(target.date)} was declined. Reason: ${target.rejectReason}`,
    apptId:  target.id,
  });
}

// ── Conflict Checks ───────────────────────────────────
// Is a room+timeslot already APPROVED? (hard block)
export function isRoomSlotApproved(roomId, date, time, excludeId = null) {
  return getAllAppointments().some(a =>
    a.roomId  === roomId &&
    a.date    === date &&
    a.time    === time &&
    a.status  === "approved" &&
    a.id      !== excludeId
  );
}

// Does this user already have an APPROVED booking at this date+time?
export function userHasApprovedAtSlot(userId, date, time, excludeId = null) {
  return getAllAppointments().some(a =>
    a.userId === userId &&
    a.date   === date &&
    a.time   === time &&
    a.status === "approved" &&
    a.id     !== excludeId
  );
}

// Legacy: kept for backward compatibility in MyAppointments edit flow
export function isSlotTaken(userId, date, time, excludeId = null) {
  return userHasApprovedAtSlot(userId, date, time, excludeId);
}

// ── Past-time Blocking ────────────────────────────────
// Returns true if a given date+time is in the past
export function isInPast(date, time) {
  const now  = new Date();
  const appt = new Date(`${date}T${time}`);
  return appt <= now;
}

// Given a date string "YYYY-MM-DD", return the cutoff time "HH:MM"
// for today (i.e. slots before this time are disabled)
export function getTodayCutoffTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

// ── Notifications ─────────────────────────────────────
export function getNotifications(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIFS_KEY) || "{}");
    return all[userId] || [];
  } catch { return []; }
}

export function pushNotification(userId, notif) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIFS_KEY) || "{}");
    if (!all[userId]) all[userId] = [];
    all[userId].unshift({
      id:        "notif-" + Date.now() + Math.random(),
      ...notif,
      read:      false,
      createdAt: new Date().toISOString(),
    });
    // Keep max 50 notifications per user
    all[userId] = all[userId].slice(0, 50);
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(all));
  } catch {}
}

export function markAllNotificationsRead(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTIFS_KEY) || "{}");
    if (all[userId]) all[userId].forEach(n => { n.read = true; });
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(all));
  } catch {}
}

export function getUnreadCount(userId) {
  return getNotifications(userId).filter(n => !n.read).length;
}

// ── Status Auto-sync ──────────────────────────────────
// Auto-mark approved appointments as completed once time passes
export function syncAppointmentStatuses() {
  const appts = getAllAppointments();
  const now   = new Date();
  let changed = false;

  appts.forEach(a => {
    if (a.status === "approved") {
      const apptEnd = new Date(`${a.date}T${a.time}`);
      apptEnd.setMinutes(apptEnd.getMinutes() + (a.duration || 60));
      if (apptEnd < now) {
        a.status  = "completed";
        changed   = true;
      }
    }
  });

  if (changed) saveAllAppointments(appts);
  return appts;
}

// ── Format Helpers ────────────────────────────────────
export function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

export function formatTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function getTypeColor(type) {
  const colors = {
    meeting:   { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.4)",  text: "#818CF8" },
    review:    { bg: "rgba(34,211,238,0.12)",  border: "rgba(34,211,238,0.35)", text: "#22D3EE" },
    interview: { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.35)", text: "#FBB444" },
    personal:  { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.35)", text: "#10B981" },
    other:     { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.3)", text: "#94A3B8" },
  };
  return colors[type] || colors.other;
}

export function getStatusColor(status) {

const colors = {

pending: {
bg: "rgba(245,158,11,0.12)",
text: "#FBB444",
dot: "#F59E0B"
},

accepted: {
bg: "rgba(16,185,129,0.12)",
text: "#10B981",
dot: "#10B981"
},

rejected: {
bg: "rgba(239,68,68,0.12)",
text: "#EF4444",
dot: "#EF4444"
},

completed: {
bg: "rgba(99,102,241,0.12)",
text: "#818CF8",
dot: "#6366F1"
},

cancelled: {
bg: "rgba(148,163,184,0.12)",
text: "#94A3B8",
dot: "#94A3B8"
}

};

return (
colors[
status
?.toLowerCase()
]
||
colors.pending
);

}