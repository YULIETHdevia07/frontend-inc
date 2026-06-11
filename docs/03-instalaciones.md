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

---

## 6. Instalación de ExcelJS y File Saver

Se instalaron dependencias para generar y descargar archivos de Excel desde el frontend, especialmente para la funcionalidad de **carga masiva de usuarios**.

### Comando ejecutado

```bash
npm install exceljs file-saver
```

### Dependencias instaladas

| Dependencia | Uso dentro del proyecto |
|---|---|
| `exceljs` | Permite crear archivos Excel desde el frontend, configurar hojas, columnas, estilos, comentarios y generar archivos `.xlsx`. |
| `file-saver` | Permite descargar en el navegador archivos generados desde el frontend, como la plantilla de carga masiva de usuarios. |

### Instalación de tipos para File Saver

Como el proyecto trabaja con TypeScript, también se instaló el paquete de tipos de `file-saver` para evitar errores de tipado.

### Comando ejecutado

```bash
npm install -D @types/file-saver
```

### ¿Para qué se utilizó ExcelJS?

ExcelJS se utilizó para construir una plantilla de Excel llamada:

```txt
plantilla_carga_masiva_usuarios.xlsx
```

Esta plantilla permite registrar usuarios de forma masiva mediante las siguientes columnas:

```txt
nombre | correo | contraseña | rol
```

Además, se aplicaron estilos visuales a los encabezados, colores basados en el tema global de Material UI, comentarios con reglas de uso y configuración de la hoja para mejorar la experiencia del usuario.

Archivo relacionado dentro del proyecto:

```txt
src/utils/downloadBulkUsersTemplate.ts
```

### ¿Para qué se utilizó File Saver?

File Saver se utilizó para descargar automáticamente la plantilla generada por ExcelJS en el navegador. Después de construir el archivo Excel, se genera un `Blob` y se descarga mediante `saveAs`.

Ejemplo de uso:

```tsx
saveAs(blob, "plantilla_carga_masiva_usuarios.xlsx");
```

---

## 7. Instalación de XLSX

Se instaló **XLSX** para trabajar con archivos de Excel desde el frontend.

### Comando ejecutado

```bash
npm install xlsx
```

### Dependencia instalada

| Dependencia | Uso dentro del proyecto                                                |
| ----------- | ---------------------------------------------------------------------- |
| `xlsx`      | Permite leer, procesar o interpretar archivos Excel desde el frontend. |

### ¿Para qué se utilizó XLSX?

XLSX puede utilizarse para leer archivos `.xlsx` cargados por el usuario, procesar su contenido y convertir las filas del archivo en datos que puedan ser enviados al backend.

Esta dependencia puede ser útil en funcionalidades como:

```txt
Carga masiva de usuarios.
Lectura de plantillas Excel.
Validación previa de archivos importados.
Procesamiento de datos antes de enviarlos al backend.
```

---

## 8. Instalación de Socket.IO Client

Se instaló **Socket.IO Client** para permitir la comunicación en tiempo real entre el frontend y el backend, especialmente en la funcionalidad del chat de seguimiento de las PQR.

### Comando ejecutado

```bash
npm install socket.io-client
```

### Dependencia instalada

| Dependencia        | Uso dentro del proyecto                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `socket.io-client` | Permite establecer una conexión en tiempo real entre el frontend y el backend mediante WebSockets, facilitando el envío y recepción de mensajes del chat sin recargar la página. |

### ¿Para qué se utilizó Socket.IO Client?

Socket.IO Client se utilizó para implementar el chat en tiempo real dentro del módulo de PQR. Gracias a esta dependencia, el usuario, el administrador o el agente pueden enviar y recibir mensajes de manera inmediata dentro de una PQR específica.

La configuración principal del socket se realizó en el archivo:

```txt
src/services/pqrSocketService.ts
```

En este archivo se centralizó la conexión con el servidor de Socket.IO usando la variable de entorno:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Esta variable permite separar la URL del servidor de sockets del código fuente, facilitando la configuración del proyecto en diferentes entornos, como desarrollo o producción.

### Funciones principales implementadas

| Función                          | Propósito                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `connectPqrSocket(token)`        | Crea o retorna una conexión activa con Socket.IO, enviando el token JWT para autenticar al usuario. |
| `getPqrSocket()`                 | Retorna la instancia actual del socket.                                                             |
| `joinPqrRoom(pqrId)`             | Une al usuario autenticado a la sala correspondiente de una PQR.                                    |
| `sendPqrMessage(pqrId, content)` | Envía un mensaje dentro del chat de una PQR.                                                        |
| `listenJoinedPqrRoom(callback)`  | Escucha la confirmación del backend cuando el usuario entra a una sala.                             |
| `listenNewPqrMessage(callback)`  | Escucha los nuevos mensajes recibidos en tiempo real.                                               |
| `listenPqrSocketError(callback)` | Escucha errores enviados por el backend relacionados con el socket.                                 |
| `removePqrSocketListeners()`     | Limpia los listeners para evitar eventos duplicados.                                                |
| `disconnectPqrSocket()`          | Desconecta el socket cuando sea necesario.                                                          |

### Ejemplo de conexión con Socket.IO

```tsx
socket = io(SOCKET_URL, {
  auth: {
    token,
  },
});
```

Esta conexión permite que el backend identifique al usuario autenticado mediante el token JWT y controle qué acciones puede realizar dentro del chat, según su rol y permisos.

### Eventos utilizados en el chat

| Evento             | Uso dentro del proyecto                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `join_pqr`         | Permite que el usuario ingrese a la sala de una PQR específica.                        |
| `send_pqr_message` | Envía un mensaje al backend para ser guardado y distribuido a los usuarios conectados. |
| `joined_pqr`       | Confirma que el usuario ingresó correctamente a la sala de la PQR.                     |
| `new_pqr_message`  | Recibe en tiempo real un nuevo mensaje enviado dentro de la PQR.                       |
| `socket_error`     | Recibe errores relacionados con permisos, conexión o envío de mensajes.                |
| `connect`          | Detecta cuando el socket se conecta correctamente.                                     |
| `disconnect`       | Detecta cuando el socket pierde la conexión.                                           |
| `connect_error`    | Detecta errores al intentar conectar el chat en tiempo real.                           |

### Uso dentro del chat PQR

La lógica del chat se integró mediante un hook personalizado encargado de manejar el historial de mensajes, la conexión al socket, la unión a la sala de la PQR y el envío de mensajes.

Archivo relacionado:

```txt
src/hooks/usePqrChat.ts
```

Este hook permite:

```txt
Cargar el historial de mensajes.
Conectar el socket con el token del usuario autenticado.
Unir al usuario a la sala de la PQR seleccionada.
Escuchar nuevos mensajes en tiempo real.
Enviar mensajes desde el frontend.
Controlar errores del chat.
Evitar listeners duplicados.
Actualizar el estado visual de conexión.
```

Además, la vista visual del chat se implementó en:

```txt
src/components/pqrs/PqrChatView.tsx
```

Este componente permite mostrar la conversación de forma organizada, diferenciando visualmente los mensajes enviados y recibidos. También muestra información de la PQR, estado, fecha, usuario, agente asignado, mensajes del chat, campo de escritura y botón de envío.

---

## 9. Instalación de Yup

Se instaló **Yup** para facilitar la validación de formularios dentro del frontend.

### Comando ejecutado

```bash
npm install yup
```

### Dependencia instalada

| Dependencia | Uso dentro del proyecto                                                                                                                               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yup`       | Permite definir esquemas de validación para formularios, controlando campos obligatorios, formatos de correo, longitudes mínimas, entre otras reglas. |

### ¿Para qué se utilizó Yup?

Yup se utiliza para validar datos ingresados por el usuario antes de enviarlos al backend. Esto ayuda a mejorar la experiencia del usuario y evita enviar información incompleta o incorrecta desde el frontend.

Puede aplicarse en formularios como:

```txt
Login
Registro de usuarios
Creación de PQR
Actualización de usuarios
Carga o validación de datos
```

---



## 10. Instalación de tipos de Node

Como el proyecto trabaja con TypeScript, también se instaló el paquete de tipos de Node.js.

### Comando ejecutado

```bash
npm install -D @types/node
```

### Dependencia instalada

| Dependencia   | Uso dentro del proyecto                                       |
| ------------- | ------------------------------------------------------------- |
| `@types/node` | Agrega soporte de tipos de Node.js en el proyecto TypeScript. |

### ¿Para qué se utilizó?

Este paquete permite que TypeScript reconozca tipos y configuraciones relacionadas con el entorno de Node.js. Puede ser útil en archivos de configuración, variables de entorno o procesos internos del proyecto frontend.

---

# Resumen actualizado de dependencias instaladas

| Dependencia         | Comando                                                    | Propósito                                                    |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| Vite                | `npm create vite@latest .`                                 | Crear el proyecto frontend con React y TypeScript.           |
| Dependencias base   | `npm install`                                              | Instalar paquetes iniciales del proyecto.                    |
| Axios               | `npm install axios react-router-dom`                       | Realizar peticiones HTTP al backend.                         |
| React Router DOM    | `npm install axios react-router-dom`                       | Manejar rutas públicas, privadas y navegación SPA.           |
| Material UI         | `npm install @mui/material @emotion/react @emotion/styled` | Crear interfaces visuales modernas y reutilizables.          |
| MUI Icons           | `npm install @mui/icons-material`                          | Agregar íconos al header, sidebar y botones.                 |
| ExcelJS             | `npm install exceljs file-saver`                           | Crear plantillas Excel para la carga masiva de usuarios.     |
| File Saver          | `npm install exceljs file-saver`                           | Descargar archivos generados desde el frontend.              |
| Tipos de File Saver | `npm install -D @types/file-saver`                         | Agregar soporte de TypeScript para `file-saver`.             |
| Socket.IO Client    | `npm install socket.io-client`                             | Implementar comunicación en tiempo real para el chat de PQR. |
| Yup                 | `npm install yup`                                          | Validar formularios del frontend mediante esquemas.          |
| XLSX                | `npm install xlsx`                                         | Leer y procesar archivos Excel desde el frontend.            |
| Tipos de Node       | `npm install -D @types/node`                               | Agregar soporte de tipos de Node.js en TypeScript.           |

---

# Conclusión actualizada

Durante esta etapa del frontend se instalaron y configuraron herramientas fundamentales para construir una aplicación moderna, organizada y escalable. Vite permitió iniciar el proyecto con React y TypeScript; Axios facilitó la comunicación con el backend; React Router DOM permitió manejar la navegación; Material UI aportó componentes visuales profesionales; MUI Icons mejoró la experiencia gráfica de la interfaz; y ExcelJS junto con File Saver permitieron generar y descargar plantillas de Excel para procesos como la carga masiva de usuarios.

Además, se incorporó Socket.IO Client para habilitar la comunicación en tiempo real dentro del chat de seguimiento de las PQR. Esta integración permitió conectar el frontend con el servidor de sockets, unir al usuario a una sala específica de PQR, enviar mensajes, recibir respuestas en tiempo real y controlar errores de conexión. Con esto, el sistema ofrece una experiencia más dinámica e inmediata entre usuarios, agentes y administradores.

También se agregaron dependencias complementarias como Yup, para fortalecer la validación de formularios, XLSX, para el manejo de archivos Excel, y tipos de Node.js para mejorar el soporte de TypeScript en el proyecto.
