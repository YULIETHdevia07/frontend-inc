import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CreatePqr from "../pages/user/CreatePqr";
import MyPqrs from "../pages/user/MyPqrs";
import AdminPqrs from "../pages/admin/AdminPqrs";
import AdminUser from "../pages/admin/AdminUser";
import AgentPqrs from "../pages/agent/AgentPqrs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Rutas con layout administrativo */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* PQR */}
          <Route path="/dashboard/pqrs/my" element={<MyPqrs />} />
          <Route path="/dashboard/pqrs/create" element={<CreatePqr />} />
          <Route path="/dashboard/pqrs" element={<AdminPqrs />} />
          {/* Usuario */}
          <Route path="/users" element={<AdminUser />} />
          {/* Agent */}
          <Route path="/agent/pqrs" element={<AgentPqrs />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;