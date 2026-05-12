export const menuItems = [
    {
        module: "Seguridad",
        submodules: [
            {
                name: "Usuarios",
                options: [
                    {
                        label: "Listar usuarios",
                        path: "/dashboard/users",
                    },
                    {
                        label: "Crear usuario",
                        path: "/dashboard/users/create",
                    },
                ],
            },
        ],
    },
    {
        module: "Administración",
        submodules: [
            {
                name: "Perfil",
                options: [
                    {
                        label: "Ver perfil",
                        path: "/profile",
                    },
                    {
                        label: "Editar perfil",
                        path: "/profile/edit",
                    },
                ],
            },
        ],
    },
];