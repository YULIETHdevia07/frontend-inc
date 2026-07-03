export const menuItems = [
  {
    module: "PQR",
    roles: ["USER"],
    submodules: [
      {
        name: "Mis solicitudes PQR",
        roles: ["USER"],
        options: [
          {
            label: "Ver mis PQR",
            path: "/dashboard/pqrs/my",
            roles: ["USER"],
          },
          {
            label: "Crear nueva PQR",
            path: "/dashboard/pqrs/create",
            roles: ["USER"],
          },
        ],
      },
    ],
  },

  {
    module: "PQR",
    roles: ["AGENT"],
    submodules: [
      {
        name: "Atención de solicitudes PQR",
        roles: ["AGENT"],
        options: [
          {
            label: "PQR asignadas",
            path: "/agent/pqrs",
            roles: ["AGENT"],
          },
        ],
      },
    ],
  },

  {
    module: "PQR",
    roles: ["ADMIN"],
    submodules: [
      {
        name: "Administración de PQR",
        roles: ["ADMIN"],
        options: [
          {
            label: "Todas las PQR",
            path: "/dashboard/pqrs",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },

  {
    module: "Talento Humano",
    roles: [
      "ADMIN",
      "JEFE_AREA",
      "JEFE_DEPARTAMENTO",
      "GERENTE_GENERAL",
      "ANALISTA_TALENTO_HUMANO",
      "JEFE_TALENTO_HUMANO",
    ],
    submodules: [
      {
        name: "Requisiciones de personal",
        roles: [
          "ADMIN",
          "JEFE_AREA",
          "JEFE_DEPARTAMENTO",
          "GERENTE_GENERAL",
          "ANALISTA_TALENTO_HUMANO",
          "JEFE_TALENTO_HUMANO",
        ],
        options: [
          {
            label: "Ver requisiciones",
            path: "/dashboard/human-talent/requisitions",
            roles: [
              "ADMIN",
              "JEFE_AREA",
              "JEFE_DEPARTAMENTO",
              "GERENTE_GENERAL",
              "ANALISTA_TALENTO_HUMANO",
              "JEFE_TALENTO_HUMANO",
            ],
          },
          {
            label: "Crear requisición",
            path: "/dashboard/human-talent/requisitions/create",
            roles: ["JEFE_AREA"],
          },
        ],
      },
    ],
  },

  {
    module: "Usuarios",
    roles: ["ADMIN"],
    submodules: [
      {
        name: "Gestión de usuarios",
        roles: ["ADMIN"],
        options: [
          {
            label: "Administrar usuarios",
            path: "/users",
            roles: ["ADMIN"],
          },
        ],
      },
    ],
  },
];