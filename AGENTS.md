# AI Agent Guide for To-Do Management Frontend

A Vue 3 + TypeScript frontend for task management with full authentication, workspace/project management, time tracking, and advanced filtering.

## Project Setup

### Environment

- **Node.js**: 18+
- **Package Manager**: npm or yarn
- **Environment Variables**: Create `.env` with:
  ```
  VITE_API_BASE_URL=http://localhost:8000/api
  VITE_APP_NAME=ToDoManager
  ```

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## Architecture

### Stack

- **Vue 3** (Composition API) - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client (wrapped in ApiService)
- **Tailwind CSS** - Styling
- **Element Plus** - Component library
- **Lucide Vue Next** - Icons

### Directory Structure

```
src/
├── api/                 # API modules (endpoints, params, responses)
├── assets/              # Static files (CSS, images, JSON)
├── components/          # Reusable Vue components (Base/, Core/, Themes/)
├── constants/           # App constants (publicApi.ts for endpoint definitions)
├── core/                # Core services and utilities
│   ├── composables/     # Vue composables (useAuth, useCookies, useMenus, usePaginate)
│   ├── services/        # ApiService, JwtService, EventBus
│   ├── types/           # Type definitions (api.ts, prefix-api.ts)
│   └── utils/           # Helper functions (helper.ts, colors.ts, faker.ts)
├── main/                # Static menu definitions
├── pages/               # Page components organized by feature
│   ├── app/             # App routes (workspaces, projects, tasks)
│   ├── authentication/  # Login, register
│   ├── dashboard/       # Dashboard views
│   ├── errors/          # Error pages (404, 401, 403, 500)
│   └── profiles/        # User profiles
├── router/              # Vue Router config (routes.ts, index.ts)
├── stores/              # Pinia stores (auth.ts, theme.ts, menu.ts, etc.)
├── themes/              # Theme layouts (Enigma, Icewall, Rubick, Tinker)
└── types/               # TypeScript declarations
```

## Core Concepts

### API Service (`src/core/services/ApiService.ts`)

- Centralized Axios wrapper with interceptors
- Handles authentication token injection via `JwtService`
- Manages request/response lifecycle
- Supports request cancellation via `AbortController`
- Response format: `{ rc: string, message: string, timestamp: string, payload: T }`

**Usage:**
```typescript
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'

const response = await ApiService.get({
  resource: publicEndpoint.tasks.list,
  params: { page: 1, search: 'query' }
})
const tasks = response.payload
```

### Endpoints (`src/constants/publicApi.ts`)

All API endpoints centralized in a single object:
- `auth` - Login, register, logout, me
- `workspaces`, `projects`, `tasks`, `subtasks`, `tags` - CRUD operations
- `timeTracking` - Time log/estimate operations
- `dashboard` - Statistics and summary endpoints

Pattern: Endpoints with `:id` or `:param` are replaced at runtime with actual values.

### Authentication

**Auth Store** (`src/stores/auth.ts`):
- `isAuthenticated` - Boolean state
- `user` - Current user object
- `loadAuthFromStorage()` - Restore auth from localStorage + cookie
- `setAuth(response)` - Set auth after login (stores token in cookie via JwtService)
- `purgeAuth()` - Clear auth on logout
- `verifyAuth()` - Validate token with backend

**JwtService** (`src/core/services/JwtService.ts`):
- Token stored in secure, HttpOnly cookie (`session_token`)
- Auto-expiry handling (default 2 hours)
- Localhost detection to avoid Secure flag in development

**Router Guards** (`src/router/index.ts`):
- Public routes: `login`, `register` (marked with `meta.public = true`)
- Protected routes require valid auth token
- Unauthorized redirects to `/401`

### Composables

**Global Composables** (`src/core/composables/`):
- **useAuth** - Login/register logic with validation
- **useCookies** - Cookie management
- **useMenus** - Menu/sidebar state
- **usePaginate** - Pagination helpers

**Page Composables** (e.g., `src/pages/app/tasks/Tasks.ts`):
- Export composable functions containing all business logic, state, and helpers for a page
- Import in `.vue` template and destructure all returned items via `<script setup>`
- Example: `const { tasks, loading, submitTask, openCreateModal } = useTasks()`
- Keeps template logic-free and improves code reusability
- All API types are properly defined: `TaskStatus`, `TaskPriority`, `TaskFilters`, etc.
- Organized into logical sections: State, API Calls, Helpers, Modal Handlers, Pagination & Filters, Watchers & Lifecycle

**Page Composables Structure**:
- Each page has a `.ts` file with `usePageName()` composable
- Type-safe interfaces for data models and forms
- Debounced filter handlers using `lodash/debounce`
- Watchers for filter changes with proper cleanup in `onBeforeUnmount`
- Modal state management (show/hide, editing, form reset)
- CRUD operations through ApiService

**Important Pattern for Pages**:
- Create `PageName.ts` composable with all logic
- Create `PageName.vue` template that imports from composable
- Composables must watch `route.path` if they load data based on route params (to re-fetch on navigation)
- Always add `@click` handlers that call composable methods rather than defining logic in template
- Use `:key="$route.fullPath"` on top-level layout component to force component re-mount on route change (already set in `Layout.vue`)

### State Management (Pinia Stores)

- `auth` - Authentication state
- `theme` - Current theme (Enigma, Icewall, Rubick, Tinker)
- `menu` - Menu/sidebar state
- `color-scheme` - Color scheme (light/dark)
- `dark-mode` - Dark mode toggle
- `workspace` - Global workspace selector and switcher (`src/stores/workspaceStore.ts`)
  - `setWorkspaces(items)` - Populate workspace list
  - `switchWorkspace(workspaceId)` - Change active workspace (persists to localStorage)
  - `currentWorkspace` - Currently selected workspace
  - `hasWorkspaces` - Computed property to check if workspaces exist
  - `workspaceById(id)` - Find workspace by ID

**Store vs Composable Pattern**:
- **Stores** (Pinia): Global app state, authentication, theme, workspace switching
- **Page Composables**: Page-level state, forms, modals, pagination, API calls
- Stores can be accessed from anywhere; composables are page-local for better encapsulation

### Response Handling

**Success responses** follow format:
```typescript
interface ApiResponse<T> {
  rc: 'SUCCESS'
  message: string
  timestamp: string
  payload: T
}
```

**Error responses**:
- `rc: 'ERR_VALIDATION'` - Validation errors in `payload` object
- `rc: 'ERR_*'` - Other error codes with message in `message` field
- Network errors handled by interceptors → redirect to `/500`
- Unauthorized (401) → redirect to `/401`, clear auth

### UI Components

**Base Components** (`src/components/Base/`):
- Form components, buttons, tables, modals, pagination
- Headless UI wrappers for accessibility
- Tailwind-styled, fully responsive

**Core Components** (`src/components/Core/`):
- Commonly used layouts: Alert, Button, Card, Header, Modal, Spinner, State, Stats

**Themes** (`src/components/Themes/`):
- Layout wrappers: Enigma, Icewall, Rubick, Tinker
- Theme switching via store
- Each theme has TopMenu, SideMenu, SimpleMenu layouts
- Currently only `Rubick` + `TopMenu` is enabled (see `src/stores/theme.ts`)
- Menu data fetched in `onMounted` hook via `menuStore.fetchMenus()`
- Top menu navigation items rendered from `formattedMenu` computed value (derived from `menuStore.menuValue`)
- Menu structure defined in `src/main/top-menu.ts` (menu icons, titles, routes)

### Routing Pattern

Routes defined in `src/router/routes.ts`. Page components auto-matched to routes.

**Meta fields for routes**:
- `pageTitle` - Browser tab title
- `public` - Mark as public route (no auth required)
- `errorCode`, `errorMessage` - For error pages

## Common Tasks

### Adding a New API Endpoint

1. Add to `src/constants/publicApi.ts`:
   ```typescript
   newFeature: {
     list: `${BASE_URL}/app/new-feature`,
     create: `${BASE_URL}/app/new-feature/create`,
   }
   ```

2. Create type definitions in `src/api/newFeature/`:
   - `newFeatureApi.ts` - API call methods
   - `newFeatureApiParams.ts` - Request parameter types
   - `newFeatureApiResponse.ts` - Response types

3. Use in components:
   ```typescript
   const response = await ApiService.get({
     resource: publicEndpoint.newFeature.list
   })
   ```

### Creating a New Page

1. Create Vue file in `src/pages/app/NewFeature.vue`
2. Add route in `src/router/routes.ts`
3. Use composables/ApiService for data fetching
4. Reference in layout: `src/themes/Layout.vue`

### Adding Store State

1. Create store in `src/stores/newFeature.ts`:
   ```typescript
   import { defineStore } from 'pinia'
   import { ref } from 'vue'

   export const useNewFeatureStore = defineStore('newFeature', () => {
     const items = ref([])
     const fetchItems = async () => { /* ... */ }
     return { items, fetchItems }
   })
   ```

2. Use in components:
   ```typescript
   import { useNewFeatureStore } from '@/stores/newFeature'
   const store = useNewFeatureStore()
   ```

### Handling Validation Errors

ApiService passes through validation errors with `rc: 'ERR_VALIDATION'`:

```typescript
try {
  await authApi.login(credentials)
} catch (err: any) {
  if (err.response?.data?.rc === 'ERR_VALIDATION') {
    const errors = err.response.data.payload // { field: [error1, error2] }
    // Use in form validation UI
  }
}
```

### Using Pagination

```typescript
const response = await ApiService.get({
  resource: publicEndpoint.tasks.list,
  params: { page: 1, paginated: true, perpage: 20 }
})
const { data, current_page, total, last_page } = response.payload
```

## Code Conventions

### TypeScript

- **Always type function parameters and returns**
- **Use interfaces for API contracts** (defined in `src/api/*/` modules)
- **Avoid `any` type** unless necessary
- **Use Union types** for response codes: `'SUCCESS' | 'ERR_VALIDATION' | 'ERR_*'`

### Vue Components

- **Use Composition API** with TypeScript
- **Define reactive state with `ref()` or `reactive()`**
- **Compose logic in separate composables** when shared across components
- **Template: keep logic minimal**, move to `<script setup>`
- **Event naming: use `@emit()`**, avoid direct method calls to parent

### File Naming

- **Components**: PascalCase (e.g., `TaskCard.vue`)
- **Pages**: PascalCase (e.g., `TaskList.vue`)
- **Stores**: kebab-case (e.g., `task-filter.ts`)
- **Composables**: camelCase with `use` prefix (e.g., `usePaginate.ts`)

### API Call Pattern

All API calls go through ApiService. Never use Axios directly.

```typescript
// ✓ Correct
const response = await ApiService.post({
  resource: publicEndpoint.tasks.create,
  body: { title: 'New Task' }
})

// ✗ Avoid
axios.post('/api/app/tasks/create', { title: 'New Task' })
```

## Debugging

### Browser DevTools

- **Vue DevTools**: Inspect components, store state, router
- **Network tab**: Check API requests/responses
- **Console**: Check ApiService logs, errors

### Common Issues

- **401 Unauthorized**: Token expired or invalid. Check `JwtService.getToken()`, verify backend.
- **CORS errors**: Check `VITE_API_BASE_URL` matches backend, ensure backend allows origin.
- **Validation errors**: Check `err.response?.data?.payload` for field-level errors.
- **Component not rendering**: Ensure route exists in `src/router/routes.ts`.
- **Route change doesn't update display** (need manual refresh): The issue is that page components created from `useComposable()` composables don't watch route changes. **Fix**: Add watchers in composables for `route.path` or destructure route reactively via `const route = useRoute()` and watch it. Components using composables should already have `:key="$route.fullPath"` on Layout.vue (it's set in `src/themes/Layout.vue`), but verify composables re-fetch data on route changes.
- **Menu not showing in top bar/header**: If `formattedMenu` is empty at first render, ensure `menuStore.fetchMenus()` completes before rendering. The TopMenu waits for `onMounted` to fetch, but if menus aren't loading, check: (1) `menuStore.isLoading` indicator, (2) verify API endpoint exists, (3) check browser Network tab for menu API request failures. Also verify menu data structure matches expected format in `top-menu.ts`.
- **TS2769 debounce with watch**: Vue's `WatchOptions` doesn't accept `debounce` directly. **Fix**: Use `debounce()` function outside watch callback and manually call it in watcher. Pattern: `const debouncedFn = debounce(() => { ... }, 500); watch(deps, debouncedFn)`. See `src/pages/app/tasks/Tasks.ts` for correct usage. Avoid using lodash debounce as watch option; it's for the callback only.

### TypeScript Errors

Run type checking:
```bash
npm run type-check
```

## Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output in `dist/` folder. Deploy as static site (Vercel, Netlify, etc.).

### Docker

```bash
npm run dev-docker
```

Runs Vite with `--host 0.0.0.0` for Docker container access.

## Dependencies

Key external libraries:
- **axios** - HTTP client
- **pinia** - State management
- **vue-router** - Routing
- **element-plus** - UI components
- **lucide-vue-next** - Icons
- **tailwindcss** - CSS framework
- **@fullcalendar/vue3** - Calendar widget
- **chart.js** - Charts
- **tom-select** - Select dropdown
- **@ckeditor/ckeditor5-build-classic** - Rich text editor

See `package.json` for full list with versions.

## Performance Tips

- Use `Ctrl+Shift+P` → "Vue: Open in Browser DevTools" for component profiling
- Check Network tab for unnecessary API calls
- Use `AbortController` in ApiService to cancel redundant requests
- Leverage Vite's code splitting for large routes (async imports)
- Consider virtual scrolling for long lists (>1000 items)

## Resources

- [Vue 3 Docs](https://vuejs.org)
- [Pinia Docs](https://pinia.vuejs.org)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Element Plus Docs](https://element-plus.org)

