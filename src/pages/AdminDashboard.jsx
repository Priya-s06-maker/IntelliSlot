import { useEffect, useState } from "react";

export default function AdminDashboard() {

const session =
JSON.parse(
sessionStorage.getItem(
"is_session"
)
);

const [appointments,setAppointments]=
useState([]);

async function loadAppointments(){

const response=
await fetch(
`http://127.0.0.1:8001/admin/${session.id}/appointments`
);

const data=
await response.json();

setAppointments(data);

}

useEffect(()=>{

loadAppointments();

},[]);


async function updateStatus(
id,
status
){

await fetch(

`http://127.0.0.1:8001/appointments/${id}`,

{

method:
"PUT",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({
status
})

}

);

loadAppointments();

}


return (

<div
style={{
padding:"30px",
color:"white"
}}
>

<h1>
Admin Dashboard
</h1>

<h3>
Pending Appointments
</h3>

{
appointments.map(
(a)=>(

<div

key={
a.appointment_id
}

style={{

background:
"#172036",

padding:
"20px",

marginBottom:
"20px",

borderRadius:
"16px"

}}

>

<h3>

{a.user_name}

</h3>

<p>

Room:
{a.room_name}

</p>

<p>

Title:
{a.appointment_title}

</p>

<p>

Date:
{a.appointment_date}

</p>

<p>

Time:
{a.appointment_time}

</p>

<p>

Status:
{a.status}

</p>

{

a.status
===

"pending"

&&

<>

<button

onClick={()=>

updateStatus(
a.appointment_id,
"accepted"
)

}

>

Accept

</button>


<button

onClick={()=>

updateStatus(
a.appointment_id,
"rejected"
)

}

style={{
marginLeft:
"10px"
}}

>

Reject

</button>

</>

}

</div>

)

)

}

</div>

);

}