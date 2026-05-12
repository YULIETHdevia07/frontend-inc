import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import CreatePqr from "../pages/pqrs/CreatePqr";
import MyPqrs from "../pages/pqrs/MyPqrs";
import AdminPqrs from "../pages/pqrs/AdminPqrs";

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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;