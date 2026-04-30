# Transaction Management System

Product management system with Express backend and React Native mobile frontend.

## Overview

Full-stack application for managing products with CRUD operations, advanced search, and form validations. Includes comprehensive error handling, global state management, and Jest test suite with 70%+ coverage.

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript 5.4.2
- routing-controllers 0.10.4
- class-validator for DTOs

**Mobile Frontend:**
- React Native 0.71.8
- React 18.2.0
- TypeScript 5.4.2
- React Navigation 6.1.7
- React Context API for state

**Testing:**
- Jest 29.5.0
- React Native Testing Library
- ts-jest transformer

**Code Quality:**
- ESLint 8.44.0
- Prettier 3.0.0

## Prerequisites

- Node.js 18+ and npm 9+
- React Native CLI (for mobile development)
- Git

## Project Structure

```
.
├── src/                          # Backend (Express)
│   ├── main.ts                   # Server entry point (port 3002)
│   ├── controllers/
│   │   └── ProductControllers.ts # CRUD endpoints
│   ├── dto/
│   │   └── Product.ts            # Request/Response DTOs
│   ├── interfaces/
│   │   └── product.interface.ts  # Product type definition
│   ├── const/
│   │   └── message-error.const.ts# Error messages
│   └── middlewares/
│       └── ErrorHandler.ts       # Global error handler
│
├── mobile/                       # React Native Frontend
│   ├── src/
│   │   ├── App.tsx               # Root component
│   │   ├── screens/              # Navigation screens
│   │   │   ├── ProductListScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   ├── ProductCreateScreen.tsx
│   │   │   └── ProductEditScreen.tsx
│   │   ├── components/
│   │   │   ├── ProductForm.tsx        # Reusable form
│   │   │   ├── ProductCard.tsx        # List item
│   │   │   ├── ErrorOverlay.tsx       # Error modal
│   │   │   └── Field.tsx              # Form input
│   │   ├── context/
│   │   │   └── AppContext.tsx         # Global state (loading, errors)
│   │   ├── hooks/
│   │   │   └── useAppState.ts         # Context consumer
│   │   ├── api/
│   │   │   └── index.ts               # API client with error handling
│   │   ├── utils/
│   │   │   ├── errorMessages.ts       # Error code mapping
│   │   │   └── validation.ts          # Form validation functions
│   │   └── types/
│   │       └── index.ts               # Navigation & data types
│   ├── __tests__/                # Jest test suite (70%+ coverage)
│   ├── jest.config.js
│   ├── jest.setup.js
│   └── package.json
│
├── tsconfig.json
├── package.json
└── README.md
```

## Backend API

**Base URL:** `http://localhost:3002`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| GET | `/products/:id` | Get product by ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |
| GET | `/products/:id/verify` | Verify product exists |

**Response Format:**
```json
{
  "success": true,
  "data": { /* payload */ }
}
```

## Getting Started

### 1. Install Dependencies

```bash
# Backend dependencies
npm install

# Mobile dependencies
cd mobile
npm install
```

### 2. Start Backend

```bash
# From project root
npm start
```

Server runs on `http://localhost:3002`. Uses in-memory product storage.

### 3. Start Mobile Frontend

```bash
# From mobile directory
npm start

# For Android
npm run android

# For iOS
npm run ios
```

### 4. Run Tests

```bash
# From mobile directory
npm test

# With coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch
```

Coverage thresholds: **70%** (statements, branches, functions, lines)

## Form Validations

Product form enforces:
- **ID:** 3-10 characters, unique, verified via API
- **Name:** 5-100 characters
- **Description:** 10-200 characters
- **Logo:** Required (URL/path)
- **Release Date:** Valid date (YYYY-MM-DD), >= today
- **Revision Date:** Auto-calculated (+1 year from release date)

## Error Handling

Global error management via AppContext:
- Centralized error/loading state
- Field-level validation errors displayed inline
- User-friendly error messages
- HTTP error codes mapped to readable messages
- Network errors gracefully handled

## Key Features

✅ Product CRUD with validation  
✅ Advanced search with 400ms debounce  
✅ Product count updated with active filters  
✅ Create/Edit forms reusing ProductForm component  
✅ Global error overlay with field errors  
✅ Loading states for async operations  
✅ Jest test suite (70%+ coverage)  
✅ React Navigation with type-safe routing  
✅ No external UI libraries (React Native StyleSheet)