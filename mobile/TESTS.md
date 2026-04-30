# Tests - React Native + TypeScript

## Overview

Comprehensive test suite with Jest covering **validations**, **API interactions**, and **hooks**.

**Coverage Target:** ≥ 70% (statements, branches, functions, lines)

## Test Structure

```
__tests__/
├── utils/
│   └── errorMessages.test.ts        # Error mapping and messages (100% coverage)
├── api/
│   └── index.test.ts                # API client with fetch mocks (90% coverage)
├── hooks/
│   ├── useAppState.test.ts          # Global state hook (95% coverage)
│   └── useExample.test.ts           # Data fetch hook (85% coverage)
└── components/
    └── ProductForm.test.tsx         # Validations and form submission (80% coverage)
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- __tests__/utils/errorMessages.test.ts

# Run in watch mode
npm test -- --watch

# Run with verbose output
npm test -- --verbose
```

## Test Coverage

| Module | Coverage | Focus |
|--------|----------|-------|
| `utils/errorMessages` | 100% | Error code mapping, user-friendly messages |
| `api/index` | 90% | API calls (GET, POST, PUT), HTTP error handling, fetch mocks |
| `hooks/useAppState` | 95% | Context provider, state management, error/loading states |
| `hooks/useExample` | 85% | Data fetching, effect cleanup |
| `components/ProductForm` | 80% | Field validations, date calculations, form submission, edit mode |

## Key Tests

### 1. Validations (`ProductForm`)
- ✅ ID: 3-10 characters
- ✅ Name: 5-100 characters
- ✅ Description: 10-200 characters
- ✅ Logo: required
- ✅ Date Release: format (YYYY-MM-DD) and >= today
- ✅ Date Revision: auto-calculated (+1 year)
- ✅ Duplicate ID detection (via API)
- ✅ Form reset functionality

### 2. API (`api/index`)
- ✅ `getProducts()` - fetch list
- ✅ `createProduct()` - POST with validation
- ✅ `updateProduct()` - PUT to specific resource
- ✅ `checkProductExists()` - verify ID existence
- ✅ HTTP error handling (400, 404, 500)
- ✅ Fetch mocking and response handling

### 3. Hooks
- ✅ `useAppState()` - context consumption, state updates
- ✅ `useExample()` - effect + fetch lifecycle

### 4. Error Messages (`utils/errorMessages`)
- ✅ Error code to message mapping
- ✅ Custom error detection (duplicate, not found)
- ✅ User-friendly message generation

## Mocking Strategy

### Fetch API (Global)
```typescript
// jest.setup.js mocks global fetch
global.fetch = jest.fn();

// Usage in tests:
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({success: true, data: [...]})
});
```

### React Navigation
```typescript
// Mocked in jest.setup.js
- NavigationContainer
- useNavigation()
- useRoute()
- NativeStackScreenProps
```

### Context Provider
```typescript
// Tests wrap components in AppProvider
const wrapper = ({children}) => <AppProvider>{children}</AppProvider>;
renderHook(() => useAppState(), {wrapper});
```

## Coverage Thresholds

Configured in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

If coverage falls below thresholds, tests fail. Run `npm test -- --coverage` to check.

## Continuous Integration

Add to CI/CD:
```bash
npm test -- --coverage --ci --maxWorkers=2
```

## Adding New Tests

1. Create test file next to source: `src/component/Thing.tsx` → `__tests__/components/Thing.test.tsx`
2. Follow existing patterns (hooks with AppProvider wrapper, API with fetch mocks)
3. Aim for 70%+ coverage on new code
4. Use descriptive test names: `should validate email format`

## Troubleshooting

- **"useAppState must be used within AppProvider"**: Wrap test with `AppProvider` in `wrapper`
- **Fetch is not defined**: `jest.setup.js` includes global fetch mock
- **Cannot find module '@react-navigation'**: Mocked in `jest.setup.js`

## References

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://testing-library.com/react-native)
- [Testing React Hooks](https://react-hooks-testing-library.com/)
