# Historial de Incidentes Frontend

---
# Incidente #001 — Error por uso duplicado de BrowserRouter

## Fecha

2026-05-11

---

## Descripción del incidente

Durante la configuración de rutas en el frontend se presentó un problema donde las vistas no se renderizaban correctamente al utilizar `BrowserRouter`.

Después de revisar la estructura del proyecto, se identificó que el problema estaba relacionado con el uso duplicado de `BrowserRouter`.

---

## Error presentado

### Problema observado

```txt
Las vistas no se renderizaban correctamente al navegar entre rutas.
```

---

## Causa identificada

`BrowserRouter` estaba siendo utilizado más de una vez dentro de la aplicación.

React Router solo permite una única instancia de `BrowserRouter` envolviendo toda la aplicación.

El problema ocurría porque estaba declarado en varios archivos al mismo tiempo.

---

# Solución aplicada

## Estructura corregida

Se dejó `BrowserRouter` únicamente en el archivo principal:

```txt
src/main.tsx
```

---

## Regla definida

```txt
BrowserRouter solo debe ir en main.tsx
```

---

## Archivos donde NO debe repetirse

```txt
App.tsx
AppRoutes.tsx
Otros componentes
```

---

## Validación realizada

Después de eliminar las instancias duplicadas de `BrowserRouter`, las rutas comenzaron a renderizarse correctamente.

La navegación volvió a funcionar de manera normal.

---