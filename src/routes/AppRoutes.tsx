import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layouts/DashboardLayout";

import CreatePqr from "../pages/PQR/user/CreatePqr";
import MyPqrs from "../pages/PQR/user/MyPqrs";
import AdminPqrs from "../pages/PQR/admin/AdminPqrs";
import AdminUser from "../pages/PQR/admin/AdminUser";
import AgentPqrs from "../pages/PQR/agent/AgentPqrs";

import CreatePersonnelRequisition from "../pages/humanTalen/CreatePersonnelRequisition";
import PersonnelRequisitions from "../pages/humanTalen/PersonnelRequisitions";
import PersonnelRequisitionDetail from "../pages/humanTalen/PersonnelRequisitionDetail";
import PersonnelRequisitionFormat from "../pages/humanTalen/PersonnelRequisitionFormat";
import UserSignaturePage from "../pages/users/UserSignaturePage";

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
          <Route path="/agent/pqrs" element={<AgentPqrs />} />

          {/* Talento Humano */}
          <Route
            path="/dashboard/human-talent/requisitions"
            element={<PersonnelRequisitions />}
          />
          <Route
            path="/dashboard/human-talent/requisitions/:id"
            element={<PersonnelRequisitionDetail />}
          />
          <Route
            path="/dashboard/human-talent/requisitions/:id/format"
            element={<PersonnelRequisitionFormat />}
          />
          <Route
            path="/dashboard/human-talent/requisitions/create"
            element={<CreatePersonnelRequisition />}
          />

          {/* Usuario */}
          <Route path="/users" element={<AdminUser />} />
          <Route
            path="my-signature"
            element={<UserSignaturePage />}
          />

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;