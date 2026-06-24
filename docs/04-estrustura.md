# Documentación de la estructura del proyecto frontend

## 1. Descripción general

Este proyecto frontend está desarrollado con **React**, **TypeScript**, **Vite**, **Material UI**, **React Router DOM** y **Axios**.  
La estructura del proyecto está organizada de forma modular para separar responsabilidades, mejorar el mantenimiento del código y permitir la reutilización de componentes en diferentes vistas del sistema.

La idea principal de esta organización es que cada carpeta tenga una función clara dentro del proyecto. De esta manera, las páginas, componentes, servicios, hooks, estilos, rutas y utilidades se mantienen separados y son más fáciles de modificar o ampliar.

---

## 2. Estructura principal del proyecto

```txt
public/
│
├── assets/
│
src/
│
├── api/
├── components/
├── context/
├── data/
├── hooks/
├── interfaces/
├── pages/
├── routes/
├── services/
├── styles/
├── templates/
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

### `public/`

La carpeta `public/` contiene archivos estáticos que se sirven directamente desde la raíz del proyecto cuando la aplicación se ejecuta o se compila.

En proyectos desarrollados con Vite, los archivos ubicados dentro de `public/` pueden utilizarse directamente mediante rutas absolutas, sin necesidad de importarlos en los componentes.

Responsabilidad principal:

```txt
Guardar archivos públicos que deben estar disponibles directamente para la aplicación.
```

---

### `public/assets/`

La carpeta contiene los recursos gráficos públicos del sistema.

En este proyecto, se utiliza para guardar los logos e íconos principales de la aplicación.

```txt
public/
└── assets/
    ├── logo.png
    ├── logo-blanco.png
    ├── logo-icono.png
    ├── logo-blanco-icono.png
    └── logo-icono-web.png
```

Responsabilidad principal:

```txt
Guardar los logos e íconos públicos del sistema.
```

En Vite, los archivos que están dentro de `public/assets/` no se importan con `import`.
Estos archivos se utilizan directamente mediante rutas públicas.

Se usa en el código como:

```txt
/assets/logo.png
```

---

### `src/api/`

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

### `src/components/`

Esta carpeta contiene los componentes visuales del proyecto. Su objetivo principal es organizar la interfaz en piezas reutilizables, evitando repetir código y facilitando el mantenimiento del sistema.

Los componentes se organizan según su nivel de reutilización y el módulo al que pertenecen.

```txt
components/
│
├── common/
│   ├── BulkUploadDialog.tsx
│   ├── ClearableSelect.tsx
│   ├── CustomSnackbar.tsx
│   ├── DataTable.tsx
│   ├── EmptyState.tsx
│   ├── Header.tsx
│   ├── LoadingBox.tsx
│   ├── NotificationBell.tsx
│   ├── PageContainer.tsx
│   ├── PageHeader.tsx
│   ├── SidebarMenu.tsx
│   ├── StatsSummary.tsx
│   └── ViewToggleButtons.tsx
│
├── layouts/
│   └── DashboardLayout.tsx
│
├── pqr/
│   ├── PqrChatView.tsx
│   ├── PqrRatingSummary.tsx
│   └── PqrTicketCard.tsx
│
└── users/
    ├── ChangeUserRoleDialog.tsx
    └── UserRoleChip.tsx
```

---

#### `src/components/common/`

En esta carpeta se ubican los componentes comunes o reutilizables del sistema.
Estos componentes no pertenecen exclusivamente a un módulo, por lo tanto, pueden usarse en diferentes vistas como usuarios, PQR, reportes, roles u otros módulos futuros.

| Componente              | Descripción                                                                                                                                                                                               | Reutilización dentro del proyecto                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BulkUploadDialog.tsx`  | Componente reutilizable para mostrar un modal de carga masiva de archivos. Permite seleccionar o cargar archivos, mostrar información del proceso y ejecutar acciones relacionadas con importaciones.     | Puede utilizarse en usuarios, PQR, reportes u otros módulos que requieran carga masiva de datos.                                                                              |
| `ClearableSelect.tsx`   | Componente reutilizable de selección que permite escoger una opción y también limpiar el valor seleccionado.                                                                                              | Puede utilizarse en filtros, formularios, búsquedas avanzadas o selección de estados, roles y tipos de PQR.                                                                   |
| `CustomSnackbar.tsx`    | Componente reutilizable para mostrar mensajes temporales al usuario, como acciones exitosas, errores, advertencias o información.                                                                         | Puede utilizarse en cualquier vista que necesite notificar resultados de acciones realizadas.                                                                                 |
| `DataTable.tsx`         | Componente reutilizable para mostrar información en formato de tabla. Puede recibir columnas, filas y acciones configuradas desde la vista donde se use.                                                  | Puede utilizarse para listar usuarios, PQR, roles, reportes u otros registros del sistema.                                                                                    |
| `EmptyState.tsx`        | Componente reutilizable para mostrar un mensaje cuando no existen datos disponibles en una vista.                                                                                                         | Puede utilizarse cuando no hay usuarios, PQR, resultados de búsqueda o registros para mostrar.                                                                                |
| `Header.tsx`            | Componente reutilizable que representa el encabezado superior del sistema. Puede mostrar información del usuario autenticado, acciones rápidas o el botón para abrir y cerrar el menú lateral.            | Se utiliza principalmente dentro del layout principal de las vistas protegidas.                                                                                               |
| `LoadingBox.tsx`        | Componente reutilizable para mostrar un estado de carga mientras se obtiene información del backend.                                                                                                      | Puede utilizarse en tablas, formularios, vistas de detalle o cualquier módulo que cargue datos.                                                                               |
| `NotificationBell.tsx`  | Componente reutilizable que muestra la campana de notificaciones, el contador de notificaciones no leídas y el listado de notificaciones del usuario autenticado.                                         | Se utiliza dentro de `Header.tsx` para mostrar novedades importantes del sistema, como creación, asignación, cierre o calificación de PQR.                                    |
| `PageContainer.tsx`     | Componente reutilizable que sirve como contenedor general para organizar el contenido de una página. Ayuda a mantener márgenes, espaciados y estructura visual consistente.                               | Puede utilizarse en páginas como usuarios, PQR, dashboard, reportes y demás vistas internas.                                                                                  |
| `PageHeader.tsx`        | Componente reutilizable para mostrar el encabezado de una página, incluyendo título, descripción y acciones principales.                                                                                  | Puede utilizarse en vistas como administración de usuarios, listado de PQR, creación de registros o reportes.                                                                 |
| `SidebarMenu.tsx`       | Componente reutilizable que representa el menú lateral del sistema. Permite mostrar opciones de navegación según los módulos disponibles y el rol del usuario.                                            | Se utiliza dentro del layout principal para navegar entre las secciones del sistema.                                                                                          |
| `StatsSummary.tsx`      | Componente reutilizable para mostrar tarjetas de resumen con un ícono, una etiqueta y un valor numérico o textual. Permite presentar indicadores importantes de una vista de forma clara y compacta.      | Puede utilizarse en módulos como PQR, usuarios, dashboard o reportes para mostrar conteos como total de registros, pendientes, cerrados, asignados o por calificar.           |
| `ViewToggleButtons.tsx` | Componente reutilizable para mostrar botones de cambio de vista. Recibe opciones con etiqueta, valor, ícono y contador opcional, permitiendo alternar entre diferentes estados o secciones de una página. | Puede utilizarse en vistas que necesiten cambiar entre categorías, por ejemplo PQR disponibles y PQR asignadas, registros activos e inactivos, o diferentes tipos de listado. |

El objetivo de `components/common/` es centralizar todos los elementos visuales que pueden servir en varias partes del sistema. Por ejemplo, `DataTable.tsx` no debe ser una tabla exclusiva para usuarios, sino una tabla general que pueda adaptarse a usuarios, PQR, roles o cualquier otro listado.

---

#### `src/components/layouts/`

En esta carpeta se ubican los componentes encargados de definir la estructura visual general de las páginas.

| Componente            | Descripción                                                                                                                                                                | Uso dentro del proyecto                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `DashboardLayout.tsx` | Define la estructura principal de las páginas internas del sistema. Organiza elementos como el header, el sidebar y el área donde se renderiza el contenido de cada vista. | Se utiliza para envolver páginas protegidas como Dashboard, Usuarios, PQR, Reportes u otros módulos internos. |

El layout permite mantener una misma estructura visual en las páginas principales del sistema y evita repetir el mismo diseño en cada vista.

---

#### `src/components/pqr/`

En esta carpeta se ubican los componentes específicos del módulo de PQR.
Estos componentes están relacionados directamente con la lógica visual de las solicitudes, el chat y la calificación del servicio.

| Componente             | Descripción                                                                                                                                                                                                                                                                                                                                                                            | Uso dentro del proyecto                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PqrChatView.tsx`      | Componente encargado de mostrar la vista visual del chat de una PQR. Presenta la información de la solicitud, los mensajes enviados y recibidos, el campo de escritura, el botón para enviar mensajes, el botón para adjuntar archivos y la visualización de imágenes o documentos enviados en la conversación.                                                                        | Se utiliza en el módulo de PQR para permitir la comunicación entre usuario, agente o administrador mediante mensajes de texto y archivos adjuntos.  |
| `PqrRatingSummary.tsx` | Componente encargado de mostrar el resumen de la calificación realizada por el usuario sobre una PQR. Puede incluir la puntuación, comentario y fecha de calificación.                                                                                                                                                                                                                 | Se utiliza en vistas donde se necesita mostrar la valoración dada a una PQR respondida o cerrada.                                                   |
| `PqrTicketCard.tsx`    | Componente encargado de mostrar una PQR en formato de tarjeta compacta. Presenta el identificador de la PQR, tipo de caso, estado, prioridad, fecha, usuario, agente asignado cuando aplica, descripción, calificación, acciones relacionadas con estado, prioridad y chat. También puede mostrar un contador visual de mensajes sin revisar cuando la PQR tiene novedades en el chat. | Se utiliza en vistas como `AgentPqrs` y `AdminPqrs` para reutilizar el diseño visual de las tarjetas de PQR y evitar repetir código en cada página. |

Estos componentes se ubican en `components/pqr/` porque dependen directamente del módulo de PQR y no son elementos generales del sistema.

---

#### `src/components/users/`

En esta carpeta se ubican los componentes específicos del módulo de usuarios.
Estos componentes dependen directamente de la información, acciones o reglas relacionadas con los usuarios del sistema.

| Componente                 | Descripción                                                                                                                                            | Uso dentro del proyecto                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `ChangeUserRoleDialog.tsx` | Componente que muestra un modal para cambiar el rol de un usuario seleccionado. Permite visualizar información del usuario y seleccionar un nuevo rol. | Se utiliza en la administración de usuarios.                                              |
| `UserRoleChip.tsx`         | Componente visual que muestra el rol de un usuario mediante una etiqueta o chip con color, texto e ícono.                                              | Se utiliza en tablas, listados o detalles donde se necesite mostrar el rol de un usuario. |

Estos componentes no se ubican en `components/common/` porque su uso está relacionado directamente con el módulo de usuarios.

---

#### Regla de organización de componentes

```txt
Si el componente puede usarse en varias vistas, debe ir en components/common.
Si el componente solo pertenece a un módulo específico, debe ir en components/nombreModulo.
Si el componente define la estructura visual general de una página, debe ir en components/layouts.
```

Esta organización permite que el proyecto sea más limpio, escalable y fácil de mantener, ya que cada componente tiene una responsabilidad clara y una ubicación lógica dentro de la estructura del frontend.

---

### `src/context/`

Esta carpeta contiene los contextos globales de React.

Se utiliza para manejar información que debe estar disponible en varias partes de la aplicación, como la autenticación del usuario, el token, la sesión activa y el cierre de sesión.

Ejemplo:

```txt
context/
└── AuthContext.tsx
```

| Archivo           | Descripción                                                                                                                                                                        | Uso dentro del proyecto                                                                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthContext.tsx` | Contexto encargado de manejar el usuario autenticado, el token, el inicio de sesión, el cierre de sesión y la conexión global con Socket.IO cuando el usuario ya está autenticado. | Se utiliza para permitir que componentes, hooks y páginas accedan al usuario actual, validen si existe sesión activa y desconecten el socket al cerrar sesión. |

---

#### Responsabilidad principal

```txt
Manejar el estado global de autenticación.
Guardar y eliminar el token del localStorage.
Consultar el perfil del usuario autenticado.
Conectar Socket.IO cuando existe token y usuario.
Desconectar Socket.IO cuando el usuario cierra sesión.
```

---

#### Funcionamiento general de `AuthContext.tsx`

El contexto de autenticación administra la sesión del usuario dentro del frontend.

Cuando el usuario inicia sesión, el token se guarda en el `localStorage` y también en el estado global del contexto. Luego, el sistema consulta el perfil del usuario autenticado mediante el endpoint correspondiente.

Si el perfil se obtiene correctamente, se guarda la información del usuario en el estado global. Cuando ya existe un token válido y un usuario cargado, el sistema conecta Socket.IO para habilitar funcionalidades en tiempo real, como el chat de PQR y las notificaciones internas.

Cuando el usuario cierra sesión, se desconecta Socket.IO, se elimina el token del `localStorage` y se limpia la información del usuario autenticado.

---

### `src/data/`

Esta carpeta contiene datos estáticos o listas reutilizables dentro del frontend.

Los archivos ubicados en `data/` no manejan lógica compleja ni realizan peticiones al backend. Su función principal es centralizar información fija que se usa en diferentes partes del sistema, evitando escribir los mismos datos repetidamente dentro de los componentes.

Ejemplos:

```txt
data/
├── appBrand.ts
├── menuItems.ts
├── pqrOptions.ts
└── userRoles.ts
```

Aquí pueden ir datos como:

```txt
Información de la marca
Roles disponibles
Opciones de menú
Estados de una PQR
Tipos de solicitudes
Textos o configuraciones fijas del sistema
```

Responsabilidad principal:

```txt
Centralizar datos fijos para evitar escribirlos repetidamente en los componentes.
```

---

#### `appBrand.ts`

El archivo `appBrand.ts` contiene la información visual fija de la marca del sistema.

Su objetivo principal es centralizar los datos relacionados con el nombre de la aplicación, el logo principal, el ícono del logo y los textos alternativos de las imágenes.


| Propiedad       | Descripción                                             | Uso dentro del proyecto                                                                                              |
| --------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `name`          | Contiene el nombre oficial de la aplicación o empresa.  | Se puede utilizar en títulos, encabezados, menús o pantallas principales.                                            |
| `logo`          | Contiene la ruta del logo principal de INCOBRA a color. | Se utiliza para mostrar el logo completo en pantallas claras como login, header o sidebar.                           |
| `logoWhite`     | Contiene la ruta del logo principal en color blanco.    | Se utiliza cuando el logo debe mostrarse sobre fondos oscuros o fondos institucionales.                              |
| `logoIcon`      | Contiene la ruta del ícono del logo a color.            | Se utiliza cuando se necesita una versión más pequeña del logo, por ejemplo en menús contraídos o vistas responsive. |
| `logoIconWhite` | Contiene la ruta del ícono del logo en color blanco.    | Se utiliza en fondos oscuros, barras laterales o encabezados institucionales.                                        |
| `logoAlt`       | Contiene el texto alternativo de la imagen.             | Mejora la accesibilidad y sirve como descripción si la imagen no carga.                                              |

---

#### `menuItems.ts`

Este archivo contiene las opciones principales del menú del sistema.

Puede incluir información como el nombre de la opción, la ruta a la que debe navegar, el ícono que se va a mostrar y los roles que tienen permiso para verla.

Responsabilidad principal:

```txt
Centralizar las opciones de navegación del sistema.
```
---

#### `pqrOptions.ts`

El archivo `pqrOptions.ts` contiene las opciones estáticas utilizadas en el módulo de PQR.

Su objetivo principal es centralizar las listas que se usan en formularios, filtros y controles de selección relacionados con las solicitudes PQR. De esta manera, los tipos de caso, estados y prioridades no se escriben repetidamente dentro de los componentes o páginas.

| Constante            | Descripción                                                               | Uso dentro del proyecto                                                                                        |
| -------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pqrCaseTypes`       | Contiene los tipos de caso disponibles al momento de crear una nueva PQR. | Se utiliza en formularios donde el usuario selecciona el tipo de solicitud que desea crear.                    |
| `pqrStatusOptions`   | Contiene los estados disponibles para una PQR.                            | Se utiliza en filtros, selectores o acciones administrativas para consultar o cambiar el estado de una PQR.    |
| `pqrPriorityOptions` | Contiene las prioridades disponibles para una PQR.                        | Se utiliza en filtros o selectores donde el administrador o agente define la prioridad de atención de una PQR. |

---

#### `userRoles.ts`

El archivo `userRoles.ts` contiene la lista de roles disponibles dentro del sistema.

Su objetivo principal es centralizar los roles que pueden asignarse a los usuarios, evitando escribirlos manualmente en diferentes componentes, formularios o filtros.

Este archivo importa el tipo `UserRole` desde la interfaz de usuario para asegurar que los roles definidos correspondan con los valores permitidos por el sistema.

| Constante   | Descripción                                         | Uso dentro del proyecto                                                                                    |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `userRoles` | Contiene la lista de roles disponibles del sistema. | Se utiliza en formularios, filtros y componentes donde se necesita seleccionar o mostrar roles de usuario. |

---
### `src/hooks/`

Los hooks permiten separar la lógica de una página o componente, dejando los componentes visuales más limpios, organizados y fáciles de mantener.

En lugar de manejar toda la lógica directamente dentro de las páginas, los hooks se encargan de procesos como consultar datos, enviar formularios, manejar estados de carga, controlar errores, escuchar eventos en tiempo real y ejecutar acciones relacionadas con cada módulo.

---

#### Estructura

```txt
hooks/
│
├── auth/
│   ├── useLogin.ts
│   └── useRegister.ts
│
├── notifications/
│   └── useNotifications.ts
│
├── pqrs/
│   ├── useAdminPqrs.ts
│   ├── useAgentPqrs.ts
│   ├── useCreatePqr.ts
│   ├── useMyPqrs.ts
│   └── usePqrChat.ts
│
└── users/
    └── useAdminUsers.ts
```

---

#### Responsabilidad principal

```txt
Separar la lógica de negocio, estado y eventos de los componentes visuales.
```

Los hooks permiten que las páginas y componentes se enfoquen principalmente en mostrar la interfaz, mientras que la lógica de consulta, validación, envío de datos y manejo de respuestas queda centralizada en archivos reutilizables.

---

#### Hooks del módulo de autenticación

```txt
hooks/auth/
├── useLogin.ts
└── useRegister.ts
```

| Hook             | Descripción                                                                                                                                         | Uso dentro del proyecto                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `useLogin.ts`    | Maneja la lógica del inicio de sesión, validación del formulario, mensajes de error, estado de carga y redirección del usuario.                     | Se utiliza en la página `Login.tsx`.    |
| `useRegister.ts` | Maneja la lógica del registro de usuarios, validación del formulario, mensajes de éxito o error, estado de carga y redirección al inicio de sesión. | Se utiliza en la página `Register.tsx`. |

---

#### Hooks del módulo de notificaciones

```txt
hooks/notifications/
└── useNotifications.ts
```

| Hook                  | Descripción                                                                                                                                                                   | Uso dentro del proyecto               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `useNotifications.ts` | Maneja la lógica de notificaciones del usuario autenticado, contador de notificaciones no leídas, marcado de notificaciones y escucha de nuevas notificaciones por Socket.IO. | Se utiliza en `NotificationBell.tsx`. |

---

#### Hooks del módulo de PQR

```txt
hooks/pqrs/
├── useAdminPqrs.ts
├── useAgentPqrs.ts
├── useCreatePqr.ts
├── useMyPqrs.ts
└── usePqrChat.ts
```

| Hook              | Descripción                                                                                                                                                                                                                                      | Uso dentro del proyecto                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `useAdminPqrs.ts` | Maneja la lógica relacionada con la administración de PQR, consulta de solicitudes, cambio de estados, prioridades, asignación de agentes y acciones administrativas.                                                                            | Se utiliza en el módulo administrativo de PQR. |
| `useAgentPqrs.ts` | Maneja la lógica de las PQR disponibles y asignadas a los agentes, permitiendo consultar solicitudes, tomar casos y gestionar la atención de las PQR. También actualiza en tiempo real el contador de mensajes sin revisar en las PQR asignadas. | Se utiliza en el módulo de agente.             |
| `useCreatePqr.ts` | Maneja la lógica del formulario para crear una nueva PQR, incluyendo datos del formulario, archivo adjunto, validaciones, mensajes de éxito y errores.                                                                                           | Se utiliza en la página `CreatePqr.tsx`.       |
| `useMyPqrs.ts`    | Maneja la lógica para consultar y mostrar las PQR creadas por el usuario autenticado, incluyendo estados, detalles, chat, calificación cuando aplica y contador de mensajes sin revisar.                                                         | Se utiliza en la página `MyPqrs.tsx`.          |
| `usePqrChat.ts`   | Maneja la lógica del chat de una PQR, carga de mensajes, envío de mensajes, archivos adjuntos, escucha de nuevos mensajes en tiempo real por Socket.IO y marcado del chat como leído cuando el usuario lo abre.                                  | Se utiliza en `PqrChatView.tsx`.               |

---

#### Hooks del módulo de usuarios

```txt
hooks/users/
└── useAdminUsers.ts
```

| Hook               | Descripción                                                                                                                               | Uso dentro del proyecto                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `useAdminUsers.ts` | Maneja la lógica relacionada con la administración de usuarios, carga de usuarios, cambio de roles, carga masiva y mensajes de respuesta. | Se utiliza en el módulo administrativo de usuarios. |

---

### `src/interfaces/`

Esta carpeta contiene las interfaces y tipos de TypeScript que definen la estructura de los datos utilizados en el proyecto.

Aquí se declaran los tipos que representan entidades como usuarios, roles, autenticación, PQR, mensajes, archivos adjuntos, notificaciones, respuestas del backend, carga masiva y datos enviados desde formularios.

Las interfaces permiten que el frontend tenga un tipado más seguro, claro y fácil de mantener, evitando repetir estructuras de datos en diferentes archivos.

---

#### Estructura

```txt
interfaces/
│
├── auth/
│   └── auth.interface.ts
│
├── notifications/
│   └── notification.interface.ts
│
├── pqrs/
│   └── pqr.interface.ts
│
└── users/
    ├── user.interface.ts
    ├── bulkUpload.interface.ts
    └── excel.interface.ts
```

---

#### Interfaces del módulo de autenticación

```txt
interfaces/auth/
└── auth.interface.ts
```

| Archivo             | Descripción                                                                                                                          | Uso dentro del proyecto                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `auth.interface.ts` | Define los tipos relacionados con autenticación, inicio de sesión, registro, respuestas del backend y datos del usuario autenticado. | Se utiliza en servicios, hooks, contexto y páginas relacionadas con login, registro y sesión. |

---

#### Interfaces del módulo de notificaciones

```txt
interfaces/notifications/
└── notification.interface.ts
```

| Archivo                     | Descripción                                                                             | Uso dentro del proyecto                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `notification.interface.ts` | Define los tipos e interfaces relacionados con las notificaciones internas del sistema. | Se utiliza en `notificationService.ts`, `useNotifications.ts`, `NotificationBell.tsx` y eventos de Socket.IO. |

---

#### Interfaces del módulo de PQR

```txt
interfaces/pqrs/
└── pqr.interface.ts
```

| Archivo            | Descripción                                                                                                                                                        | Uso dentro del proyecto                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pqr.interface.ts` | Define los tipos relacionados con PQR, mensajes del chat, archivos adjuntos, estados, prioridades, tipos de caso, calificación y contador de mensajes sin revisar. | Se utiliza en servicios, hooks, componentes y páginas del módulo PQR para tipar solicitudes, mensajes, adjuntos, respuestas del backend y eventos relacionados. |

---

#### Interfaces del módulo de usuarios

```txt
interfaces/users/
├── user.interface.ts
├── bulkUpload.interface.ts
└── excel.interface.ts
```

| Archivo                   | Descripción                                                                                                                          | Uso dentro del proyecto                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `user.interface.ts`       | Define los tipos relacionados con usuarios, roles, agentes, administradores y datos de perfil.                                       | Se utiliza en administración de usuarios, servicios, hooks, componentes relacionados con roles y contexto de autenticación. |
| `bulkUpload.interface.ts` | Define los tipos relacionados con carga masiva de usuarios, archivos seleccionados, resultados del proceso y errores de importación. | Se utiliza en componentes, hooks y servicios relacionados con la carga masiva de usuarios.                                  |
| `excel.interface.ts`      | Define los tipos relacionados con la estructura y manejo de archivos Excel dentro del frontend.                                      | Se utiliza en funciones o plantillas encargadas de generar, leer o preparar archivos de Excel.                              |

---

### `src/pages/`

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
├── admin/
│   ├── AdminUsers.tsx
│   └── AdminPqrs.tsx
│
├── agent/
│   └── AgentPqrs.tsx
│
└── user/
    ├── CreatePqr.tsx
    └── MyPqrs.tsx
```

Responsabilidad principal:

```txt
Armar la vista principal usando componentes, hooks y servicios.
```

Una página no debería tener demasiada lógica interna. La lógica debe separarse en hooks y los elementos visuales reutilizables en componentes.

---

### `src/routes/`

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

### `src/services/`

Esta carpeta contiene las funciones encargadas de comunicarse con el backend.

Aquí se centralizan las peticiones HTTP realizadas con Axios y la comunicación en tiempo real mediante Socket.IO. Su objetivo principal es evitar que los componentes, páginas o hooks llamen directamente a la API o configuren manualmente la conexión con sockets.

Los servicios permiten mantener separada la lógica de comunicación con el backend, dejando que las páginas y componentes se enfoquen en mostrar la información y manejar la interacción del usuario.

---

#### Estructura

```txt
services/
│
├── auth/
│   └── authService.ts
│
├── notifications/
│   └── notificationService.ts
│
├── pqrs/
│   └── pqrService.ts
│
├── sockets/
│   └── socketService.ts
│
└── users/
    └── userService.ts
```

---

#### Responsabilidad principal de `services/`

```txt
Separar las peticiones HTTP y la comunicación en tiempo real de los componentes visuales.
```

Los componentes no deberían llamar directamente a Axios ni configurar directamente Socket.IO.

Lo ideal es que usen funciones centralizadas en los servicios. Esto permite que páginas, hooks y componentes se enfoquen en mostrar información y manejar la interacción del usuario, mientras que los servicios se encargan de la comunicación con el backend.

---

#### Servicios del módulo de autenticación

```txt
services/auth/
└── authService.ts
```

| Archivo          | Descripción                                                           | Uso dentro del proyecto                                                            |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `authService.ts` | Contiene las funciones relacionadas con la autenticación del usuario. | Se utiliza para iniciar sesión, registrar usuarios y manejar el acceso al sistema. |

---

##### Funciones en `authService.ts`

```txt
login()
register()
```

Estas funciones permiten enviar los datos del usuario al backend para iniciar sesión o crear una nueva cuenta.

---

#### Servicios del módulo de notificaciones

```txt
services/notifications/
└── notificationService.ts
```

| Archivo                  | Descripción                                                                              | Uso dentro del proyecto                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `notificationService.ts` | Contiene las funciones HTTP relacionadas con las notificaciones del usuario autenticado. | Se utiliza para consultar notificaciones, obtener el contador de no leídas y marcar notificaciones como leídas. |

---

##### Funciones en `notificationService.ts`

```txt
getNotifications()
getUnreadNotificationsCount()
markNotificationAsRead()
markAllNotificationsAsRead()
```

Estas funciones permiten comunicarse con los endpoints de notificaciones del backend.

Se utilizan para:

```txt
Consultar las notificaciones del usuario autenticado.
Consultar la cantidad de notificaciones no leídas.
Marcar una notificación como leída.
Marcar todas las notificaciones como leídas.
```

---

#### Servicios del módulo de PQR

```txt
services/pqrs/
└── pqrService.ts
```

| Archivo         | Descripción                                           | Uso dentro del proyecto                                                                                                                                                                                              |
| --------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pqrService.ts` | Contiene las funciones HTTP relacionadas con las PQR. | Se utiliza para crear PQR, consultar solicitudes, cambiar estados, asignar agentes, cambiar prioridad, calificar el servicio, cargar el historial de mensajes, enviar archivos adjuntos y marcar el chat como leído. |

---

##### Funciones en `pqrService.ts`

```txt
createPqr()
getMyPqrs()
getAllPqrs()
updatePqrStatus()
updatePqrPriority()
getPqrMessages()
markPqrChatAsRead()
sendPqrMessageWithAttachment()
getAvailablePqrs()
takePqr()
assignPqr()
unassignPqr()
getMyAssignedPqrs()
ratePqr()
```

Estas funciones permiten manejar las operaciones principales del módulo de PQR mediante peticiones HTTP al backend.

Se utilizan para:

```txt
Crear solicitudes PQR.
Consultar PQR del usuario autenticado.
Consultar todas las PQR desde administración.
Consultar PQR disponibles para agentes.
Consultar PQR asignadas al agente autenticado.
Tomar una PQR disponible.
Asignar o reasignar una PQR.
Desasignar una PQR.
Cambiar estado de una PQR.
Cambiar prioridad de una PQR.
Obtener mensajes del chat.
Marcar el chat como leído.
Enviar mensajes con archivo adjunto.
Calificar una PQR cerrada.
```

---

#### Servicios de Socket.IO

```txt
services/sockets/
└── socketService.ts
```

| Archivo            | Descripción                                                                    | Uso dentro del proyecto                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `socketService.ts` | Contiene la configuración y funciones generales de Socket.IO para el frontend. | Se utiliza para conectar y desconectar el socket, manejar el chat de PQR, escuchar notificaciones en tiempo real y actualizar contadores de mensajes sin revisar. |

---

##### Funciones en `socketService.ts`

```txt
connectSocket()
getSocket()
disconnectSocket()
joinPqrRoom()
sendPqrMessage()
listenJoinedPqrRoom()
listenNewPqrMessage()
listenPqrUnreadCountUpdated()
listenNewNotification()
listenSocketError()
removePqrSocketListeners()
removeNotificationSocketListeners()
```

Estas funciones permiten manejar la comunicación en tiempo real mediante Socket.IO.

El archivo `socketService.ts` es general porque el socket se utiliza para varias funcionalidades del sistema:

```txt
Chat en tiempo real de PQR.
Notificaciones internas en tiempo real.
Actualización de contadores de mensajes sin revisar.
```

En el chat de PQR, Socket.IO se utiliza para enviar mensajes de texto y recibir nuevos mensajes en tiempo real.

Los archivos adjuntos no se envían directamente por Socket.IO. Primero se suben mediante HTTP usando `FormData`, y luego el backend emite el evento `new_pqr_message` para actualizar el chat en tiempo real.

---

#### Servicios del módulo de usuarios

```txt
services/users/
└── userService.ts
```

| Archivo          | Descripción                                                            | Uso dentro del proyecto                                                                                    |
| ---------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `userService.ts` | Contiene las funciones relacionadas con la administración de usuarios. | Se utiliza para consultar usuarios, obtener agentes, actualizar roles y realizar carga masiva de usuarios. |

---

##### Funciones en `userService.ts`

```txt
getAllUsers()
getAgents()
updateUserRole()
uploadUsersBulk()
```

Estas funciones permiten consultar los usuarios registrados, obtener los agentes disponibles, actualizar el rol de un usuario y realizar carga masiva desde un archivo Excel.

---

### `src/styles/`

Esta carpeta contiene archivos de estilos globales o estilos reutilizables que no pertenecen directamente a un componente específico.

Estructura:

```txt
styles/
└── filterStyles.css
```

| Archivo            | Descripción                                                                                                                       | Uso dentro del proyecto                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `filterStyles.css` | Archivo de estilos utilizado para personalizar elementos visuales relacionados con filtros, contenedores o controles de búsqueda. | Puede aplicarse en vistas que tengan filtros, formularios de búsqueda, carga masiva |

---

#### Responsabilidad principal

```txt
Guardar estilos globales o reutilizables del proyecto.
```

La carpeta `styles/` ayuda a mantener separados los estilos generales de la lógica de los componentes. Esto permite que el proyecto conserve una mejor organización visual y que ciertos estilos puedan reutilizarse sin repetir código.

---

### `src/theme/`

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

### `src/templates/`

Esta carpeta contiene archivos encargados de generar plantillas descargables desde el frontend.

A diferencia de `utils/`, esta carpeta no se usa para guardar funciones auxiliares pequeñas, sino archivos que construyen documentos completos, como plantillas de Excel, formatos de carga masiva o archivos base que el usuario puede descargar y diligenciar.

Estructura:

```txt
templates/
└── downloadBulkUsersTemplate.ts
```

---

#### `downloadBulkUsersTemplate.ts`

Este archivo contiene la función encargada de generar y descargar la plantilla de Excel para la carga masiva.

```txt
downloadBulkUsersTemplate()
```

| Función                       | Descripción                                                                                                                                                                                       | Uso dentro del proyecto                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `downloadBulkUsersTemplate()` | Genera un archivo Excel con las columnas necesarias para registrar usuarios de forma masiva. También aplica estilos, comentarios de ayuda, validación de roles y descarga automática del archivo. | Se utiliza en el módulo de administración de usuarios para que el administrador pueda descargar una plantilla base y registrar varios usuarios desde un archivo Excel. |

---

### `src/utils/`

Esta carpeta contiene funciones auxiliares reutilizables del proyecto.

Los archivos ubicados en `utils/` no representan componentes visuales, páginas, hooks ni servicios. Su función principal es guardar lógica pequeña, reutilizable y fácil de mantener, que puede usarse en diferentes partes del sistema.

---

#### Estructura

```txt
utils/
│
├── common/
│   ├── avatarUtils.ts
│   ├── dateUtils.ts
│   ├── excelUtils.ts
│   ├── fileUtils.ts
│   ├── formatText.ts
│   └── getErrorMessage.ts
│
├── pqrs/
│   └── pqrUtils.ts
│
└── users/
    └── userRoleUtils.tsx
```

---

#### Utilidades comunes

Los archivos ubicados en `utils/common/` contienen funciones generales que pueden utilizarse en diferentes módulos del sistema.

Estas utilidades no pertenecen exclusivamente a PQR, usuarios, notificaciones o créditos, ya que pueden reutilizarse en varias partes del frontend.

```txt
utils/common/
├── avatarUtils.ts
├── dateUtils.ts
├── excelUtils.ts
├── fileUtils.ts
├── formatText.ts
└── getErrorMessage.ts
```

---

##### `avatarUtils.ts`

Este archivo contiene funciones auxiliares relacionadas con la visualización de nombres o avatares dentro del sistema.

```txt
getInitials()
```

| Función             | Descripción                                                                              | Uso dentro del proyecto                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getInitials(name)` | Obtiene las iniciales de un nombre completo. Si no recibe un nombre válido, retorna `?`. | Se utiliza para mostrar iniciales en componentes visuales como avatares de usuarios, administradores o agentes. |

---

##### `dateUtils.ts`

Este archivo contiene funciones auxiliares relacionadas con el formato de fechas.

```txt
formatDate()
```

| Función            | Descripción                                                    | Uso dentro del proyecto                                                                                                      |
| ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `formatDate(date)` | Convierte una fecha en formato legible en español de Colombia. | Se utiliza para mostrar fechas de creación, actualización, mensajes, registros o cualquier dato temporal dentro del sistema. |

Este archivo se ubica en `utils/common/` porque el formato de fechas puede utilizarse en diferentes módulos como PQR, usuarios, notificaciones, dashboard o futuros módulos como créditos.

---

##### `excelUtils.ts`

Este archivo contiene funciones auxiliares relacionadas con el manejo de datos o formatos utilizados en archivos de Excel.

```txt
toExcelColor()
```

| Función               | Descripción                                                                                             | Uso dentro del proyecto                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `toExcelColor(color)` | Convierte un color hexadecimal, como `#1565c0`, al formato ARGB utilizado por ExcelJS, como `FF1565C0`. | Se utiliza al generar archivos de Excel para aplicar colores personalizados a celdas, encabezados, bordes o estilos. |

---

##### `fileUtils.ts`

Este archivo contiene funciones auxiliares relacionadas con la visualización y formato de información de archivos.

```txt
formatFileSize()
```

| Función                | Descripción                                                                 | Uso dentro del proyecto                                                                                        |
| ---------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `formatFileSize(size)` | Convierte el tamaño de un archivo de bytes a un formato legible en KB o MB. | Se utiliza para mostrar el tamaño de archivos seleccionados o adjuntos de una forma más clara para el usuario. |

---

##### `formatText.ts`

Este archivo contiene funciones auxiliares para transformar textos antes de mostrarlos en la interfaz.

```txt
capitalizeText()
```

| Función                | Descripción                                                                                                                                                | Uso dentro del proyecto                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capitalizeText(text)` | Convierte un texto a formato capitalizado, dejando solo la primera letra en mayúscula y el resto en minúscula. Por ejemplo, transforma `ADMIN` en `Admin`. | Se utiliza para mostrar textos técnicos del sistema de una forma más amigable para el usuario, como roles, estados u otros valores que vienen en mayúscula desde el backend. |

---

##### `getErrorMessage.ts`

Este archivo contiene una función auxiliar encargada de extraer mensajes de error enviados por el backend.

```txt
getErrorMessage()
```

| Función                                  | Descripción                                                                                                                                        | Uso dentro del proyecto                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `getErrorMessage(error, defaultMessage)` | Recibe un error desconocido y verifica si es un error de Axios. Si el backend envía un mensaje, lo retorna; si no, retorna un mensaje por defecto. | Se utiliza en hooks, páginas o componentes para mostrar errores claros al usuario cuando una petición al backend falla. |

---

#### Utilidades del módulo PQR

Los archivos ubicados en `utils/pqrs/` contienen funciones específicas del módulo de PQR.

```txt
utils/pqrs/
└── pqrUtils.ts
```

---

##### `pqrUtils.ts`

Este archivo contiene funciones auxiliares relacionadas con la visualización de información del módulo de PQR.

```txt
getStatusColor()
getCaseTypeLabel()
```

| Función                      | Descripción                                                                                            | Uso dentro del proyecto                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getStatusColor(status)`     | Devuelve el color que debe mostrarse en un componente `Chip` de Material UI según el estado de la PQR. | Se utiliza para representar visualmente estados como `PENDIENTE`, `EN_PROCESO` o `CERRADA`.                                                                                 |
| `getCaseTypeLabel(caseType)` | Convierte el tipo de caso de una PQR en un texto más claro y legible para el usuario.                  | Se utiliza para mostrar tipos como `SAP`, `BEAS`, `Terminal`, `Correo`, `Intranet`, `Soporte Equipos`, `Soporte Red`, `Mi Portal SAP`, `LegalisApp` o `Nuevas Solicitudes`. |

Este archivo se ubica en `utils/pqrs/` porque contiene funciones específicas del módulo de PQR.

---

#### Utilidades del módulo de usuarios

Los archivos ubicados en `utils/users/` contienen funciones específicas del módulo de usuarios.

```txt
utils/users/
└── userRoleUtils.tsx
```

---

##### `userRoleUtils.tsx`

Este archivo contiene funciones auxiliares relacionadas con la visualización de los roles de usuario dentro del sistema.

```txt
getUserRoleColor()
getUserRoleIcon()
getUserRoleLabel()
```

| Función                  | Descripción                                                                                          | Uso dentro del proyecto                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `getUserRoleColor(role)` | Devuelve el color visual que debe tener un rol de usuario en componentes como `Chip` de Material UI. | Se utiliza para diferenciar visualmente roles como administrador, agente o usuario. |
| `getUserRoleIcon(role)`  | Retorna el ícono correspondiente según el rol del usuario.                                           | Se utiliza en componentes visuales donde se muestra el rol acompañado de un ícono. |
| `getUserRoleLabel(role)` | Convierte el rol técnico del sistema en un texto más claro para mostrar al usuario.                  | Se utiliza para mostrar etiquetas como `Administrador`, `Agente` o `Usuario`.      |

Este archivo conserva la extensión `.tsx` porque una de sus funciones retorna íconos de Material UI como componentes JSX.

---

### `src/validations/`

Esta carpeta contiene los esquemas de validación del proyecto, normalmente creados con Yup.

Las validaciones permiten controlar que los datos ingresados en los formularios cumplan con las reglas necesarias antes de ser enviados al backend. De esta manera, se evitan envíos incompletos, datos inválidos o errores que pueden prevenirse desde el frontend.

---

#### Estructura

```txt
validations/
│
├── auth/
│   └── authValidation.ts
│
└── pqrs/
    └── pqrValidation.ts
```

---

#### Validaciones del módulo de autenticación

```txt
validations/auth/
└── authValidation.ts
```

##### `authValidation.ts`

Este archivo contiene las reglas de validación relacionadas con los formularios de autenticación del sistema.

Se utiliza para validar los datos ingresados por el usuario antes de iniciar sesión o registrarse.

```txt
loginSchema()
registerSchema()
```

| Esquema            | Descripción                                                                                    | Uso dentro del proyecto         |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| `loginSchema()`    | Valida los datos necesarios para iniciar sesión, como correo y contraseña.                     | Se utiliza en `useLogin.ts`.    |
| `registerSchema()` | Valida los datos necesarios para registrar un nuevo usuario, como nombre, correo y contraseña. | Se utiliza en `useRegister.ts`. |

Este archivo permite mantener las reglas de autenticación centralizadas y evita repetir validaciones directamente en las páginas `Login.tsx` o `Register.tsx`.

---

#### Validaciones del módulo de PQR

```txt
validations/pqrs/
└── pqrValidation.ts
```

##### `pqrValidation.ts`

Este archivo contiene las reglas de validación relacionadas con el módulo de PQR.

Se utiliza principalmente para validar los datos del formulario de creación de una solicitud, antes de enviarla al backend.

```txt
createPqrSchema()
```

| Esquema             | Descripción                                                                            | Uso dentro del proyecto                             |
| ------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `createPqrSchema()` | Valida los datos necesarios para crear una nueva PQR, como tipo de caso y descripción. | Se utiliza en hooks y páginas relacionadas con PQR. |

Este archivo permite validar que la información ingresada por el usuario sea correcta antes de crear una solicitud PQR.

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

## 8. Conclusión

Esta estructura permite que el proyecto crezca de forma organizada, clara y profesional.  
Al separar páginas, componentes, servicios, hooks, datos, validaciones y utilidades, el código se vuelve más fácil de mantener, reutilizar y escalar.

Además, el enfoque de componentes reutilizables permite que elementos como tablas, encabezados, mensajes y estados vacíos puedan usarse en diferentes módulos sin repetir código.
