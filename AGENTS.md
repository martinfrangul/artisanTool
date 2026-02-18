# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A React + Firebase inventory and sales management PWA (Progressive Web App) for artisan businesses. Users can manage product inventory, record sales, track expenses, and view analytics.

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run lint     # ESLint with react/hooks plugins
npm run preview  # Preview production build
```

## Architecture

### Context-Based State Management

The app uses React Context instead of Redux. Two contexts wrap the entire app in `App.jsx`:

- **AuthContext** (`src/context/AuthContext.jsx`): Handles Firebase Google authentication, user state, and admin flag. Provides `googleLogIn`, `logOut`, `user`, and `loading`.
- **DataContext** (`src/context/DataContext.jsx`): Manages inventory and sales data from Firestore. Provides `inventoryData`, `sellData`, `reloadData()`, and `propertyLabels` for translating field names to Spanish.

Access contexts via the `useAuth` hook or `useContext(DataContext)`.

### Firebase Data Model

User data is stored in Firestore under per-user collections:
- `users/{uid}/products` - Inventory items
- `users/{uid}/sales` - Sales records
- `users/{uid}` document - User metadata including `admin` boolean

Firebase config is in `firebase/firebaseConfig.js` and reads from `.env` variables prefixed with `VITE_FIREBASE_*`.

### Routing Structure

- **Public routes** (`/login`, `/register`): Wrapped in `PublicRoutes.jsx` - redirects authenticated users away
- **Protected routes** (`/*`): Wrapped in `ProtectedRoutes.jsx` - requires authentication
- **Admin routes** (`/admin-tools`): Additional `AdminRoute.jsx` wrapper checks `user.admin` flag

The `Layout.jsx` component provides the shell (Banner + Navbar) for all authenticated pages using React Router's `<Outlet />`.

### Component Organization

```
src/components/
├── Inventory/     # Product CRUD (CreateInventory, Inventory, EditProduct, PropertyInput)
├── Sales/         # Sales recording and history (SalesManager, SalesRegistry, SalesCharts)
├── Expenses/      # Expense tracking (Expenses, ShopList)
├── admin/         # Admin-only tools (AdminTools, BackupRestoreTool, AddFieldToSales)
```

### Styling

- Tailwind CSS with custom theme colors defined in `tailwind.config.js` (success, danger, primary, banner, navbar, marron, khaki, logo)
- DaisyUI component library for UI primitives
- Custom DatePicker component wraps `react-datepicker`

### Key Dependencies

- `@tanstack/react-table` for data tables
- `chart.js` + `react-chartjs-2` for analytics charts
- `framer-motion` for animations
- `date-fns` for date manipulation
- `react-select` for enhanced select inputs

## Language

The application UI and code comments are primarily in Spanish.
