// import { useState } from "react";
// import { toast } from "react-toastify";
// import { createAppointment, isSlotTaken } from "../../utils/appointments";

// const TYPES = [
//   { value: "meeting",   label: "Meeting",   icon: "🤝" },
//   { value: "review",    label: "Review",    icon: "📋" },
//   { value: "interview", label: "Interview", icon: "💼" },
//   { value: "personal",  label: "Personal",  icon: "👤" },
//   { value: "other",     label: "Other",     icon: "📌" },
// ];

// const DURATIONS = [
//   { value: 15,  label: "15 min" },
//   { value: 30,  label: "30 min" },
//   { value: 45,  label: "45 min" },
//   { value: 60,  label: "1 hour" },
//   { value: 90,  label: "1.5 hrs" },
//   { value: 120, label: "2 hours" },
// ];

// // Generate time slots 6 AM to 10 PM in 15-min increments
// function generateTimeSlots() {
//   const slots = [];
//   for (let h = 6; h <= 22; h++) {
//     for (let m = 0; m < 60; m += 15) {
//       if (h === 22 && m > 0) break;
//       const hh = h.toString().padStart(2, "0");
//       const mm = m.toString().padStart(2, "0");
//       const ampm = h >= 12 ? "PM" : "AM";
//       const hour = h % 12 || 12;
//       slots.push({ value: `${hh}:${mm}`, label: `${hour}:${mm} ${ampm}` });
//     }
//   }
//   return slots;
// }

// const TIME_SLOTS = generateTimeSlots();

// const EMPTY = {
//   title: "", description: "", date: "", time: "",
//   duration: 30, type: "meeting", location: "",
// };

// export default function BookAppointment({ user, setActive }) {
//   const [form, setForm]      = useState(EMPTY);
//   const [errors, setErrors]  = useState({});
//   const [loading, setLoading] = useState(false);
//   const [slotTaken, setSlotTaken] = useState(false);

//   // Min date = today
//   const today = new Date().toISOString().split("T")[0];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//     if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
//     // Live slot check when date or time changes
//     if ((name === "date" || name === "time")) {
//       const date = name === "date" ? value : form.date;
//       const time = name === "time" ? value : form.time;
//       if (date && time) {
//         const taken = isSlotTaken(user.id, date, time);
//         setSlotTaken(taken);
//       }
//     }
//   };

//   const validate = () => {
//     const errs = {};
//     if (!form.title.trim())       errs.title    = "Title is required.";
//     if (!form.date)                errs.date     = "Please select a date.";
//     if (!form.time)                errs.time     = "Please select a time.";
//     if (form.date && form.date < today) errs.date = "Date cannot be in the past.";
//     return errs;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }

//     if (isSlotTaken(user.id, form.date, form.time)) {
//       toast.error("⚠️ This time slot is already booked! Please choose a different time.");
//       setSlotTaken(true);
//       return;
//     }

//     setLoading(true);
//     await new Promise(r => setTimeout(r, 600));

//     createAppointment({ ...form, userId: user.id });
//     setLoading(false);
//     toast.success(`✅ "${form.title}" booked successfully!`);
//     setForm(EMPTY);
//     setSlotTaken(false);
//     setTimeout(() => setActive("appointments"), 800);
//   };

//   const handleReset = () => {
//     setForm(EMPTY);
//     setErrors({});
//     setSlotTaken(false);
//   };

//   return (
//     <div style={{ maxWidth: 700 }}>
//       <div style={{
//         background: "#0F172A", border: "1px solid var(--border)",
//         borderRadius: 20, overflow: "hidden",
//       }}>
//         {/* Header */}
//         <div style={{
//           background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,238,0.06))",
//           padding: "24px 28px", borderBottom: "1px solid var(--border)",
//         }}>
//           <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--text-primary)", margin: "0 0 6px" }}>
//             ➕ Book New Appointment
//           </h2>
//           <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>
//             Fill in the details below. We'll check availability automatically.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} style={{ padding: "28px" }} noValidate>

//           {/* Title */}
//           <div style={{ marginBottom: 22 }}>
//             <label style={labelStyle}>Appointment Title <span style={{ color: "var(--accent)" }}>*</span></label>
//             <input
//               name="title" value={form.title} onChange={handleChange}
//               placeholder="e.g. Team standup, Doctor visit, Code review..."
//               style={{ ...inputStyle, borderColor: errors.title ? "#EF4444" : undefined }}
//             />
//             {errors.title && <span style={errStyle}>{errors.title}</span>}
//           </div>

//           {/* Type selector */}
//           <div style={{ marginBottom: 22 }}>
//             <label style={labelStyle}>Type</label>
//             <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//               {TYPES.map(t => (
//                 <button
//                   key={t.value} type="button"
//                   onClick={() => setForm(f => ({ ...f, type: t.value }))}
//                   style={{
//                     display: "flex", alignItems: "center", gap: 6,
//                     padding: "8px 16px", borderRadius: 8,
//                     border: form.type === t.value
//                       ? "1px solid var(--accent)" : "1px solid var(--border)",
//                     background: form.type === t.value
//                       ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
//                     color: form.type === t.value ? "var(--accent-light)" : "var(--text-secondary)",
//                     cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   <span>{t.icon}</span> {t.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Date + Time row */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
//             <div>
//               <label style={labelStyle}>Date <span style={{ color: "var(--accent)" }}>*</span></label>
//               <input
//                 type="date" name="date" value={form.date}
//                 min={today} onChange={handleChange}
//                 style={{ ...inputStyle, borderColor: errors.date ? "#EF4444" : undefined, colorScheme: "dark" }}
//               />
//               {errors.date && <span style={errStyle}>{errors.date}</span>}
//             </div>
//             <div>
//               <label style={labelStyle}>Time <span style={{ color: "var(--accent)" }}>*</span></label>
//               <select
//                 name="time" value={form.time} onChange={handleChange}
//                 style={{ ...inputStyle, borderColor: errors.time ? "#EF4444" : slotTaken ? "#F59E0B" : undefined }}
//               >
//                 <option value="">Select time...</option>
//                 {TIME_SLOTS.map(s => (
//                   <option key={s.value} value={s.value}>{s.label}</option>
//                 ))}
//               </select>
//               {errors.time && <span style={errStyle}>{errors.time}</span>}
//             </div>
//           </div>

//           {/* Slot conflict warning */}
//           {slotTaken && (
//             <div style={{
//               background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
//               borderRadius: 10, padding: "12px 16px", marginBottom: 20,
//               display: "flex", gap: 10, alignItems: "center",
//             }}>
//               <span style={{ fontSize: 18 }}>⚠️</span>
//               <div>
//                 <div style={{ color: "#FBB444", fontWeight: 600, fontSize: 13 }}>Time Slot Already Booked</div>
//                 <div style={{ color: "var(--text-muted)", fontSize: 12 }}>You already have an appointment at this time. Please choose a different slot.</div>
//               </div>
//             </div>
//           )}

//           {/* Duration */}
//           <div style={{ marginBottom: 22 }}>
//             <label style={labelStyle}>Duration</label>
//             <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//               {DURATIONS.map(d => (
//                 <button
//                   key={d.value} type="button"
//                   onClick={() => setForm(f => ({ ...f, duration: d.value }))}
//                   style={{
//                     padding: "8px 16px", borderRadius: 8,
//                     border: form.duration === d.value
//                       ? "1px solid var(--accent)" : "1px solid var(--border)",
//                     background: form.duration === d.value
//                       ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
//                     color: form.duration === d.value ? "var(--accent-light)" : "var(--text-secondary)",
//                     cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)",
//                     transition: "all 0.2s",
//                   }}
//                 >
//                   {d.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Location */}
//           <div style={{ marginBottom: 22 }}>
//             <label style={labelStyle}>Location <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
//             <input
//               name="location" value={form.location} onChange={handleChange}
//               placeholder="e.g. Conference Room A, Zoom, Google Meet..."
//               style={inputStyle}
//             />
//           </div>

//           {/* Description */}
//           <div style={{ marginBottom: 28 }}>
//             <label style={labelStyle}>Description <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
//             <textarea
//               name="description" value={form.description} onChange={handleChange}
//               placeholder="Add any notes or agenda items..."
//               rows={3}
//               style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
//             />
//           </div>

//           {/* Actions */}
//           <div style={{ display: "flex", gap: 12 }}>
//             <button
//               type="submit"
//               disabled={loading || slotTaken}
//               style={{
//                 flex: 1, background: loading || slotTaken
//                   ? "rgba(99,102,241,0.4)"
//                   : "linear-gradient(135deg, var(--accent), #818CF8)",
//                 border: "none", color: "#fff", padding: "13px",
//                 borderRadius: 10, cursor: loading || slotTaken ? "not-allowed" : "pointer",
//                 fontSize: 15, fontWeight: 600, fontFamily: "var(--font-body)",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//                 transition: "opacity 0.2s",
//               }}
//             >
//               {loading ? <><span className="spinner" /> Booking…</> : "✅ Confirm Booking"}
//             </button>
//             <button
//               type="button" onClick={handleReset}
//               style={{
//                 padding: "13px 20px", borderRadius: 10,
//                 border: "1px solid var(--border)", background: "transparent",
//                 color: "var(--text-secondary)", cursor: "pointer",
//                 fontSize: 14, fontFamily: "var(--font-body)",
//                 transition: "all 0.2s",
//               }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
//             >
//               Reset
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// const labelStyle = {
//   display: "block", fontSize: 12, fontWeight: 600,
//   textTransform: "uppercase", letterSpacing: "0.5px",
//   color: "var(--text-secondary)", marginBottom: 8,
// };

// const inputStyle = {
//   width: "100%", boxSizing: "border-box",
//   background: "var(--bg-input)", border: "1px solid var(--border)",
//   borderRadius: 8, padding: "11px 14px",
//   color: "var(--text-primary)", fontSize: 14,
//   fontFamily: "var(--font-body)", outline: "none",
//   transition: "border-color 0.2s, box-shadow 0.2s",
// };

// const errStyle = {
//   color: "#EF4444", fontSize: 12, marginTop: 5, display: "block",
// };

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  createAppointment,
  ROOMS,
  isRoomSlotApproved,
  isInPast,
  getTodayCutoffTime,
} from "../../utils/appointments";

const TYPES = [
  { id: "meeting",   label: "📅 Meeting"   },
  { id: "review",    label: "🔍 Review"    },
  { id: "interview", label: "🎤 Interview" },
  { id: "personal",  label: "👤 Personal"  },
  { id: "other",     label: "✨ Other"     },
];

const DURATIONS = [
  { value: 15,  label: "15 min" },
  { value: 30,  label: "30 min" },
  { value: 45,  label: "45 min" },
  { value: 60,  label: "1 hr"   },
  { value: 90,  label: "1.5 hr" },
  { value: 120, label: "2 hr"   },
];

function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function formatTimeLabel(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const today = new Date().toISOString().split("T")[0];

export default function BookAppointment() {
  const session = JSON.parse(sessionStorage.getItem("is_session") || "null");

  const [form, setForm] = useState({
    title: "",
    type: "meeting",
    date: "",
    time: "",
    duration: 60,
    roomId: "",
    description: "",
  });

  const [warning, setWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // live conflict check
  useEffect(() => {
    if (!form.date || !form.time || !form.roomId) { setWarning(""); return; }
    if (isInPast(form.date, form.time)) { setWarning(""); return; }
    if (isRoomSlotApproved(form.roomId, form.date, form.time)) {
      setWarning("⚠️ This room already has an approved booking at the selected time. Choose a different slot or room.");
    } else {
      setWarning("");
    }
  }, [form.date, form.time, form.roomId]);

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function isTimeDisabled(slot) {
    if (!form.date) return false;
    if (form.date === today) {
      return slot <= getTodayCutoffTime();
    }
    return false;
  }

  function validate() {
    if (!form.title.trim()) return "Please enter a title.";
    if (!form.date) return "Please select a date.";
    if (!form.time) return "Please select a time.";
    if (!form.roomId) return "Please select a room.";
    if (isInPast(form.date, form.time)) return "Cannot book a time that has already passed.";
    return null;
  }

  // function handleSubmit() {
  //   const err = validate();
  //   if (err) { toast.error(err); return; }

  //   if (isRoomSlotApproved(form.roomId, form.date, form.time)) {
  //     toast.error("This room is already booked at that time. Please choose another slot.");
  //     return;
  //   }

  //   setSubmitting(true);
  //   const appt = createAppointment({
  //     userId:      session.id,
  //     userName:    session.name,
  //     ...form,
  //   });

  //   setTimeout(() => {
  //     setSubmitting(false);
  //     toast.success("Appointment requested! Waiting for admin approval. 🎉");
  //     setForm({ title: "", type: "meeting", date: "", time: "", duration: 60, roomId: "", description: "" });
  //   }, 600);
  // }
  function convertTime(time) {

const [value, period] =
time.split(" ");

let [hour, minute] =
value.split(":");

hour =
parseInt(hour);

if (
period === "PM"
&&
hour !== 12
)
hour += 12;

if (
period === "AM"
&&
hour === 12
)
hour = 0;

return `${String(hour).padStart(2,"0")}:${minute}:00`;

}
async function handleSubmit() {

const err =
validate();

if (err) {

toast.error(err);

return;

}

if (
isRoomSlotApproved(
form.roomId,
form.date,
form.time
)
) {

toast.error(
"This room is already booked."
);

return;

}

try {

setSubmitting(true);

console.log(
"SELECTED ROOM:",
form.roomId
);
const response =
await fetch(
"http://127.0.0.1:8001/appointments",
{
method: "POST",

headers: {
"Content-Type":
"application/json"
},

body:
JSON.stringify({

user_id:
session.id,

room_id:
(
{
wimbledon: 1,
silverstone: 2,
wembley: 1,
madison: 1,
carnegie: 1
}
[
form.roomId
]
),

appointment_title:
form.title,

appointment_type:
form.type,

appointment_date:
form.date,

appointment_time:
convertTime(form.time),

duration_minutes:
Number(form.duration),

description:
form.description

})
}
);
console.log(
"PAYLOAD",
{
user_id: session.id,
room_id:
({
wimbledon:1,
silverstone:2,
wembley:1,
madison:1,
carnegie:1
}[form.roomId])
}
)
const data =
await response.json();
console.log(data);
setSubmitting(false);

// if (!response.ok) {

// toast.error(
// "Booking failed"
// );

// return;

// }

// toast.success(
// "Appointment submitted for admin approval 🎉"
// );
if(data.ai && data.ai.conflict){

    toast.error(
        "❌ " + data.ai.reason
    );

    if (data.ai.suggested_slot) {

        toast.info(
            "💡 Suggested Slot: " +
            data.ai.suggested_slot
        );

    }

    return;

}

if (data.success) {

    toast.success(
        "Appointment submitted for admin approval 🎉"
    );

}
else {

    toast.error(
        "Booking failed."
    );

    return;

}
setForm({
title: "",
type: "meeting",
date: "",
time: "",
duration: 60,
roomId: "",
description: ""
});

}
catch {

setSubmitting(false);

toast.error(
"Backend not reachable"
);

}

}
  const S = styles;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.heading}>Book an Appointment</h2>
        <p style={S.sub}>Fill in the details below. Your request will be reviewed by the room admin.</p>
      </div>

      <div style={S.card}>

        {/* Title */}
        <div style={S.field}>
          <label style={S.label}>Appointment Title *</label>
          <input
            style={S.input}
            placeholder="e.g. Product Review with Team"
            value={form.title}
            onChange={e => set("title", e.target.value)}
          />
        </div>

        {/* Type */}
        <div style={S.field}>
          <label style={S.label}>Type</label>
          <div style={S.chips}>
            {TYPES.map(t => (
              <button
                key={t.id}
                style={{ ...S.chip, ...(form.type === t.id ? S.chipActive : {}) }}
                onClick={() => set("type", t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div style={S.row}>
          <div style={{ ...S.field, flex: 1 }}>
            <label style={S.label}>Date *</label>
            <input
              type="date"
              style={S.input}
              min={today}
              value={form.date}
              onChange={e => { set("date", e.target.value); set("time", ""); }}
            />
          </div>
          <div style={{ ...S.field, flex: 1 }}>
            <label style={S.label}>Time *</label>
            <select
              style={S.input}
              value={form.time}
              onChange={e => set("time", e.target.value)}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot} disabled={isTimeDisabled(slot)}>
                  {formatTimeLabel(slot)}{isTimeDisabled(slot) ? " (past)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration */}
        <div style={S.field}>
          <label style={S.label}>Duration</label>
          <div style={S.chips}>
            {DURATIONS.map(d => (
              <button
                key={d.value}
                style={{ ...S.chip, ...(form.duration === d.value ? S.chipActive : {}) }}
                onClick={() => set("duration", d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room */}
        <div style={S.field}>
          <label style={S.label}>Room / Location *</label>
          <div style={S.roomGrid}>
            {ROOMS.map((room, index) => (

<button
type="button"

key={room.id || index}

style={{
...S.roomCard,

...(form.roomId === room.id
? S.roomCardActive
: {})
}}

onClick={() => {
set(
"roomId",
room.id
);
}}

>

<div style={S.roomLabel}>
{room.label}
</div>

<div style={S.roomAdmin}>
{room.adminName}
</div>

</button>

))}
<p style={{color:"white"}}>
Selected:
{String(form.roomId)}
</p>
          </div>
        </div>

        {/* Conflict warning */}
        {warning && (
          <div style={S.warningBox}>
            {warning}
          </div>
        )}

        {/* Description */}
        <div style={S.field}>
          <label style={S.label}>Description (optional)</label>
          <textarea
            style={S.textarea}
            placeholder="Add agenda, notes, or any details..."
            value={form.description}
            onChange={e => set("description", e.target.value)}
            rows={3}
          />
        </div>

        <button
          style={{ ...S.submitBtn, ...(submitting ? S.submitBtnDisabled : {}) }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "🗓️ Request Appointment"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "0 0 40px" },
  header: { marginBottom: 28 },
  heading: { fontSize: 26, fontWeight: 700, color: "#F1F5F9", margin: "0 0 6px" },
  sub: { color: "#94A3B8", fontSize: 14, margin: 0 },

  card: {
    background: "rgba(15,23,42,0.7)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 16,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  field: { display: "flex", flexDirection: "column", gap: 8 },
  row: { display: "flex", gap: 16 },

  label: { fontSize: 13, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.05em", textTransform: "uppercase" },

  input: {
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 10,
    color: "#F1F5F9",
    fontSize: 15,
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    colorScheme: "dark",
  },

  textarea: {
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 10,
    color: "#F1F5F9",
    fontSize: 15,
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },

  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 8,
    color: "#94A3B8",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    padding: "7px 14px",
    transition: "all 0.15s",
  },
  chipActive: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid #6366F1",
    color: "#A5B4FC",
  },

  roomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: 10 },
  roomCard: {
    background: "rgba(30,41,59,0.8)",
    border: "1px solid rgba(5, 5, 7, 0.2)",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "12px 14px",
    textAlign: "left",
    transition: "all 0.15s",
  },
  roomCardActive: {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid #6366F1",
  },
  roomLabel: { color: "#F1F5F9", fontSize: 14, fontWeight: 600 },
  roomAdmin: { color: "#64748B", fontSize: 12 },

  warningBox: {
    background: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.35)",
    borderRadius: 10,
    color: "#FBB444",
    fontSize: 13,
    padding: "12px 16px",
  },

  submitBtn: {
    background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    padding: "14px",
    width: "100%",
    letterSpacing: "0.02em",
    marginTop: 4,
    transition: "opacity 0.2s",
  },
  submitBtnDisabled: { opacity: 0.6, cursor: "not-allowed" },
};