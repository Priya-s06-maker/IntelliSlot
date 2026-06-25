import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminProfile() {

const session =
JSON.parse(
sessionStorage.getItem("is_session")
);

const [name,setName]=
useState(
session?.name || ""
);

function saveProfile(){

const updated = {

...session,

name

};

sessionStorage.setItem(
"is_session",
JSON.stringify(updated)
);

toast.success(
"Profile updated successfully ✨"
);

}

function logout(){

sessionStorage.removeItem(
"is_session"
);

toast.success(
"Logged out successfully 👋"
);

setTimeout(
()=>{
window.location="/login";
},
800
);

}

return(

<div
style={{
padding:"40px",
color:"#E2E8F0"
}}
>

<h1>
Admin Profile
</h1>

<div
style={{
maxWidth:"500px",
marginTop:"30px"
}}
>

<label>
Full Name
</label>

<input
value={name}
onChange={
e=>
setName(
e.target.value
)
}
style={{
width:"100%",
padding:"14px",
marginTop:"10px",
marginBottom:"20px",
background:"#1E2937",
color:"white",
border:"1px solid #334155",
borderRadius:"10px"
}}
/>

<label>
Email
</label>

<input
disabled
value={session?.email}
style={{
width:"100%",
padding:"14px",
marginTop:"10px",
marginBottom:"20px",
background:"#0F172A",
color:"#94A3B8",
border:"1px solid #334155",
borderRadius:"10px"
}}
/>

<button
onClick={saveProfile}
style={{
padding:"12px 22px",
background:"#3B82F6",
color:"white",
border:"none",
borderRadius:"10px",
marginRight:"12px"
}}
>
Save Changes
</button>

<button
onClick={logout}
style={{
padding:"12px 22px",
background:"#EF4444",
color:"white",
border:"none",
borderRadius:"10px"
}}
>
Logout
</button>

</div>

</div>

);

}