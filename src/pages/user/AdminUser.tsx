import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import type { User } from "../../interfaces/user.interface";

import { useAdminUsers } from "../../hooks/useAdminUsers";
import { userRoles } from "../../data/userRoles";
import { getUserRoleLabel } from "../../utils/userRoleUtils";

import PageHeader from "../../components/common/PageHeader";
import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import DataTable from "../../components/common/DataTable";
import UserRoleChip from "../../components/users/UserRoleChip";
import type { DataTableColumn } from "../../components/common/DataTable";
import ChangeUserRoleDialog from "../../components/users/ChangeUserRoleDialog";

// Página principal para administrar usuarios y roles
const AdminUser = () => {
  const {
    users,
    loading,
    error,
    updatingUserId,
    selectedUser,
    selectedRole,
    openDialog,
    message,
    messageType,
    openMessage,
    loadUsers,
    openChangeRoleDialog,
    closeChangeRoleDialog,
    changeSelectedRole,
    updateRole,
    bulkUploadPending,
    closeMessage,
  } = useAdminUsers();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estado para búsqueda y filtro de rol
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // Resetea la página al cambiar filtros para no quedar en una página vacía
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(0);
  };

  // Filtra usuarios por nombre/correo y rol
  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: DataTableColumn<User>[] = [
    {
      id: "number",
      label: "#",
      render: (_user, index) => (
        <Typography sx={{ color: "#64748b", fontWeight: 700 }}>
          {index + 1}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "Nombre",
      render: (user) => (
        <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
          {user.name}
        </Typography>
      ),
    },
    {
      id: "email",
      label: "Correo",
      render: (user) => user.email,
    },
    {
      id: "role",
      label: "Rol",
      render: (user) => <UserRoleChip role={user.role} />,
    },
    {
      id: "action",
      label: "Acción",
      align: "center",
      render: (user) =>
        updatingUserId === user.id ? (
          <CircularProgress size={22} />
        ) : (
          <Tooltip title="Cambiar rol">
            <IconButton
              onClick={() => openChangeRoleDialog(user)}
              sx={{
                backgroundColor: "#eff6ff",
                color: "primary.main",
                borderRadius: "12px",
                "&:hover": { backgroundColor: "#dbeafe" },
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  if (loading) return <LoadingBox />;

  return (
    <Box sx={{ width: "100%", minHeight: "100%" }}>
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Administra los usuarios registrados y sus roles dentro del sistema."
        actions={
          <>
            <Tooltip title="Carga masiva de usuarios">
              <Button
                variant="contained"
                startIcon={<UploadFileOutlinedIcon />}
                onClick={bulkUploadPending}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                }}
              >
                Carga masiva
              </Button>
            </Tooltip>

            <Tooltip title="Actualizar lista">
              <IconButton
                onClick={loadUsers}
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#f1f5f9",
                  color: "#334155",
                  "&:hover": { backgroundColor: "#e2e8f0" },
                }}
              >
                <RefreshOutlinedIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      />

      {/* Barra de búsqueda y filtro de rol */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Buscar por nombre o correo..."
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: "220px" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => handleRoleFilterChange(e.target.value)}
          sx={{ minWidth: "160px" }}
        >
          <MenuItem value="ALL">Todos los roles</MenuItem>
          {userRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {getUserRoleLabel(role)}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {error}
        </Alert>
      )}

      {filteredUsers.length === 0 ? (
        <EmptyState
          title={
            search || roleFilter !== "ALL"
              ? "Sin resultados"
              : "No hay usuarios registrados"
          }
          description={
            search || roleFilter !== "ALL"
              ? "Intenta con otro nombre, correo o rol."
              : "Cuando existan usuarios en el sistema, aparecerán en esta tabla."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <ChangeUserRoleDialog
        open={openDialog}
        selectedUser={selectedUser}
        selectedRole={selectedRole}
        updatingUserId={updatingUserId}
        onClose={closeChangeRoleDialog}
        onRoleChange={changeSelectedRole}
        onSave={updateRole}
      />

      <CustomSnackbar
        open={openMessage}
        message={message}
        severity={messageType}
        onClose={closeMessage}
      />
    </Box>
  );
};

export default AdminUser;