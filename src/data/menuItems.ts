export const menuItems = [
  {
    module: "PQR",
    roles: ["ADMIN", "USER"],
    submodules: [
      {
        name: "Solicitudes",
        roles: ["ADMIN", "USER"],
        options: [
          {
            label: "Mis PQR",
            path: "/dashboard/pqrs/my",
            roles: ["ADMIN", "USER"],
          },
          {
            label: "Crear PQR",
            path: "/dashboard/pqrs/create",
            roles: ["ADMIN", "USER"],
          },
        ],
      },
    ],
  },

  {
    module: "Gestión Administrativa",
    roles: ["ADMIN"],
    submodules: [
      {
        name: "Administrar PQR",
        roles: ["ADMIN"],
        options: [
          {
            label: "Todas las PQR",
            path: "/dashboard/pqrs",
            roles: ["ADMIN"],
          },
        ],
      },
      {
        name: "Usuarios",
        roles: ["ADMIN"],
        options: [
          {
            label: "Listar usuarios",
            path: "/dashboard/users",
            roles: ["ADMIN"],
          },
          {
            label: "Crear usuario",
            path: "/dashboard/users/create",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];