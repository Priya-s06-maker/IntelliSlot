import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [session,setSession]=
useState(

JSON.parse(
sessionStorage.getItem("is_session") || "{}"

)

);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [active, setActive] = useState("dashboard");
  const [profile,setProfile]=
useState({

name:
session.name,

email:
session.email

});
const [password,setPassword]=
useState({

current:"",
new:"",
confirm:""

});
const [showPassword, setShowPassword] = useState({
  current: false,
  new: false,
  confirm: false
});
  const now = new Date();

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => 
      a.status === "pending" && 
      new Date(`${a.appointment_date}T${a.appointment_time}`) > now
    ).length,
    accepted: appointments.filter(a => 
      a.status === "accepted" && 
      new Date(`${a.appointment_date}T${a.appointment_time}`) > now
    ).length,
    cancelled: appointments.filter(a => 
      ["cancelled", "rejected"].includes(a.status)
    ).length,
    missed: appointments.filter(a => 
      a.status === "accepted" && 
      new Date(`${a.appointment_date}T${a.appointment_time}`) < now
    ).length
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
async function saveProfile(){

try{

const response =
await fetch(

"http://127.0.0.1:8001/profile/update",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify({

email:
profile.email,

name:
profile.name

})

}

);

const data =
await response.json();

if(data.success){

const updatedSession={

...session,

name:
profile.name

};

setSession(
updatedSession
);

sessionStorage.setItem(

"is_session",

JSON.stringify(
updatedSession
)

);

toast.success(
"Profile updated successfully"
);

}
else{

toast.error(
"Update failed"
);

}

}
catch{

toast.error(
"Something went wrong"
);

}

}
async function changePassword(){

if(
password.new
!== 
password.confirm
){

toast.error(
"Passwords do not match"
);

return;

}

if(
password.new.length
<
6
){

toast.error(
"Password must be at least 6 characters"
);

return;

}

try{

const response=
await fetch(

"http://127.0.0.1:8001/admin/change-password",

{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify({

email:
session.email,

current:
password.current,

new:
password.new

})

}

);

const data=
await response.json();

if(data.success){

toast.success(
"Password updated successfully"
);

setPassword({

current:"",
new:"",
confirm:""

});

}
else{

toast.error(
data.message
||
"Invalid password"
);

}

}
catch{

toast.error(
"Unable to update password"
);

}

}
  function handleLogout() {
    sessionStorage.removeItem("is_session");
    toast.success("Logged out successfully. See you soon! 👋");
    setTimeout(() => {
      navigate("/login");
    }, 800);
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
        <h2 style={{ color: "#60A5FA", marginBottom: "40px", fontSize: "28px" }}>
          IntelliSlot
        </h2>

        <div>
          <button
            onClick={() => setActive("dashboard")}
            style={{
              ...navBtn,
              background: active === "dashboard" ? "#3B82F6" : "#1E2937",
              color: "white"
            }}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setActive("profile")}
            style={{
              ...navBtn,
              background: active === "profile" ? "#3B82F6" : "#1E2937",
              color: "white"
            }}
          >
            👤 Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              ...navBtn,
              background: "#7F1D1D",
              color: "#FCA5A5",
              marginTop: "30px"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px" }}>
        {active === "dashboard" ? (
          <>
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
                  <div style={{ fontSize: "42px", marginBottom: "12px", opacity: 0.9 }}>
                    {stat.icon}
                  </div>
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
          </>
        ) : (

<div
style={{
maxWidth:"900px"
}}
>

<h1
style={{
fontSize:"32px",
marginBottom:"30px"
}}
>
Profile
</h1>


<div
style={{

background:
"#1E2937",

borderRadius:
"18px",

padding:
"30px",

display:
"flex",

gap:
"30px",

alignItems:
"center",

marginBottom:
"30px"

}}
>

<div
style={{

width:"100px",

height:"100px",

borderRadius:"50%",

background:
"#3B82F6",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"38px",

fontWeight:"700"

}}
>

{
session?.name
?.substring(0,2)
?.toUpperCase()
}

</div>


<div>

<h2>

{
session.name
}

</h2>

<p
style={{
color:"#94A3B8"
}}
>

{
session.email
}

</p>

<p
style={{
color:"#60A5FA"
}}
>

Admin

</p>

</div>

</div>



<div
style={{
background:"#1E2937",
padding:"30px",
borderRadius:"18px"
}}
>

<h3
style={{
marginBottom:"30px"
}}
>
Personal Information
</h3>


<label>

Full Name

</label>

<input

value={
profile.name
}

onChange={
(e)=>

setProfile({

...profile,

name:e.target.value

})

}

style={{

width:"100%",

padding:"14px",

marginTop:"10px",

marginBottom:"25px",

background:"#0F172A",

color:"white",

border:
"1px solid #334155",

borderRadius:"10px"

}}
/>


<label>

Email Address

</label>

<input

disabled

value={
profile.email
}

style={{

width:"100%",

padding:"14px",

marginTop:"10px",

background:"#0F172A",

color:"#94A3B8",

border:
"1px solid #334155",

borderRadius:"10px"

}}
/>



<div
style={{
marginTop:"40px",
display: "flex",
gap: "12px"
}}
>

<button

onClick={
saveProfile
}

style={{

padding:"14px 22px",

background:"#6366F1",

color:"white",

border:"none",

borderRadius:"10px",

cursor: "pointer"

}}

>

Save Changes

</button>

</div>
<hr
style={{
margin:"40px 0",
border:"1px solid #334155"
}}
/>

<h3
style={{
marginBottom:"30px"
}}
>
Change Password
</h3>

<label>
Current Password
</label>

<div style={{ position: "relative", marginBottom: "20px" }}>

<input

type={
showPassword.current
?
"text"
:
"password"
}

value={password.current}

onChange={(e)=>

setPassword({

...password,

current:e.target.value

})

}

style={{

width:"100%",

padding:"14px",

paddingRight:"45px",

background:"#0F172A",

color:"white",

border:"1px solid #334155",

borderRadius:"10px"

}}

/>

<span

onClick={()=>

setShowPassword({

...showPassword,

current:!showPassword.current

})

}

style={{

position:"absolute",

right:"15px",

top:"50%",

transform:"translateY(-50%)",

cursor:"pointer",

fontSize:"18px"

}}

>

{showPassword.current ? "🙈" : "👁"}

</span>

</div>


<label>
New Password
</label>

<div style={{ position: "relative", marginBottom: "25px" }}>

<input

type={
showPassword.new
?
"text"
:
"password"
}

value={password.new}

onChange={(e)=>

setPassword({

...password,

new:e.target.value

})

}

style={{

width:"100%",

padding:"14px",

paddingRight:"45px",

marginTop:"10px",

background:"#0F172A",

color:"white",

border:"1px solid #334155",

borderRadius:"10px"

}}

/>

<span

onClick={()=>

setShowPassword({

...showPassword,

new:!showPassword.new

})

}

style={{

position:"absolute",

right:"15px",

top:"50%",

transform:"translateY(-50%)",

cursor:"pointer",

fontSize:"18px"

}}

>

{showPassword.new ? "🙈" : "👁"}

</span>

</div>


<label>
Confirm Password
</label>

<div style={{ position: "relative", marginBottom: "25px" }}>

<input

type={
showPassword.confirm
?
"text"
:
"password"
}

value={password.confirm}

onChange={(e)=>

setPassword({

...password,

confirm:e.target.value

})

}

style={{

width:"100%",

padding:"14px",

paddingRight:"45px",

marginTop:"10px",

background:"#0F172A",

color:"white",

border:"1px solid #334155",

borderRadius:"10px"

}}

/>

<span

onClick={()=>

setShowPassword({

...showPassword,

confirm:!showPassword.confirm

})

}

style={{

position:"absolute",

right:"15px",

top:"50%",

transform:"translateY(-50%)",

cursor:"pointer",

fontSize:"18px"

}}

>

{showPassword.confirm ? "🙈" : "👁"}

</span>

</div>

<button

onClick={
changePassword
}

style={{

padding:"14px 22px",

background:"#8B5CF6",

color:"white",

border:"none",

borderRadius:"10px",

cursor:"pointer"

}}

>

🔐 Update Password

</button>
</div>

</div>


)}
      </div>
    </div>
  );
}