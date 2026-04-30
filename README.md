# Transaction Frontend Challenge

Implementación del ejercicio técnico (2024) con backend en Node.js/TypeScript y frontend web en React + Vite.

## Contexto actual

El repositorio contiene:

- `src/`: backend API local (puerto `3002`)
- `web/`: frontend web funcional (alineado al flujo F1-F6)
- `mobile/`: base de app móvil (pendiente de actualización)

## Stack

### Backend

- Node.js
- Express + `routing-controllers`
- TypeScript
- `class-validator`

### Frontend Web

- React 18
- TypeScript
- Vite

## Estructura del proyecto

```bash
.
├── src/                    # Backend API
│   ├── main.ts             # Inicialización servidor (port 3002)
│   ├── controllers/
│   ├── dto/
│   ├── interfaces/
│   ├── middlewares/
│   └── const/
├── web/                    # Frontend web (actual)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── mobile/                 # Frontend React Native (próximamente)
├── package.json            # Scripts backend
└── README.md
```

## API Backend

Base URL:

`http://localhost:3002`

Endpoints:

- `GET /bp/products`
- `GET /bp/products/:id`
- `POST /bp/products`
- `PUT /bp/products/:id`
- `DELETE /bp/products/:id`
- `GET /bp/products/verification/:id` (retorna `true | false`)

## Cómo ejecutarlo

### 1) Backend

Desde la raíz del proyecto:

```bash
npm install
npm run start:dev
```

Servidor disponible en:

`http://localhost:3002`

> Nota: el backend usa almacenamiento en memoria (se reinicia al apagar el servidor).

### 2) Web

En otra terminal:

```bash
cd web
npm install
npm run dev
```

Aplicación web disponible en:

`http://localhost:5173`

### 3) Mobile (próximamente)

La carpeta `mobile/` se mantiene como base inicial, pero su documentación de ejecución se publicará cuando se complete la integración final con el backend actualizado.

## Estado funcional

### Web

- F1: listado de productos
- F2: búsqueda de productos
- F3: contador de registros
- F4: creación de producto con validaciones
- F5: edición de producto con ID bloqueado
- F6: eliminación con modal de confirmación

### Validaciones implementadas

- `id`: requerido, 3-10 caracteres, único (validación por endpoint)
- `name`: requerido, 5-100 caracteres
- `description`: requerido, 10-200 caracteres
- `logo`: requerido
- `date_release`: fecha válida y mayor o igual a hoy
- `date_revision`: exactamente un año después de `date_release`