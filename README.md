# To-Do Management Frontend

Frontend aplikasi To-Do Management (inspirasi ClickUp) dibangun dengan **Vue 3**, **Vite**, **Pinia**, **Vue Router**, **Tailwind CSS**, dan **Axios**.

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

## Cara instalasi

README ini menjelaskan dua cara menjalankan aplikasi frontend: menggunakan Docker (direkomendasikan untuk konsistensi) dan tanpa Docker (lokal dengan Node).

Catatan: proyek ini mengharapkan backend API (Laravel) berjalan terpisah. Pastikan `VITE_API_BASE_URL` mengarah ke alamat backend Anda.

Persyaratan umum (untuk cara tanpa Docker):
- Node.js 18+ dan npm atau yarn

1) Menggunakan Docker (cepat & konsisten)

- Proyek sudah menyertakan `docker-compose.yml` di root. Docker akan membangun image frontend dan menyajikannya.
- Langkah:

```bash
# Pastikan Docker & docker-compose terinstal
docker compose build
docker compose up -d
```

- Setelah container berjalan, frontend biasanya tersedia di http://localhost:5173 (atau port yang didefinisikan di `docker-compose.yml`).
- Jika perlu mengubah base API dari frontend, set environment di file `.env` yang dipakai oleh docker-compose atau atur variabel `VITE_API_BASE_URL` pada service di `docker-compose.yml`.

2) Tanpa Docker (lokal dengan Node)

- Pastikan Node.js >=18 terpasang.
- Buat file `.env` di root proyek (jika belum ada) dan set variabel lingkungan minimal:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=ToDoManager
```

- Install dependensi dan jalankan server development:

```bash
# menggunakan npm
npm install
npm run dev

# atau menggunakan yarn
yarn install
yarn dev
```

- Akses aplikasi di http://localhost:5173 (default Vite). Jika backend berada di host/port berbeda, sesuaikan `VITE_API_BASE_URL`.

3) Build produksi

```bash
npm run build
# hasil build akan berada di folder `dist`
```

Untuk menjalankan build produksi secara lokal (static), Anda bisa menggunakan paket seperti `serve`:

```bash
npm install -g serve
serve -s dist -l 5173
```

## Integrasi API

Semua panggilan API dikelola melalui `ApiService` (`src/core/services/ApiService.ts`). Endpoint terpusat di `src/constants/publicApi.ts`. Autentikasi (jika digunakan) memakai token yang disimpan di cookie melalui `JwtService`.

Contoh penggunaan di komponen:

```ts
import ApiService from '@/core/services/ApiService'
import publicEndpoint from '@/constants/publicApi'

const response = await ApiService.get({ resource: publicEndpoint.dashboard.overallSummary })
const data = response.payload
```

Jika Anda mengubah struktur endpoint, perbarui `src/constants/publicApi.ts` sehingga frontend menggunakan path yang benar.

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

Pastikan backend (Laravel) menyediakan endpoint yang sesuai. Contoh endpoint yang biasanya digunakan oleh frontend ini:

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

Selain itu dibutuhkan CRUD untuk workspaces, projects, tasks, subtasks, tags, dan time tracking. Endpoint yang sebenarnya dipakai disimpan di `src/constants/publicApi.ts` — sesuaikan backend Anda dengan file tersebut.

## Customization

- Tailwind – Configuration in `tailwind.config.js`.
- Theme – The template includes multiple themes (Rubick, Icewall, etc.); active theme and layout can be adjusted in `stores/theme.ts`.
- Colors – Modify `tailwind.config.js` or use CSS variables.

## License

This project is proprietary and confidential. (Adjust as needed.)

## Support

Jika menemukan masalah terkait frontend, buka issue di repository dan sertakan log console serta isi `src/constants/publicApi.ts` bila terkait integrasi API.
