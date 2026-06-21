import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
  syncAppointmentStatuses,
  isRoomSlotApproved,
  isInPast,
  getTodayCutoffTime,
  ROOMS,
  formatDate,
  formatTime,
  getStatusColor,
  getTypeColor,
} from "../../utils/appointments";

const FILTERS = [
"All",
"Pending",
"Accepted",
"Completed",
"Rejected",
"Cancelled"
];

const TYPES = ["meeting","review","interview","personal","other"];
const DURATIONS = [15,30,45,60,90,120];

function generateTimeSlots() {
  const slots = [];
  for (let h = 6; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`);
    }
  }
  return slots;
}
const TIME_SLOTS = generateTimeSlots();

function formatTimeLabel(t) {
  const [h,m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h%12||12}:${m.toString().padStart(2,"0")} ${ampm}`;
}

const today = new Date().toISOString().split("T")[0];

export default function MyAppointments() {
  const session = JSON.parse(sessionStorage.getItem("is_session") || "null");
  const [appts, setAppts]         = useState([]);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [editAppt, setEditAppt]   = useState(null);
  const [cancelId, setCancelId]   = useState(null);
  const [editForm, setEditForm]   = useState({});

async function load() {

try {

const response =
await fetch(
`http://127.0.0.1:8001/user/${session.id}/appointments`
);

const data =
await response.json();

console.log(
"MY APPOINTMENTS",
data
);

setAppts(
Array.isArray(data)
?
data
:
[]
);

}

catch {

setAppts([]);

toast.error(
"Unable to load appointments"
);

}

}

  useEffect(() => { load(); }, []);

  const filtered = appts.filter(a => {
    const matchFilter = filter === "All" || a.status.toLowerCase() === filter.toLowerCase();
   // const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
   const matchSearch =
!search
||
a.appointment_title
.toLowerCase()
.includes(
search.toLowerCase()
);
    return matchFilter && matchSearch;
  }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  function openEdit(appt) {setEditAppt(appt);

setEditForm({

title:
appt.appointment_title || "",

type:
appt.appointment_type || "",

date:
appt.appointment_date || "",

time:
appt.appointment_time
?.slice(0,5)
|| "",

duration:
appt.duration_minutes || 30,

roomId:
ROOMS.find(
r =>
Number(
r.adminId.split("-")[1]
)
===
Number(appt.room_id)
)?.id
||
"",

description:
appt.description || ""

});

}
async function saveEdit() {

try {
const payload = {

appointment_title:
editForm.title,

appointment_type:
editForm.type,

appointment_date:
editForm.date,

appointment_time:
editForm.time,

duration_minutes:
editForm.duration,

room_id:
ROOMS.find(
r =>
String(r.id) === String(editForm.roomId)
)?.adminId
?.split("-")[1]
?
Number(
ROOMS.find(
r =>
String(r.id) === String(editForm.roomId)
)
.adminId.split("-")[1]
)
:
editAppt.room_id,

description:
editForm.description,

status:
"pending"

};

console.log(
"SENDING EDIT",
payload
);
console.log(
"SENDING EDIT",
JSON.stringify({

appointment_title:
editForm.title,

appointment_type:
editForm.type,

appointment_date:
editForm.date,

appointment_time:
editForm.time,

duration_minutes:
Number(editForm.duration),

room_id:
Number(editForm.roomId),

description:
editForm.description,

status:
"pending"

})
);
console.log("EDIT FORM", editForm);
console.log("EDIT APPT", editAppt);
const response =
await fetch(
`http://127.0.0.1:8001/appointments/edit/${editAppt.appointment_id}`,

{

method: "PUT",

headers: {
"Content-Type":
"application/json"
},

// body:
// JSON.stringify({

// appointment_title:
// editForm.title,

// appointment_type:
// editForm.type,

// appointment_date:
// editForm.date,

// appointment_time:
// editForm.time,

// duration_minutes:
// editForm.duration,

// room_id:
// Number(editForm.roomId),

// description:
// editForm.description ||"",

// status:
// "pending"

// })
body:
JSON.stringify(payload)
}

);

if (!response.ok) {

toast.error(
"Update failed"
);

return;

}

toast.success(
"Appointment updated! Back to pending for admin review."
);

setEditAppt(null);

await load();

}

catch {

toast.error(
"Update failed"
);

}

}

  async function confirmCancel() {

try {

const response =
await fetch(
`http://127.0.0.1:8001/appointments/${cancelId}/status`,
{
method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
status:
"cancelled"
})
}
);

const data =
await response.json();

if(
data.success
){

toast.success(
"Appointment cancelled"
);

setCancelId(
null
);

load();

}
else{

toast.error(
"Cancel failed"
);

}

}
catch{

toast.error(
"Unable to cancel appointment"
);

}

}

  const S = styles;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h2 style={S.heading}>My Appointments</h2>
        <p style={S.sub}>Track, manage, and edit all your bookings.</p>
      </div>

      {/* Search + Filters */}
      <div style={S.toolbar}>
        <input
          style={S.search}
          placeholder="🔍  Search appointments…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={S.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={{ ...S.filterBtn, ...(filter === f ? S.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>📭</p>
          <p style={{ color: "#64748B", fontSize: 15 }}>No appointments found.</p>
        </div>
      ) : (
        <div style={S.list}>
          {filtered.map(a => {
            const sc = getStatusColor(a.status);
            const tc = getTypeColor(a.appointment_type);
            const room = ROOMS.find(r => String(r.id) === String(a.room_id));
            const canEdit =a.status.toLowerCase() === "pending";
            const canCancel =["pending","accepted"].includes(a.status.toLowerCase());
            return (
              <div key={a.appointment_id} style={S.card}>
                <div style={S.cardTop}>
                  <div style={S.cardLeft}>
                    <span style={{ ...S.typeBadge, background: tc.bg, color: tc.text, borderColor: tc.border }}>
                      {a.type}
                    </span>
                    <h3 style={S.title}>{a.appointment_title}</h3>
                    <div style={S.meta}>
                      <span>📅 {formatDate(a.appointment_date)}</span>
                      <span>⏰ {formatTime(a.appointment_time)}</span>
                      <span>⏱ {a.duration_minutes} min</span>
                      {room && <span>{room.label}</span>}
                    </div>
                    {a.description && <p style={S.desc}>{a.description}</p>}
                    {a.rejectReason && (
                      <p style={S.rejectNote}>ℹ️ {a.rejectReason}</p>
                    )}
                  </div>
                  <div style={S.cardRight}>
                    <span style={{ ...S.statusBadge, background: sc.bg, color: sc.text }}>
                      <span style={{ ...S.dot, background: sc.dot }} />
                      {a.status}
                    </span>
                  </div>
                </div>
                {(canEdit || canCancel) && (
                  <div style={S.actions}>
                    {canEdit && (
                      <button
style={S.editBtn}

onClick={() => {

// toast.info(
// "You can edit pending appointments in the next version."
// );
openEdit(a)
}}

>

✏️ Edit

</button>
                    )}
                    {canCancel && (
                      <button style={S.cancelBtn} onClick={() => setCancelId(a.appointment_id)}>✕ Cancel</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editAppt && (
        <div style={S.overlay} onClick={() => setEditAppt(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <h3 style={S.modalTitle}>Edit Appointment</h3>
            <div style={S.field}>
              <label style={S.label}>Title *</label>
              <input style={S.input} value={editForm.title} onChange={e => setEditForm(p=>({...p,title:e.target.value}))} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Type</label>
              <div style={S.chips}>
                {TYPES.map(t => (
                  <button key={t}
                    style={{ ...S.chip, ...(editForm.type===t ? S.chipActive : {}) }}
                    onClick={() => setEditForm(p=>({...p,type:t}))}
                  >{t}</button>
                ))}
              </div>
            </div>
            <div style={S.row}>
              <div style={{...S.field,flex:1}}>
                <label style={S.label}>Date *</label>
                <input type="date" style={S.input} min={today} value={editForm.date}
                  onChange={e => setEditForm(p=>({...p,date:e.target.value,time:""}))} />
              </div>
              <div style={{...S.field,flex:1}}>
                <label style={S.label}>Time *</label>
                <select style={S.input} value={editForm.time}
                  onChange={e => setEditForm(p=>({...p,time:e.target.value}))}>
                  <option value="">Select time</option>
                  {TIME_SLOTS.map(slot => {
                    const past = editForm.date===today && slot<=getTodayCutoffTime();
                    return <option key={slot} value={slot} disabled={past}>{formatTimeLabel(slot)}{past?" (past)":""}</option>;
                  })}
                </select>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Duration</label>
              <div style={S.chips}>
                {DURATIONS.map(d => (
                  <button key={d}
                    style={{ ...S.chip, ...(editForm.duration===d ? S.chipActive : {}) }}
                    onClick={() => setEditForm(p=>({...p,duration:d}))}
                  >{d} min</button>
                ))}
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Room *</label>
              <select style={S.input} value={editForm.roomId}
                onChange={e => setEditForm(p=>({...p,roomId:e.target.value}))}>
                <option value="">Select room</option>
                {ROOMS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Description</label>
              <textarea style={S.textarea} rows={2} value={editForm.description}
                onChange={e => setEditForm(p=>({...p,description:e.target.value}))} />
            </div>
            <div style={S.modalActions}>
              <button style={S.cancelBtn} onClick={() => setEditAppt(null)}>Discard</button>
              <button style={S.saveBtn} onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm */}
      {cancelId && (
        <div style={S.overlay} onClick={() => setCancelId(null)}>
          <div style={S.confirmBox} onClick={e => e.stopPropagation()}>
            <p style={{ color:"#F1F5F9", fontSize:16, fontWeight:600, marginBottom:8 }}>Cancel Appointment?</p>
            <p style={{ color:"#94A3B8", fontSize:14, marginBottom:20 }}>This action cannot be undone.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button style={S.cancelBtn} onClick={() => setCancelId(null)}>Keep it</button>
              <button style={{ ...S.saveBtn, background:"linear-gradient(135deg,#EF4444,#B91C1C)" }} onClick={confirmCancel}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "0 0 40px" },
  header: { marginBottom: 24 },
  heading: { fontSize: 26, fontWeight: 700, color: "#F1F5F9", margin: "0 0 6px" },
  sub: { color: "#94A3B8", fontSize: 14, margin: 0 },

  toolbar: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  search: {
    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 10, color: "#F1F5F9", fontSize: 14, padding: "10px 14px",
    outline: "none", width: "100%", boxSizing: "border-box",
  },
  filterRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  filterBtn: {
    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 8, color: "#64748B", cursor: "pointer", fontSize: 13,
    fontWeight: 500, padding: "6px 14px",
  },
  filterActive: { background: "rgba(99,102,241,0.2)", border: "1px solid #6366F1", color: "#A5B4FC" },

  empty: { textAlign: "center", padding: "80px 20px" },

  list: { display: "flex", flexDirection: "column", gap: 14 },
  card: {
    background: "rgba(15,23,42,0.7)", border: "1px solid rgba(99,102,241,0.18)",
    borderRadius: 14, padding: "20px 22px",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  cardLeft: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
  cardRight: { flexShrink: 0 },

  typeBadge: {
    alignSelf: "flex-start", border: "1px solid", borderRadius: 6,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
    padding: "2px 8px", textTransform: "uppercase",
  },
  title: { color: "#F1F5F9", fontSize: 16, fontWeight: 700, margin: 0 },
  meta: { color: "#64748B", display: "flex", flexWrap: "wrap", fontSize: 13, gap: 14 },
  desc: { color: "#94A3B8", fontSize: 13, margin: 0 },
  rejectNote: { color: "#FBB444", fontSize: 12, margin: 0 },

  statusBadge: {
    alignItems: "center", borderRadius: 8, display: "flex", fontSize: 12,
    fontWeight: 700, gap: 6, padding: "5px 12px", textTransform: "capitalize",
  },
  dot: { borderRadius: "50%", flexShrink: 0, height: 7, width: 7 },

  actions: { borderTop: "1px solid rgba(99,102,241,0.12)", display: "flex", gap: 10, marginTop: 14, paddingTop: 14 },
  editBtn: {
    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 8, color: "#818CF8", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "7px 16px",
  },
  cancelBtn: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8, color: "#EF4444", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "7px 16px",
  },

  overlay: {
    alignItems: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
    bottom: 0, display: "flex", justifyContent: "center", left: 0, position: "fixed",
    right: 0, top: 0, zIndex: 999,
  },
  modal: {
    background: "#0F172A", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 18,
    display: "flex", flexDirection: "column", gap: 18, maxHeight: "90vh", maxWidth: 540,
    overflowY: "auto", padding: 28, width: "90%",
  },
  confirmBox: {
    background: "#0F172A", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16,
    maxWidth: 380, padding: "28px 24px", width: "90%",
  },
  modalTitle: { color: "#F1F5F9", fontSize: 20, fontWeight: 700, margin: 0 },
  modalActions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 },

  field: { display: "flex", flexDirection: "column", gap: 7 },
  row: { display: "flex", gap: 12 },
  label: { color: "#64748B", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" },
  input: {
    background: "rgba(30,41,59,0.9)", border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 9, color: "#F1F5F9", colorScheme: "dark", fontSize: 14,
    outline: "none", padding: "10px 13px", width: "100%", boxSizing: "border-box",
  },
  textarea: {
    background: "rgba(30,41,59,0.9)", border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 9, color: "#F1F5F9", fontFamily: "inherit", fontSize: 14,
    outline: "none", padding: "10px 13px", resize: "vertical", width: "100%", boxSizing: "border-box",
  },
  chips: { display: "flex", flexWrap: "wrap", gap: 7 },
  chip: {
    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 7, color: "#94A3B8", cursor: "pointer", fontSize: 12,
    fontWeight: 500, padding: "6px 12px",
  },
  chipActive: { background: "rgba(99,102,241,0.2)", border: "1px solid #6366F1", color: "#A5B4FC" },
  saveBtn: {
    background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none",
    borderRadius: 9, color: "#fff", cursor: "pointer", fontSize: 14,
    fontWeight: 700, padding: "10px 22px",
  },
};