import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

return (
<BrowserRouter>
<ToastContainer />
<Routes>

<Route
path="/"
element={<Landing />}
/>

<Route
path="/login"
element={<Login />}
/>
<Route

path=
"/admin/dashboard"

element={
<AdminDashboard/>
}

/>

<Route
path="/signup"
element={<Signup />}
/>
<Route path="/user/dashboard" element={<UserDashboard />} />
<Route
path="/forgot"
element={<ForgotPassword />}
/>
<Route path="/reset-password" element={<ResetPassword />} />
</Routes>

</BrowserRouter>
);

}

export default App;