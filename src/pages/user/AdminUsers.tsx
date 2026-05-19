import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

import {
  getAllUsers,
  updateUserRole,
} from "../../services/userService";

import type {
  User,
  UserRole,
} from "../../interfaces/user.interface";

const AdminUsers = () => {
  const theme = useTheme();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
  const [openDialog, setOpenDialog] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [openMessage, setOpenMessage] = useState(false);

  const roles: UserRole[] = ["USER", "ADMIN", "AGENT"];

  const style = {
    container: {
      width: "100%",
      minHeight: "100%",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "22px",
    },

    headerInfo: {
      display: "flex",
      flexDirection: "column",
    },

    title: {
      fontWeight: 700,
      color: theme.palette.text.primary,
    },

    subtitle: {
      color: theme.palette.text.secondary,
      mt: 0.5,
    },

    actionsHeader: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    },

    bulkButton: {
      borderRadius: "12px",
      textTransform: "none",
      fontWeight: 700,
      boxShadow: "none",
    },

    refreshButton: {
      borderRadius: "12px",
      backgroundColor: "#f1f5f9",
      color: "#334155",
      "&:hover": {
        backgroundColor: "#e2e8f0",
      },
    },

    tableContainer: {
      borderRadius: "16px",
      boxShadow: "none",
      border: "1px solid #e5e7eb",
      overflow: "hidden",
    },

    tableHead: {
      backgroundColor: "#f3f4f6",
    },

    tableHeadText: {
      color: "#374151",
      fontWeight: 800,
      fontSize: "13px",
      textTransform: "uppercase",
      letterSpacing: "0.03em",
    },

    tableCell: {
      color: theme.palette.text.primary,
      fontSize: "14px",
      borderBottom: "1px solid #f1f5f9",
    },

    numberCell: {
      width: "70px",
      color: "#64748b",
      fontWeight: 700,
    },

    userBox: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    userAvatar: {
      width: 36,
      height: 36,
      backgroundColor: "#e8f1ff",
      color: theme.palette.primary.main,
      fontSize: "15px",
      fontWeight: 700,
    },

    userName: {
      fontWeight: 700,
      color: theme.palette.text.primary,
    },

    select: {
      minWidth: "170px",
      backgroundColor: theme.palette.background.paper,
      borderRadius: "12px",
    },

    loadingBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "300px",
    },

    empty: {
      padding: "36px",
      borderRadius: "16px",
      textAlign: "center",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #e5e7eb",
      boxShadow: "none",
    },

    dialogUserBox: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "16px",
      borderRadius: "16px",
      backgroundColor: "#f8fafc",
      border: "1px solid #e5e7eb",
    },
  };

  // Muestra mensajes temporales de éxito o error en pantalla
  const showMessage = (
    text: string,
    type: "success" | "error" = "success"
  ) => {
    setMessage(text);
    setMessageType(type);
    setOpenMessage(true);
  };

  // Carga desde la API todos los usuarios registrados en el sistema
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(data.users);
    } catch (error) {
      console.error(error);
      setError(
        "Error al cargar los usuarios. Verifica que el usuario tenga rol ADMIN."
      );
    } finally {
      setLoading(false);
    }
  };

  // Abre el modal para cambiar el rol del usuario seleccionado
  const openChangeRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setOpenDialog(true);
  };

  // Cierra el modal y limpia el usuario seleccionado
  const closeChangeRoleDialog = () => {
    setSelectedUser(null);
    setSelectedRole("USER");
    setOpenDialog(false);
  };

  // Actualiza el rol seleccionado dentro del modal
  const handleSelectedRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as UserRole);
  };

  // Envía a la API el nuevo rol del usuario seleccionado
  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingUserId(selectedUser.id);
      setError("");

      const data = await updateUserRole(selectedUser.id, selectedRole);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
              ...user,
              role: data.user.role,
            }
            : user
        )
      );

      showMessage("Rol actualizado correctamente", "success");
      closeChangeRoleDialog();
    } catch (error) {
      console.error(error);
      showMessage("Error al actualizar el rol del usuario", "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Muestra un mensaje temporal mientras se desarrolla la carga masiva
  const handleBulkUpload = () => {
    showMessage("Función de carga masiva pendiente por desarrollar", "error");
  };

  // Cambia la página actual de la tabla
  const handleChangePage = (
    _event: unknown,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Cambia la cantidad de usuarios visibles por página
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // Define el color visual del chip según el rol del usuario
  const getRoleColor = (role: UserRole) => {
    if (role === "ADMIN") return "error";
    if (role === "AGENT") return "warning";
    return "primary";
  };

  // Retorna el ícono visual correspondiente a cada rol
  const getRoleIcon = (role: UserRole) => {
    if (role === "ADMIN") return <AdminPanelSettingsOutlinedIcon />;
    if (role === "AGENT") return <SupportAgentOutlinedIcon />;
    return <PersonOutlineOutlinedIcon />;
  };

  // Convierte el nombre técnico del rol en un texto más amigable
  const getRoleLabel = (role: UserRole) => {
    if (role === "ADMIN") return "Administrador";
    if (role === "AGENT") return "Agente";
    return "Usuario";
  };

  // Calcula los usuarios que se deben mostrar según la página actual
  const visibleUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Carga los usuarios automáticamente cuando se abre la vista
  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={style.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={style.container}>
      <Box sx={style.header}>
        <Box sx={style.headerInfo}>
          <Typography variant="h5" sx={style.title}>
            Gestión de usuarios
          </Typography>

          <Typography variant="body2" sx={style.subtitle}>
            Administra los usuarios registrados y sus roles dentro del sistema.
          </Typography>
        </Box>

        <Box sx={style.actionsHeader}>
          <Tooltip title="Carga masiva de usuarios">
            <Button
              variant="contained"
              startIcon={<UploadFileOutlinedIcon />}
              onClick={handleBulkUpload}
              sx={style.bulkButton}
            >
              Carga masiva
            </Button>
          </Tooltip>

          <Tooltip title="Actualizar lista">
            <IconButton onClick={loadUsers} sx={style.refreshButton}>
              <RefreshOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {error}
        </Alert>
      )}

      {users.length === 0 ? (
        <Paper sx={style.empty}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            No hay usuarios registrados
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Cuando existan usuarios en el sistema, aparecerán en esta tabla.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={style.tableContainer}>
          <Table>
            <TableHead sx={style.tableHead}>
              <TableRow>
                <TableCell sx={style.tableHeadText}>#</TableCell>
                <TableCell sx={style.tableHeadText}>Nombre</TableCell>
                <TableCell sx={style.tableHeadText}>Correo</TableCell>
                <TableCell sx={style.tableHeadText}>Rol</TableCell>
                <TableCell sx={style.tableHeadText} align="center">
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <TableCell sx={{ ...style.tableCell, ...style.numberCell }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  <TableCell sx={style.tableCell}>
                    <Box sx={style.userBox}>
                      <Typography sx={style.userName}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={style.tableCell}>
                    {user.email}
                  </TableCell>

                  <TableCell sx={style.tableCell}>
                    <Chip
                      icon={getRoleIcon(user.role)}
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        borderRadius: "10px",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center" sx={style.tableCell}>
                    {updatingUserId === user.id ? (
                      <CircularProgress size={22} />
                    ) : (
                      <Tooltip title="Cambiar rol">
                        <IconButton
                          onClick={() => openChangeRoleDialog(user)}
                          sx={{
                            backgroundColor: "#eff6ff",
                            color: theme.palette.primary.main,
                            borderRadius: "12px",
                            "&:hover": {
                              backgroundColor: "#dbeafe",
                            },
                          }}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 30, 50]}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </TableContainer>
      )}
      {/* </Paper> */}

      <Dialog
        open={openDialog}
        onClose={closeChangeRoleDialog}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "22px",
              padding: "4px",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: theme.palette.text.primary,
            paddingBottom: "8px",
          }}
        >
          Cambiar rol de usuario
        </DialogTitle>

        <DialogContent>
          {selectedUser && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                marginTop: "8px",
              }}
            >
              <Box sx={style.dialogUserBox}>
                <Avatar sx={style.userAvatar}>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography sx={{ fontWeight: 800 }}>
                    {selectedUser.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", marginBottom: "8px" }}
                >
                  Rol actual
                </Typography>

                <Chip
                  icon={getRoleIcon(selectedUser.role)}
                  label={getRoleLabel(selectedUser.role)}
                  color={getRoleColor(selectedUser.role)}
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    borderRadius: "10px",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", marginBottom: "8px" }}
                >
                  Nuevo rol
                </Typography>

                <Select
                  fullWidth
                  size="small"
                  value={selectedRole}
                  onChange={handleSelectedRoleChange}
                  sx={style.select}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px 20px",
          }}
        >
          <Button
            onClick={closeChangeRoleDialog}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              color: "#64748b",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateRole}
            disabled={
              !selectedUser ||
              selectedRole === selectedUser.role ||
              updatingUserId === selectedUser.id
            }
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            {updatingUserId === selectedUser?.id
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openMessage}
        autoHideDuration={3000}
        onClose={() => setOpenMessage(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={messageType}
          onClose={() => setOpenMessage(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsers;