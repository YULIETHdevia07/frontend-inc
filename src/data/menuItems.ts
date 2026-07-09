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
    roles: ["ADMIN", "USER"],
    positionCodes: [
      "SUBGERENTE_GENERAL", // Subgerente General
      "DPC-TH-0002", // Director de Operaciones
      "DPC-TH-0008", // Jefe de Producción
      "DPC-TH-0005", // Jefe de Aseguramiento de Calidad
      "DPC-TH-0006", // Jefe de Control de Calidad
      "DPC-TH-0009", // Jefe de Planeación y Distribución
      "DPC-TH-0004", // Jefe de Investigación & Desarrollo
      "DPC-TH-0007", // Jefe de Mantenimiento
      "DPC-TH-0132", // Coordinador Planeación y Control Producción
      "DPC-TH-0028", // Coordinador SGI SST-GA
      "DPC-TH-0073", // Gerente Ejecutivo
      "DPC-TH-0012", // Jefe Nuevos Negocios
      "GERENTE_FINANCIERO", // Gerente Financiero
      "JEFE_CONTABILIDAD", // Jefe Contabilidad
      "DPC-TH-0033", // Jefe Suministros
      "DPC-TH-0003", // Jefe Talento Humano
      "DPC-TH-0169", // Jefe Tecnología e Inteligencia de Negocio
      "DPC-TH-0060", // Jefe Nacional Ventas Farma y Consumo
      "DPC-TH-0059", // Jefe Producto
      "DPC-TH-0080", // Auxiliar Talento Humano
    ],
    submodules: [
      {
        name: "Requisiciones de personal",
        roles: ["ADMIN", "USER"],
        positionCodes: [
          "SUBGERENTE_GENERAL",
          "DPC-TH-0002",
          "DPC-TH-0008",
          "DPC-TH-0005",
          "DPC-TH-0006",
          "DPC-TH-0009",
          "DPC-TH-0004",
          "DPC-TH-0007",
          "DPC-TH-0132",
          "DPC-TH-0028",
          "DPC-TH-0073",
          "DPC-TH-0012",
          "GERENTE_FINANCIERO",
          "JEFE_CONTABILIDAD",
          "DPC-TH-0033",
          "DPC-TH-0003",
          "DPC-TH-0169",
          "DPC-TH-0060",
          "DPC-TH-0059",
          "DPC-TH-0080",
        ],
        options: [
          {
            label: "Ver requisiciones",
            path: "/dashboard/human-talent/requisitions",
            roles: ["ADMIN", "USER"],
            positionCodes: [
              "SUBGERENTE_GENERAL",
              "DPC-TH-0002",
              "DPC-TH-0008",
              "DPC-TH-0005",
              "DPC-TH-0006",
              "DPC-TH-0009",
              "DPC-TH-0004",
              "DPC-TH-0007",
              "DPC-TH-0132",
              "DPC-TH-0028",
              "DPC-TH-0073",
              "DPC-TH-0012",
              "GERENTE_FINANCIERO",
              "JEFE_CONTABILIDAD",
              "DPC-TH-0033",
              "DPC-TH-0003",
              "DPC-TH-0169",
              "DPC-TH-0060",
              "DPC-TH-0059",
              "DPC-TH-0080",
            ],
          },
          {
            label: "Crear requisición",
            path: "/dashboard/human-talent/requisitions/create",
            roles: ["ADMIN", "USER"],
            positionCodes: [
              "DPC-TH-0002",
              "DPC-TH-0008",
              "DPC-TH-0005",
              "DPC-TH-0006",
              "DPC-TH-0009",
              "DPC-TH-0004",
              "DPC-TH-0007",
              "DPC-TH-0132",
              "DPC-TH-0028",
              "DPC-TH-0073",
              "DPC-TH-0012",
              "GERENTE_FINANCIERO",
              "JEFE_CONTABILIDAD",
              "DPC-TH-0033",
              "DPC-TH-0003",
              "DPC-TH-0169",
              "DPC-TH-0060",
              "DPC-TH-0059",
            ],
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