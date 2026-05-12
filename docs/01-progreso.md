# Inicialización Frontend

## 1. Inicialización del proyecto frontend

Se utilizó Vite para crear el frontend del proyecto con React y TypeScript.

Comando ejecutado:

```bash
npm create vite@latest .
```

### Tecnologías seleccionadas

```txt
React
TypeScript
```

---

## 2. Instalación de dependencias iniciales

Se instalaron las dependencias del proyecto frontend.

Comando ejecutado:

```bash
npm install
```

---

## 3. Ejecución del frontend

Se ejecutó el proyecto en modo desarrollo.

Comando:

```bash
npm run dev
```

---

## 4. Instalación de dependencias adicionales

Se instalaron librerías necesarias para la conexión con el backend y manejo de rutas.

Dependencias instaladas:

- axios
- react-router-dom

Comando:

```bash
npm install axios react-router-dom
```

---

# Limpieza inicial del proyecto

Se eliminaron archivos y recursos innecesarios generados automáticamente por Vite para comenzar con una estructura limpia y profesional.

---

## Archivos eliminados

```txt
src/assets/
src/App.css
src/index.css
README.md
ETC...
```

---

## Archivos conservados

```txt
package.json
package-lock.json
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
index.html
src/App.tsx
src/main.tsx
```

---

# Estructura inicial frontend

Se organizó la carpeta `src` utilizando una arquitectura escalable y modular.

### Estructura creada

```txt
src/
│
├── api/
├── components/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── styles/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

---

# Descripción de carpetas

| Carpeta | Descripción |
|---|---|
| api | Conexión y peticiones al backend |
| components | Componentes reutilizables |
| context | Manejo de estados globales |
| hooks | Custom hooks React |
| layouts | Estructuras generales de páginas |
| pages | Vistas y pantallas principales |
| routes | Configuración de rutas React Router |
| styles | Estilos globales y personalizados |

---

# Desarrollo Frontend — Autenticación y Layout

## 5. Configuración de Material UI

Se instaló Material UI para la construcción de interfaces modernas y reutilizables.

### Dependencias instaladas

- @mui/material
- @emotion/react
- @emotion/styled

### Comando ejecutado

```bash
npm install @mui/material @emotion/react @emotion/styled
```

---

## 6. Implementación de tema global

Se implementó el sistema de temas de Material UI para centralizar colores, tipografía y estilos globales del proyecto.

### Archivo creado

```txt
src/theme/theme.ts
```

### Funcionalidades implementadas

- Paleta de colores global
- Configuración de colores primarios
- Configuración de colores secundarios
- Colores de fondo
- Colores de texto
- Configuración tipográfica global

---

## 7. Integración ThemeProvider

Se configuró `ThemeProvider` en la aplicación para permitir acceso global al tema de Material UI.

### Archivo modificado

```txt
src/main.tsx
```

### Funcionalidades implementadas

- Integración de tema global
- Uso de CssBaseline
- Acceso global a palette
- Centralización visual de estilos

---

## 8. Desarrollo pantalla Login

Se desarrolló la pantalla de autenticación para el inicio de sesión de usuarios.

### Archivo creado/modificado

```txt
src/pages/Login.tsx
```

### Funcionalidades implementadas

- Inicio de sesión
- Manejo de estados React
- Consumo de API mediante Axios
- Validación de formulario
- Almacenamiento de token JWT
- Redirección al dashboard
- Integración Material UI
- Diseño visual profesional
- Uso de tema global

---

## 9. Desarrollo pantalla Register

Se desarrolló la pantalla de registro de usuarios.

### Archivo creado/modificado

```txt
src/pages/Register.tsx
```

### Funcionalidades implementadas

- Registro de usuarios
- Manejo de formulario React
- Consumo endpoint register
- Validación inicial
- Redirección al login
- Integración visual Material UI
- Uso de tema global
- Navegación entre pantallas

---

## 10. Configuración Axios

Se configuró Axios para centralizar la conexión con el backend.

### Archivo creado

```txt
src/api/axios.ts
```

### Funcionalidades implementadas

- Conexión centralizada con backend
- Configuración baseURL
- Preparación para JWT
- Reutilización global de peticiones HTTP

---

## 11. Implementación React Router

Se implementó React Router para manejar la navegación SPA del frontend.

### Archivo creado

```txt
src/routes/AppRoutes.tsx
```

### Funcionalidades implementadas

- Navegación SPA
- Rutas públicas
- Rutas privadas iniciales
- Integración de páginas principales

### Rutas actuales

```txt
/
/register
/dashboard
```

---

## 12. Desarrollo layout reutilizable

Se implementó una estructura reutilizable para las vistas privadas del sistema.

### Archivos creados

```txt
src/layouts/DashboardLayout.tsx
src/components/Header.tsx
src/components/SidebarMenu.tsx
```

---

# 13. Implementación Header

El componente `Header` se creó como una estructura reutilizable para la parte superior del sistema, dejando preparada la integración futura de información del usuario autenticado.

### Funcionalidades implementadas

- Barra superior reutilizable
- Diseño reutilizable
- Integración visual con el layout principal

---

## 14. Implementación SidebarMenu

El componente `SidebarMenu` se creó para manejar módulos, submódulos y opciones del sistema.

### Funcionalidades implementadas

- Menú lateral dinámico
- Módulos del sistema
- Submódulos
- Opciones de navegación
- Navegación reutilizable
- Preparación para roles y permisos

---

## 15. Implementación DashboardLayout

El layout `DashboardLayout` se creó para reutilizar la estructura privada del sistema.

### Estructura implementada

```txt
Header
SidebarMenu
MainContent
```

### Funcionalidades implementadas

- Header reutilizable
- Sidebar reutilizable
- Contenedor dinámico de páginas
- Separación visual de contenido
- Escalabilidad de vistas privadas


---
 ## Documentación Frontend: Autenticación, Rutas Privadas y Layout Administrativo

Esta documentación describe el proceso realizado en el frontend de la aplicación **App** para organizar el sistema de rutas, proteger vistas privadas, implementar autenticación global con Context API y mostrar la información del usuario autenticado en el Header.

---

## 1. Configuración correcta de `main.tsx`

El archivo `main.tsx` se encarga de envolver toda la aplicación con los proveedores globales necesarios.

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### Función de cada elemento

| Elemento | Función |
|---|---|
| `BrowserRouter` | Permite usar rutas en React Router DOM. |
| `ThemeProvider` | Aplica el tema global de Material UI. |
| `CssBaseline` | Normaliza estilos base de Material UI. |
| `AuthProvider` | Hace disponible la autenticación en toda la aplicación. |
| `App` | Componente principal de la aplicación. |

---

## 2. Organización de rutas en `AppRoutes.tsx`

El archivo `AppRoutes.tsx` contiene la estructura principal de navegación.

```tsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
```

### Tipos de rutas

#### Rutas públicas

Las rutas públicas son aquellas que cualquier usuario puede visitar sin iniciar sesión.

```tsx
<Route path="/" element={<Login />} />
<Route path="/register" element={<Register />} />
```

Estas rutas corresponden a:

```txt
/          → Login
/register  → Register
```

#### Rutas privadas

Las rutas privadas requieren que el usuario esté autenticado.

```tsx
<Route element={<PrivateRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
</Route>
```

La estructura funciona así:

```txt
PrivateRoute
└── DashboardLayout
    └── Dashboard
```

---

## 3. Creación de `PrivateRoute`

El componente `PrivateRoute` funciona como un guardián de rutas privadas.

Su responsabilidad es verificar si el usuario está autenticado antes de permitir el acceso a una vista privada.

### ¿Cómo funciona?

1. Obtiene el estado de autenticación desde `AuthContext`.
2. Si la aplicación está cargando, muestra un `CircularProgress`.
3. Si el usuario no está autenticado, lo redirige al Login.
4. Si el usuario está autenticado, permite cargar la ruta privada mediante `Outlet`.

---

## 4. Importancia de `Outlet`

`Outlet` es un componente de React Router DOM que permite renderizar rutas hijas.

En `PrivateRoute`, este código:

```tsx
return <Outlet />;
```

significa:

```txt
Si el usuario está autenticado, muestra la ruta hija.
```

En `DashboardLayout`, `Outlet` indica dónde se debe mostrar el contenido interno del dashboard.

---

## 5. Creación del layout administrativo `DashboardLayout`

El `DashboardLayout` permite tener una estructura reutilizable para todas las páginas privadas de la aplicación.

### Estructura visual del layout

```txt
DashboardLayout
├── SidebarMenu
├── Header
└── Contenido dinámico
    └── Outlet
```

Esto permite que más adelante se puedan agregar nuevas páginas privadas como:

```txt
Usuarios
Roles
Productos
Clientes
Ventas
Reportes
Configuración
```

sin repetir el Header ni el Sidebar en cada página.

---

## 6. Creación de `AuthContext`

El `AuthContext` centraliza toda la lógica relacionada con la autenticación del usuario.

Archivo creado:

```txt
src/context/AuthContext.tsx
```

### Estados y funciones del contexto

| Elemento | Función |
|---|---|
| `user` | Guarda la información del usuario autenticado. |
| `token` | Guarda el JWT del usuario. |
| `loading` | Indica si se está verificando la sesión. |
| `login()` | Guarda el token y actualiza el estado global. |
| `logout()` | Elimina el token y cierra la sesión. |
| `isAuthenticated` | Indica si el usuario tiene sesión activa. |

---

## 7. Uso de `login` en la página Login

En el archivo `Login.tsx`, el token se maneja mediante el contexto.

Ejemplo:

```tsx
const { login } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    await login(response.data.token);
    navigate("/dashboard");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};
```

### Ventaja

La autenticación queda centralizada y cualquier componente puede consultar el estado del usuario mediante `useAuth()`.

---
