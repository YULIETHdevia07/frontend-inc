# Documentación de dependencias instaladas en el frontend

Esta sección registra las principales dependencias instaladas durante el desarrollo del frontend de la aplicación **App**, explicando el propósito de cada una dentro del proyecto.

---

## 1. Creación del proyecto con Vite

Para iniciar el proyecto frontend se utilizó **Vite**, una herramienta moderna que permite crear aplicaciones React de forma rápida, ligera y optimizada para desarrollo.

### Comando ejecutado

```bash
npm create vite@latest .
```

### Tecnologías seleccionadas

```txt
React
TypeScript
```

### ¿Para qué se utilizó?

Vite permitió crear la base inicial del proyecto frontend con React y TypeScript. Esta configuración facilita trabajar con componentes, tipado estático, recarga rápida en desarrollo y una estructura más moderna que otras configuraciones tradicionales.

---

## 2. Instalación de dependencias iniciales del proyecto

Después de crear el proyecto, se instalaron las dependencias base generadas por Vite.

### Comando ejecutado

```bash
npm install
```

### ¿Para qué se utilizó?

Este comando instaló todos los paquetes definidos inicialmente en el archivo `package.json`, permitiendo ejecutar correctamente el proyecto React.

---

## 3. Instalación de Axios y React Router DOM

Se instalaron dependencias necesarias para conectar el frontend con el backend y manejar la navegación interna de la aplicación.

### Comando ejecutado

```bash
npm install axios react-router-dom
```

### Dependencias instaladas

| Dependencia | Uso dentro del proyecto |
|---|---|
| `axios` | Permite realizar peticiones HTTP al backend, como iniciar sesión, registrar usuarios y consultar información protegida. |
| `react-router-dom` | Permite crear rutas públicas y privadas dentro de la aplicación, como Login, Register y Dashboard. |

### ¿Para qué se utilizó Axios?

Axios se configuró en el archivo:

```txt
src/api/axios.ts
```

Su función principal es centralizar la conexión con el backend mediante una `baseURL`, evitando repetir la URL del servidor en cada petición.

También se configuró un interceptor para enviar automáticamente el token JWT en las peticiones protegidas:

```tsx
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

Esto permite que el frontend pueda comunicarse con rutas protegidas del backend sin tener que agregar manualmente el token en cada petición.

### ¿Para qué se utilizó React Router DOM?

React Router DOM se utilizó para manejar la navegación entre vistas sin recargar la página.

Rutas principales implementadas:

```txt
/           → Login
/register   → Register
/dashboard  → Dashboard
```

También permitió implementar rutas privadas mediante `PrivateRoute` y renderizar contenido dinámico con `Outlet` dentro del `DashboardLayout`.

---

## 4. Instalación de Material UI

Se instaló **Material UI** para construir una interfaz moderna, profesional y reutilizable.

### Comando ejecutado

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Dependencias instaladas

| Dependencia | Uso dentro del proyecto |
|---|---|
| `@mui/material` | Proporciona componentes visuales como `Box`, `Button`, `Typography`, `AppBar`, `Toolbar`, `Avatar`, `List`, `Collapse`, entre otros. |
| `@emotion/react` | Librería necesaria para que Material UI maneje estilos internos y estilos dinámicos. |
| `@emotion/styled` | Permite el funcionamiento del sistema de estilos de Material UI. |

### ¿Para qué se utilizó Material UI?

Material UI se utilizó para diseñar las principales interfaces del frontend, entre ellas:

```txt
Login
Register
Header
SidebarMenu
DashboardLayout
Dashboard
```

Además, permitió trabajar con el sistema `sx`, el cual facilita escribir estilos directamente sobre los componentes de forma organizada.

Ejemplo:

```tsx
<Box sx={style.container}>
  Contenido
</Box>
```

---

## 5. Instalación de íconos de Material UI

Para mejorar visualmente el menú lateral, el header y los botones del sistema, se instalaron los íconos oficiales de Material UI.

### Comando ejecutado

```bash
npm install @mui/icons-material
```

### Dependencia instalada

| Dependencia | Uso dentro del proyecto |
|---|---|
| `@mui/icons-material` | Permite usar íconos visuales dentro de los componentes del sistema. |

### Íconos utilizados

Algunos íconos implementados fueron:

```txt
MenuIcon
ChevronLeftIcon
FolderIcon
FolderOpenIcon
ExpandLessIcon
ExpandMoreIcon
ArticleIcon
RadioButtonUncheckedIcon
LogoutIcon
PersonIcon
```

### ¿Para qué se utilizaron?

Los íconos se usaron para mejorar la experiencia visual del usuario y hacer más clara la navegación.

Ejemplos de uso:

| Ícono | Uso |
|---|---|
| `MenuIcon` | Abrir el menú lateral cuando está cerrado. |
| `ChevronLeftIcon` | Cerrar el menú lateral cuando está abierto. |
| `FolderIcon` | Representar módulos cerrados del menú. |
| `FolderOpenIcon` | Representar módulos abiertos del menú. |
| `ExpandLessIcon` | Indicar que una sección puede contraerse. |
| `ExpandMoreIcon` | Indicar que una sección puede desplegarse. |
| `ArticleIcon` | Representar submódulos. |
| `LogoutIcon` | Acompañar el botón de cerrar sesión. |
| `PersonIcon` | Representar al usuario cuando no hay inicial disponible. |

---

# Resumen de dependencias instaladas

| Dependencia | Comando | Propósito |
|---|---|---|
| Vite | `npm create vite@latest .` | Crear el proyecto frontend con React y TypeScript. |
| Dependencias base | `npm install` | Instalar paquetes iniciales del proyecto. |
| Axios | `npm install axios react-router-dom` | Realizar peticiones HTTP al backend. |
| React Router DOM | `npm install axios react-router-dom` | Manejar rutas públicas, privadas y navegación SPA. |
| Material UI | `npm install @mui/material @emotion/react @emotion/styled` | Crear interfaces visuales modernas y reutilizables. |
| MUI Icons | `npm install @mui/icons-material` | Agregar íconos al header, sidebar y botones. |

---

# Conclusión

Durante esta etapa del frontend se instalaron y configuraron herramientas fundamentales para construir una aplicación moderna, organizada y escalable. Vite permitió iniciar el proyecto con React y TypeScript; Axios facilitó la comunicación con el backend; React Router DOM permitió manejar la navegación; Material UI aportó componentes visuales profesionales; y MUI Icons mejoró la experiencia gráfica de la interfaz.

Además, se avanzó en la construcción de un layout administrativo más limpio, integrando `Header`, `SidebarMenu` y `DashboardLayout` de manera organizada. El botón de abrir y cerrar menú se trasladó al header, el menú lateral quedó más limpio visualmente y se mejoró la presentación del usuario autenticado mediante avatar, saludo y botón de cierre de sesión.
