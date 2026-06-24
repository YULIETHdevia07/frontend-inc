import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import type { DataTableColumn } from "../../components/common/DataTable";
import type { User, UserRole } from "../../interfaces/users/user.interface";

import { useAdminUsers } from "../../hooks/users/useAdminUsers";
import { userRoles } from "../../data/userRoles";
import { getUserRoleLabel } from "../../utils/users/userRoleUtils";

import LoadingBox from "../../components/common/LoadingBox";
import EmptyState from "../../components/common/EmptyState";
import CustomSnackbar from "../../components/common/CustomSnackbar";
import DataTable from "../../components/common/DataTable";
import UserRoleChip from "../../components/users/UserRoleChip";
import ChangeUserRoleDialog from "../../components/users/ChangeUserRoleDialog";
import { getFilterStyles } from "../../styles/filterStyles";
import BulkUploadDialog from "../../components/common/BulkUploadDialog";
import { downloadBulkUsersTemplate } from "../../template/users/downloadBulkUsersTemplate";

// Página principal para administrar usuarios y roles
const AdminUsers = () => {

  const theme = useTheme();
  const filterStyles = getFilterStyles(theme);

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

    openBulkUploadDialog,
    bulkUploadFile,
    bulkUploadLoading,
    bulkUploadResult,

    loadUsers,
    openChangeRoleDialog,
    closeChangeRoleDialog,
    changeSelectedRole,
    updateRole,

    openBulkUpload,
    closeBulkUpload,
    changeBulkUploadFile,
    uploadBulkUsers,
    clearBulkUploadResult,
    bulkUploadCompleted,

    closeMessage,
  } = useAdminUsers();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");

  const [showSearch, setShowSearch] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const openFilterMenu = Boolean(filterAnchorEl);

  // Cambia la página actual de la tabla
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Cambia la cantidad de registros visibles por página
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // Actualiza el texto de búsqueda por nombre o correo
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Actualiza el filtro por rol
  const handleRoleFilterChange = (event: { target: { value: string } }) => {
    setRoleFilter(event.target.value as "ALL" | UserRole);
    setPage(0);
  };

  // Muestra u oculta el campo de búsqueda
  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  // Limpia el campo de búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setShowSearch(false);
    setPage(0);
  };

  // Abre el menú de filtros
  const openFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Cierra el menú de filtros
  const closeFilters = () => {
    setFilterAnchorEl(null);
  };

  // Limpia el filtro por rol
  const clearRoleFilter = () => {
    setRoleFilter("ALL");
    setPage(0);
  };

  // Filtra usuarios por nombre, correo y rol
  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Define las columnas de la tabla de usuarios
  const columns: DataTableColumn<User>[] = [
    {
      id: "number",
      label: "#",
      render: (_user, index) => (
        <Typography
          sx={{
            color: "#64748b",
            fontWeight: 700,
          }}
        >
          {index + 1}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "Nombre",
      render: (user) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
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
                "&:hover": {
                  backgroundColor: "#dbeafe",
                },
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ];

  if (loading) {
    return <LoadingBox />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {error}
        </Alert>
      )}

      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios registrados"
          description="Cuando existan usuarios en el sistema, aparecerán en esta tabla."
        />
      ) : (
        <DataTable
          title="Usuarios registrados"
          subtitle="Administra los usuarios registrados y sus roles dentro del sistema."
          actions={
            <>
              {showSearch ? (
                <TextField
                  placeholder="Buscar nombre o correo"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  autoFocus
                  sx={filterStyles.searchInput}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={clearSearch}>
                            <CloseOutlinedIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ) : (
                <Tooltip title="Buscar usuario">
                  <IconButton
                    onClick={toggleSearch}
                    sx={
                      searchTerm
                        ? filterStyles.activeIconButton
                        : filterStyles.iconButton
                    }
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Filtrar por rol">
                <IconButton
                  onClick={openFilters}
                  sx={
                    roleFilter !== "ALL"
                      ? filterStyles.activeIconButton
                      : filterStyles.iconButton
                  }
                >
                  <FilterListOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={filterAnchorEl}
                open={openFilterMenu}
                onClose={closeFilters}
                slotProps={{
                  paper: {
                    sx: filterStyles.smallFilterMenuPaper,
                  },
                }}
              >
                <Box sx={filterStyles.smallFilterMenuContent}>
                  <Typography
                    variant="body2"
                    sx={filterStyles.smallFilterTitle}
                  >
                    Filtrar por rol
                  </Typography>

                  <Select
                    fullWidth
                    value={roleFilter}
                    onChange={handleRoleFilterChange}
                    size="small"
                    sx={filterStyles.filterSelect}
                  >
                    <MenuItem value="ALL">Todos los roles</MenuItem>

                    {userRoles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {getUserRoleLabel(role)}
                      </MenuItem>
                    ))}
                  </Select>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={clearRoleFilter}
                    disabled={roleFilter === "ALL"}
                    sx={filterStyles.clearFilterButtonWithMargin}
                  >
                    Limpiar filtro
                  </Button>
                </Box>
              </Menu>

              <Tooltip title="Carga masiva de usuarios">
                <IconButton
                  onClick={() => openBulkUpload()}
                  disabled={bulkUploadLoading}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#f1f5f9",
                    color: "#334155",
                    "&:hover": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                >
                  <UploadFileOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Actualizar lista">
                <IconButton
                  onClick={() => loadUsers()}
                  sx={{
                    borderRadius: "12px",
                    backgroundColor: "#f1f5f9",
                    color: "#334155",
                    "&:hover": {
                      backgroundColor: "#e2e8f0",
                    },
                  }}
                >
                  <RefreshOutlinedIcon />
                </IconButton>
              </Tooltip>
            </>
          }
          columns={columns}
          rows={filteredUsers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {users.length > 0 && filteredUsers.length === 0 && (
        <Box sx={{ marginTop: "16px" }}>
          <EmptyState
            title="No se encontraron usuarios"
            description="Intenta buscar con otro nombre, correo o rol."
          />
        </Box>
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

      <BulkUploadDialog
        open={openBulkUploadDialog}
        title="Carga masiva de usuarios"
        description="Sube un archivo Excel con los usuarios que deseas registrar en el sistema."
        requiredColumns={["nombre", "email", "contraseña", "rol"]}
        file={bulkUploadFile}
        loading={bulkUploadLoading}
        completed={bulkUploadCompleted}
        result={bulkUploadResult}
        onClose={closeBulkUpload}
        onFileChange={changeBulkUploadFile}
        onUpload={uploadBulkUsers}
        onClearResult={clearBulkUploadResult}
        onDownloadTemplate={downloadBulkUsersTemplate}
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

export default AdminUsers;