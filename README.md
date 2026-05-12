# To-Do Management Frontend

Frontend application for To-Do Management (ClickUp-like) built with **Vue 3**, **Vite**, **Pinia**, **Vue Router**, **Tailwind CSS**, and **Axios**.

## Features

- **Authentication** – Login, register, logout with Laravel Sanctum (Bearer token stored in cookie).
- **Dashboard** – Overview statistics, task status & priority distribution, upcoming/overdue/recent tasks, tasks assigned to me.
- **Workspace Management** – CRUD workspaces, add/remove members.
- **Project Management** – CRUD projects per workspace, visibility settings.
- **Task Management** – Full CRUD with statuses, priorities, assignees, tags, subtasks, time tracking.
- **Tag Management** – Manage tags per workspace, attach to tasks.
- **Time Tracking** – Log time entries, view logs, totals, and estimates.
- **Advanced Filtering** – Search, filter by status/priority/assignee/tags, sort, pagination.
- **Responsive UI** – Fully responsive design using Tailwind CSS.

## Tech Stack

- **Vue 3** – Composition API
- **Vite** – Build tool & HMR
- **Pinia** – State management
- **Vue Router** – Client-side routing
- **Axios** – HTTP client (custom ApiService wrapper)
- **Tailwind CSS** – Utility-first CSS framework
- **Lucide Vue Next** – Icon library
- **TypeScript** – Type safety (optional, but recommended)

## Project Setup

### Prerequisites

- Node.js 18+ and yarn or npm
- Backend Laravel API running (see backend README)

### Environment Variables

Create a `.env` file in the project root (or use existing) and set:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=ToDoManager
```

Adjust the URL to match your backend (for example `http://localhost:8000` or a Docker-mapped port).

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Development Server

```bash
yarn dev
# or
npm run dev
```

The app will be available at http://localhost:5173 by default when using Vite.

### Build for Production

```bash
yarn build
# or
npm run build
```

The production build output will be in the `dist` folder.

## API Integration

All API calls are managed through `ApiService` (`src/core/services/ApiService.ts`). Endpoints are centralized in `src/constants/publicApi.ts`. Authentication uses a token stored in a secure cookie via `JwtService`.

Example usage in a component:

```ts
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'

const response = await ApiService.get({ resource: publicEndpoint.dashboard.overallSummary })
const data = response.payload
```

## Project Structure

src/
  ├── api/                  # API modules and types
  ├── assets/               # Static assets
  ├── components/           # Reusable Vue components
  ├── composables/          # Composition API hooks
  ├── constants/            # App constants (routes, endpoints)
  ├── core/                 # Core services (ApiService, JwtService, EventBus)
  ├── layouts/              # Layout components
  ├── main/                 # Static menu definitions
  ├── pages/                # Page components (views)
  ├── router/               # Vue Router configuration
  ├── stores/               # Pinia stores
  ├── themes/               # Theme components
  ├── types/                # TypeScript type definitions
  ├── utils/                # Helper functions
  ├── App.vue
  ├── main.ts
  └── env.d.ts

## Required Backend Endpoints

Make sure the Laravel backend provides the following endpoints (typical implementations):

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
GET  /api/dashboard/overall-summary
GET  /api/dashboard/stats
GET  /api/dashboard/upcoming-tasks
GET  /api/dashboard/overdue-tasks
GET  /api/dashboard/recent-tasks
GET  /api/dashboard/my-tasks
```

Plus CRUD endpoints for workspaces, projects, tasks, subtasks, tags, and time tracking.

## Customization

- Tailwind – Configuration in `tailwind.config.js`.
- Theme – The template includes multiple themes (Rubick, Icewall, etc.); active theme and layout can be adjusted in `stores/theme.ts`.
- Colors – Modify `tailwind.config.js` or use CSS variables.

## License

This project is proprietary and confidential. (Adjust as needed.)

## Support

For issues related to the frontend, please create an issue in the repository.
