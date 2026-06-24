# Configuración del Proyecto Frontend Clonado

Esta guía explica cómo configurar y ejecutar el frontend localmente después de clonar el repositorio.

---

# 1. Clonar el repositorio

```bash
git clone + url
```

## Descripción

Este comando permite descargar el proyecto frontend desde el repositorio remoto hacia el equipo local.

---

# 2. Instalar dependencias

```bash
npm install
```

## Descripción

Este comando instalará automáticamente todas las dependencias definidas en el archivo:

```txt
package.json
```

Incluyendo, según la configuración del proyecto:

* React
* Vite
* TypeScript
* Axios
* React Router DOM
* ESLint
* Dependencias de estilos
* Tipados de TypeScript

---

# 3. Configurar variables de entorno

Crear un archivo en la raíz del proyecto frontend:

```txt
.env
```

Dentro del archivo `.env`, agregar las siguientes variables:

```env
VITE_API_URL=http://localhost:4000/api
VITE_BACKEND_URL=http://localhost:4000
```

## Descripción

Estas variables permiten conectar el frontend con el backend local.

La variable:

```env
VITE_API_URL=http://localhost:4000/api
```

se utiliza para realizar las peticiones hacia la API del backend.

La variable:

```env
VITE_BACKEND_URL=http://localhost:4000
```

se utiliza para acceder directamente a la dirección base del backend, por ejemplo, cuando se necesitan cargar archivos, imágenes o recursos públicos del servidor.

Es importante que el backend esté ejecutándose en el puerto:

```txt
4000
```

para que el frontend pueda conectarse correctamente.

---

# 4. Iniciar el frontend

## Comando

```bash
npm run dev
```

## Descripción

Este comando inicia el servidor de desarrollo del frontend.

Generalmente, Vite ejecuta el proyecto en una dirección similar a:

```txt
http://localhost:5173
```

---

# 5. Abrir el proyecto en el navegador

Después de ejecutar el comando anterior, la terminal mostrará una URL local.

Ejemplo:

```txt
http://localhost:5173
```

Se debe abrir esta dirección en el navegador para visualizar el frontend del sistema.

---

# Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js
* Git
* npm

---

# Scripts Disponibles

| Script          | Descripción                        |
| --------------- | ---------------------------------- |
| npm run dev     | Ejecuta el frontend en desarrollo  |
| npm run build   | Genera la versión de producción    |
| npm run preview | Previsualiza el proyecto compilado |
