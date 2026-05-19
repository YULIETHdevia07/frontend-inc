# Documentación de la estructura del proyecto frontend

## 1. Descripción general

Este proyecto frontend está desarrollado con **React**, **TypeScript**, **Vite**, **Material UI**, **React Router DOM** y **Axios**.  
La estructura del proyecto está organizada de forma modular para separar responsabilidades, mejorar el mantenimiento del código y permitir la reutilización de componentes en diferentes vistas del sistema.

La idea principal de esta organización es que cada carpeta tenga una función clara dentro del proyecto. De esta manera, las páginas, componentes, servicios, hooks, estilos, rutas y utilidades se mantienen separados y son más fáciles de modificar o ampliar.

---

## 2. Estructura principal del proyecto

```txt
src/
│
├── api/
├── components/
├── context/
├── data/
├── hooks/
├── interfaces/
├── layouts/
├── pages/
├── routes/
├── services/
├── styles/
├── theme/
├── utils/
├── validations/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

## 3. Descripción de cada carpeta

### `api/`

Esta carpeta contiene la configuración base para la comunicación con el backend.

Aquí se ubican archivos como la instancia de Axios, donde se define la URL base de la API y los interceptores para enviar automáticamente el token de autenticación cuando el usuario ha iniciado sesión.

Ejemplo de uso:

```txt
api/
└── axios.ts
```

Responsabilidad principal:

```txt
Configurar la conexión HTTP con el backend.
```

---

### `components/`

Esta carpeta contiene los componentes visuales reutilizables del proyecto.

Los componentes no deben crearse pensando únicamente en una vista específica, sino con la intención de que puedan reutilizarse en diferentes módulos cuando sea posible.

Se recomienda dividir esta carpeta en componentes comunes y componentes específicos por módulo.

```txt
components/
│
├── common/
│   ├── DataTable.tsx
│   ├── PageHeader.tsx
│   ├── EmptyState.tsx
│   ├── LoadingBox.tsx
│   └── CustomSnackbar.tsx
│
└── users/
    ├── ChangeUserRoleDialog.tsx
    └── UserRoleChip.tsx
```

#### `components/common/`

Aquí van los componentes globales que pueden usarse en diferentes vistas del sistema.

Ejemplos:

```txt
DataTable.tsx
PageHeader.tsx
EmptyState.tsx
LoadingBox.tsx
CustomSnackbar.tsx
```

Estos componentes pueden utilizarse en módulos como:

```txt
Usuarios
PQR
Roles
Reportes
Solicitudes
```

#### `components/users/`

Aquí van los componentes específicos del módulo de usuarios.

Ejemplos:

```txt
ChangeUserRoleDialog.tsx
UserRoleChip.tsx
```

Estos componentes dependen directamente de la lógica o información de usuarios.

Regla importante:

```txt
Si el componente sirve para varias vistas, debe ir en components/common.
Si el componente solo sirve para un módulo específico, debe ir en components/nombreModulo.
```

---

### `context/`

Esta carpeta contiene los contextos globales de React.

Se utiliza para manejar información que debe estar disponible en varias partes de la aplicación, como la autenticación del usuario.

Ejemplo:

```txt
context/
└── AuthContext.tsx
```

Responsabilidad principal:

```txt
Manejar estados globales como usuario autenticado, token, login y logout.
```

---

### `data/`

Esta carpeta contiene datos estáticos o listas reutilizables dentro del frontend.

Ejemplos:

```txt
data/
├── menuItems.ts
└── userRoles.ts
```

Aquí pueden ir listas como:

```txt
Roles disponibles
Opciones de menú
Estados de una PQR
Tipos de solicitudes
```

Responsabilidad principal:

```txt
Centralizar datos fijos para evitar escribirlos repetidamente en los componentes.
```

---

### `hooks/`

Esta carpeta contiene hooks personalizados.

Los hooks permiten separar la lógica de una página o componente, dejando el componente más limpio y fácil de entender.

Ejemplos:

```txt
hooks/
├── useAdminUsers.ts
└── useAuth.ts
```

En el caso de `useAdminUsers.ts`, se puede manejar:

```txt
Cargar usuarios
Actualizar roles
Abrir y cerrar modal
Manejar mensajes
Controlar errores
```

Responsabilidad principal:

```txt
Separar la lógica del componente visual.
```

---

### `interfaces/`

Esta carpeta contiene las interfaces y tipos de TypeScript que definen la estructura de los datos utilizados en el proyecto.

Aquí se declaran los tipos que representan entidades como usuarios, roles, PQR, respuestas del backend o datos que se envían desde formularios.

Ejemplos:

```txt
interfaces/
├── user.interface.ts
├── pqr.interface.ts
└── auth.interface.ts
```

Ejemplo de uso:

```ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "USER" | "ADMIN" | "AGENT";
```

Responsabilidad principal:

```txt
Centralizar los tipos e interfaces para evitar repetir estructuras en diferentes archivos.
```

Esta carpeta ayuda a que el código sea más seguro, claro y fácil de mantener, ya que permite reutilizar los mismos tipos en páginas, componentes, hooks y servicios.

---

### `layouts/`

Esta carpeta contiene estructuras generales de pantalla.

Los layouts definen cómo se organiza visualmente una sección principal de la aplicación, por ejemplo, una vista con header, sidebar y contenido.

Ejemplo:

```txt
layouts/
└── DashboardLayout.tsx
```

Responsabilidad principal:

```txt
Organizar la estructura visual general de las páginas protegidas o principales.
```

---

### `pages/`

Esta carpeta contiene las páginas principales del sistema.

Cada archivo dentro de `pages/` representa una pantalla completa de la aplicación.

Ejemplo:

```txt
pages/
│
├── Login.tsx
├── Register.tsx
├── Dashboard.tsx
│
└── admin/
    ├── AdminUsers.tsx
    └── AdminPqrs.tsx
```

Responsabilidad principal:

```txt
Armar la vista principal usando componentes, hooks y servicios.
```

Una página no debería tener demasiada lógica interna. La lógica debe separarse en hooks y los elementos visuales reutilizables en componentes.

---

### `routes/`

Esta carpeta contiene la configuración de rutas del proyecto.

Aquí se definen las rutas públicas, privadas y las páginas que se muestran según la URL.

Ejemplo:

```txt
routes/
├── AppRoutes.tsx
└── PrivateRoute.tsx
```

Responsabilidad principal:

```txt
Centralizar la navegación del sistema.
```

---

### `services/`

Esta carpeta contiene las funciones que se comunican con el backend.

Cada servicio representa un grupo de funciones relacionadas con un módulo.

Ejemplos:

```txt
services/
├── authService.ts
├── userService.ts
└── pqrService.ts
```

Ejemplo de funciones en `userService.ts`:

```txt
getAllUsers()
updateUserRole()
```

Responsabilidad principal:

```txt
Separar las peticiones HTTP de los componentes.
```

Los componentes no deberían llamar directamente a Axios. Lo ideal es que usen funciones de los servicios.

---

### `styles/`

Esta carpeta puede contener estilos globales o archivos relacionados con personalización visual general.

Ejemplo:

```txt
styles/
└── global.css
```

Responsabilidad principal:

```txt
Guardar estilos globales del proyecto.
```

---

### `theme/`

Esta carpeta contiene la configuración del tema visual de Material UI.

Ejemplo:

```txt
theme/
└── theme.ts
```

Aquí se definen colores, tipografías, fondos y estilos base del sistema.

Responsabilidad principal:

```txt
Centralizar la identidad visual del proyecto.
```

---

### `utils/`

Esta carpeta contiene funciones auxiliares reutilizables.

Ejemplos:

```txt
utils/
├── userRoleUtils.tsx
├── pqrUtils.ts
└── formatDate.ts
```

Aquí pueden ir funciones como:

```txt
Formatear fechas
Convertir roles en etiquetas visibles
Asignar colores a estados
Transformar datos antes de mostrarlos
```

Responsabilidad principal:

```txt
Guardar funciones reutilizables que no dependen directamente de una pantalla.
```

---

### `validations/`

Esta carpeta contiene esquemas de validación, normalmente usando Yup.

Ejemplos:

```txt
validations/
├── loginValidation.ts
├── registerValidation.ts
└── pqrValidation.ts
```

Responsabilidad principal:

```txt
Centralizar reglas de validación de formularios.
```

---

## 4. Archivos principales

### `App.tsx`

Es el componente principal de la aplicación.

Normalmente aquí se cargan las rutas principales del sistema.

Responsabilidad principal:

```txt
Servir como componente base de la aplicación.
```

---

### `main.tsx`

Es el punto de entrada del proyecto React.

Aquí se renderiza la aplicación y se configuran elementos globales como:

```txt
BrowserRouter
ThemeProvider
AuthProvider
CssBaseline
```

Responsabilidad principal:

```txt
Inicializar la aplicación.
```

---

## 5. Organización recomendada para el módulo de usuarios

Para la vista de administración de usuarios, la estructura recomendada es:

```txt
src/
│
├── components/
│   ├── common/
│   │   ├── DataTable.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingBox.tsx
│   │   └── CustomSnackbar.tsx
│   │
│   └── users/
│       ├── ChangeUserRoleDialog.tsx
│       └── UserRoleChip.tsx
│
├── data/
│   └── userRoles.ts
│
├── hooks/
│   └── useAdminUsers.ts
│
├── interfaces/
│   └── user.interface.ts
│
├── pages/
│   └── admin/
│       └── AdminUsers.tsx
│
├── services/
│   └── userService.ts
│
└── utils/
    └── userRoleUtils.tsx
```

---

## 6. Función de cada archivo en `AdminUsers`

### `pages/admin/AdminUsers.tsx`

Contiene la página principal de administración de usuarios.

Responsabilidad:

```txt
Mostrar la vista, conectar el hook, renderizar la tabla, el modal y los mensajes.
```

---

### `hooks/useAdminUsers.ts`

Contiene la lógica de la vista de usuarios.

Responsabilidad:

```txt
Cargar usuarios.
Actualizar roles.
Controlar el usuario seleccionado.
Abrir y cerrar el modal.
Manejar mensajes de éxito o error.
```

---

### `interfaces/user.interface.ts`

Contiene los tipos e interfaces relacionados con los usuarios.

Responsabilidad:

```txt
Definir la estructura de un usuario.
Definir los roles permitidos.
Reutilizar los tipos en componentes, hooks y servicios.
```

Ejemplo:

```ts
export type UserRole = "USER" | "ADMIN" | "AGENT";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
```

---

### `components/common/DataTable.tsx`

Componente reutilizable para mostrar tablas.

Responsabilidad:

```txt
Mostrar columnas dinámicas, registros y paginación.
```

Este componente no debe depender únicamente de usuarios. Debe poder reutilizarse en otras vistas.

---

### `components/common/PageHeader.tsx`

Componente reutilizable para encabezados de páginas.

Responsabilidad:

```txt
Mostrar título, descripción y acciones principales de una página.
```

---

### `components/common/EmptyState.tsx`

Componente reutilizable para mostrar mensajes cuando no hay datos.

Responsabilidad:

```txt
Mostrar un estado vacío con título y descripción.
```

---

### `components/common/LoadingBox.tsx`

Componente reutilizable para mostrar carga.

Responsabilidad:

```txt
Mostrar un indicador de carga centrado.
```

---

### `components/common/CustomSnackbar.tsx`

Componente reutilizable para mensajes temporales.

Responsabilidad:

```txt
Mostrar mensajes de éxito, error, advertencia o información.
```

---

### `components/users/ChangeUserRoleDialog.tsx`

Componente específico del módulo de usuarios.

Responsabilidad:

```txt
Mostrar la información del usuario seleccionado y permitir cambiar su rol.
```

---

### `components/users/UserRoleChip.tsx`

Componente específico para mostrar visualmente el rol de un usuario.

Responsabilidad:

```txt
Mostrar el rol con color, ícono y etiqueta.
```

---

### `data/userRoles.ts`

Contiene la lista de roles disponibles.

Responsabilidad:

```txt
Centralizar los roles para no repetirlos en diferentes archivos.
```

---

### `utils/userRoleUtils.tsx`

Contiene funciones relacionadas con la visualización de roles.

Responsabilidad:

```txt
Obtener el texto visible del rol.
Obtener el color del rol.
Obtener el ícono del rol.
```

---

### `services/userService.ts`

Contiene las peticiones relacionadas con usuarios.

Responsabilidad:

```txt
Consultar usuarios.
Actualizar roles.
Conectarse con el backend.
```

---

## 7. Buenas prácticas del proyecto

### Separar responsabilidades

Cada archivo debe tener una responsabilidad clara.

```txt
La página arma la vista.
El hook maneja la lógica.
El service se comunica con el backend.
El componente muestra interfaz.
El interface define tipos y estructuras de datos.
El utils transforma o formatea información.
```

---

### Crear componentes reutilizables

Los componentes deben pensarse para ser usados en varias vistas cuando sea posible.

Correcto:

```txt
components/common/DataTable.tsx
```

No recomendado si se puede reutilizar:

```txt
components/users/UsersTable.tsx
```

La tabla debe ser general para que pueda usarse en usuarios, PQR, roles u otros módulos.

---

### Evitar lógica pesada en las páginas

Las páginas no deberían tener demasiadas funciones internas.  
Cuando una página tiene mucha lógica, se recomienda crear un hook personalizado.

Ejemplo:

```txt
useAdminUsers.ts
```

---

### Evitar repetir datos fijos

Listas como roles, estados o tipos deben ir en `data/`.

Ejemplo:

```txt
data/userRoles.ts
```

---

### Evitar repetir funciones auxiliares

Funciones como obtener etiquetas, colores o formatear fechas deben ir en `utils/`.

Ejemplo:

```txt
utils/userRoleUtils.tsx
```

---

## 8. Conclusión

Esta estructura permite que el proyecto crezca de forma organizada, clara y profesional.  
Al separar páginas, componentes, servicios, hooks, datos, validaciones y utilidades, el código se vuelve más fácil de mantener, reutilizar y escalar.

Además, el enfoque de componentes reutilizables permite que elementos como tablas, encabezados, mensajes y estados vacíos puedan usarse en diferentes módulos sin repetir código.
