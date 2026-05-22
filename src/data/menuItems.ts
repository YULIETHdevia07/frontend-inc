export const menuItems = [
  {
    module: "PQR",
    roles: ["USER"],
    submodules: [
      {
        name: "Solicitudes",
        roles: ["USER"],
        options: [
          {
            label: "Mis PQR",
            path: "/dashboard/pqrs/my",
            roles: ["USER"],
          },
          {
            label: "Crear PQR",
            path: "/dashboard/pqrs/create",
            roles: ["USER"],
          },
        ],
      },
    ],
  },

  {
    module: "AGENT",
    roles: ["AGENT"],
    submodules: [
      {
        name: "Gestión de PQR",
        roles: ["AGENT"],
        options: [
          {
            label: "Lista de PQR",
            path: "/agent/pqrs",
            roles: ["AGENT"],
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
            label: "Gestionar usuarios",
            path: "/users",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];