# Audit Logs App

A full-stack audit log viewer built for the Mirage platform. It allows users to browse, filter, and export audit events with row-level security and compartmentalization based on user permissions.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Utility Scripts](#utility-scripts)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Backend: Server](#backend-server)
  - [API Endpoints](#api-endpoints)
  - [Filter System](#filter-system)
  - [Permissions & Compartmentalization](#permissions--compartmentalization)
  - [Running Tests](#running-tests)
  - [Database](#database)
- [Frontend: Client](#frontend-client)
  - [URL-Based Filters](#url-based-filters)
  - [Adding a New Filter](#adding-a-new-filter)
- [Docker](#docker)

---

## Architecture Overview

```
┌─────────────────────┐        ┌──────────────────────────────────┐
│   Frontend (React)  │  HTTP  │  Backend (Express + PostGraphile)│
│   localhost:8000    │◄──────►│  localhost:3001                  │
│   /audit/* base     │        │  /audit/* REST + /graphql GQL    │
└─────────────────────┘        └─────────────────┬────────────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │   PostgreSQL DB  │
                                         └─────────────────┘
```

- The **frontend** Vite dev server runs on port `8000` and proxies `/audit`, `/graphql`, and `/graphiql` requests to the backend (`PROXY_TARGET`).
- The **backend** Express server runs on port `3001` and exposes REST endpoints and a PostGraphile GraphQL endpoint.
- In **production** (Docker), the backend serves the built frontend static files and listens on port `8080`.

---
## Utility Scripts

| Script             | Description                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `zip_changes.py`   | Zips all files changed vs. `main` branch into `changes.zip`, preserving directory structure. Useful for handing off a patch set.    |
| `apply_changes.py` | Extracts and applies files from a `changes.zip` archive back to their correct paths. Safely skips replacing directories with files. |

```bash
python zip_changes.py    # creates changes.zip
python apply_changes.py  # applies changes.zip to the working tree
```
---

## Tech Stack

### Frontend

| Tool                 | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| Vite + React 18      | App framework & bundler                         |
| TypeScript           | Type safety                                     |
| shadcn-ui + Radix UI | Component library                               |
| Tailwind CSS         | Styling                                         |
| TanStack Query       | Server state / data fetching                    |
| React Router v6      | Routing                                         |
| react-virtuoso       | Virtualised list rendering for large event sets |
| Zod                  | Runtime schema validation                       |
| ExcelJS / file-saver | Export to Excel                                 |

### Backend

| Tool              | Purpose                                    |
| ----------------- | ------------------------------------------ |
| Express           | HTTP server                                |
| PostGraphile      | Auto-generated GraphQL API over PostgreSQL |
| `pg`              | PostgreSQL client                          |
| Zod               | Request validation                         |
| Jest + Supertest  | Unit & integration tests                   |
| Nodemon + ts-node | Dev server with hot-reload                 |

---

## Getting Started

Both the frontend and backend must be running simultaneously during development.

### 1. Install dependencies

```bash
# Root (frontend)
npm install

# Backend
cd server && npm install
```

### 2. Set up environment variables

Copy the example env files and fill in the values (see [Environment Variables](#environment-variables)):

```bash
# Root
cp .env.example .env   # or create .env manually

# Backend
cp server/.env.example server/.env
```

### 3. Start the dev servers

```bash
# In one terminal — backend (port 3001)
cd server && npm run dev

# In another terminal — frontend (port 8000)
npm run dev
```

Open **http://localhost:8000/audit/** in your browser.

> ⚠️ The frontend base path is `/audit/`. Navigating to `http://localhost:8000/` alone won't work.

---

## Environment Variables

### Root `.env` (frontend / Vite)

| Variable       | Default                 | Description                                   |
| -------------- | ----------------------- | --------------------------------------------- |
| `PROXY_TARGET` | `http://localhost:3001` | Backend URL that Vite proxies API requests to |

### `server/.env` (backend)

| Variable       | Default                                                  | Description                        |
| -------------- | -------------------------------------------------------- | ---------------------------------- |
| `PORT`         | `3001`                                                   | Port the Express server listens on |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/audit_logs` | PostgreSQL connection string       |

---

## Project Structure

```
audit-logs-app/
├── src/                        # Frontend source
│   ├── components/             # React UI components
│   ├── hooks/                  # Custom React hooks (filters, URL sync, etc.)
│   ├── pages/                  # Page-level components
│   ├── types/                  # Shared TypeScript types (audit.ts, etc.)
│   ├── lib/                    # API client, utilities
│   └── constants/              # Frontend constants
├── server/
│   ├── src/
│   │   ├── BLs/audit/          # Business logic: filtering, compartmentalization
│   │   ├── GQL/                # GraphQL query builders
│   │   ├── constants/          # permissions.ts — category permission definitions
│   │   ├── middleware/         # Express middleware (error handling, etc.)
│   │   ├── parsers/            # Response parsers for GraphQL results
│   │   ├── routes/             # Express route handlers
│   │   ├── types/              # Backend TypeScript types
│   │   ├── validators/         # Zod request validators
│   │   └── server.ts           # App entry point
│   └── database/
│       ├── schema.sql          # DB schema
│       ├── data.sql            # Seed data
│       └── manual_migration_delete_function.sql
├── .env                        # Frontend env (Vite proxy target)
├── Dockerfile                  # Multi-stage Docker build
├── URL_FILTERS.md              # URL filter parameter documentation
├── zip_changes.py              # Utility: zip git-modified files
└── apply_changes.py            # Utility: apply changes from a zip archive
```

---

## Backend: Server

### API Endpoints

#### `GET /audit/events`

Retrieve paginated, filtered audit events.

| Param           | Type     | Description                                                   |
| --------------- | -------- | ------------------------------------------------------------- |
| `page`          | number   | Page number (default: 1)                                      |
| `pageSize`      | number   | Items per page (default: 50, max: 200)                        |
| `from`          | ISO date | Start date filter                                             |
| `to`            | ISO date | End date filter                                               |
| `actorUsername` | string   | Partial match on actor username                               |
| `action`        | string   | Exact match on action type                                    |
| `search`        | string   | Full-text search across actor, target, action, resource       |
| `sort`          | string   | `created_at` \| `action` \| `actor_username` \| `target_name` |
| `order`         | string   | `asc` \| `desc`                                               |

**Response shape:**

```json
{ "page": 1, "pageSize": 10, "total": 150, "items": [...] }
```

#### `GET /audit/events/:id`

Retrieve a single audit event by ID.

#### `GET /health`

Health check — returns `{ "status": "ok" }`.

#### `GET /graphql` / `GET /graphiql`

PostGraphile GraphQL endpoint and interactive playground. Used by the filter BL internally.

---

### Filter System

The filter logic lives in `server/src/BLs/audit/`. Filters are applied at the GraphQL query level using a **handler pattern**:

- **`CategoryFilterHandler`** — one handler per `MirageObjectType` (USER, ENTITY, …). Each handler knows how to build the right GraphQL filter fragment for its category and how to parse the raw response.
- **`GlobalFilterHandler`** — handlers for filters that apply across all categories: `DateRange`, `Search`, `PremadeProfile`, `RLS`.

The main `filters.ts` orchestrator runs all relevant handlers concurrently with `Promise.all`, merges their outputs, and returns the final filtered event list.

---

### Permissions & Compartmentalization

Category-level permissions are defined in `server/src/constants/permissions.ts` as `CATEGORY_PERMISSIONS`.

To **add a new permitted category**:

1. Add the `MirageObjectType` key to `CATEGORY_PERMISSIONS`:

   ```typescript
   import { MirageObjectType } from "../types/mirage";

   export const CATEGORY_PERMISSIONS = {
     // ...existing entries
     [MirageObjectType.ENTITY]: { mandatPermission: ["read"] },
   };
   ```

2. Create a corresponding `CategoryFilterHandler` in `server/src/BLs/audit/`.

**Compartmentalization** (row-level security) is handled in `audit_compartmentalization.test.ts` / `audit.ts`. Users with only `read` (not `update`) permissions on `PARAMETER` resources have their visible events restricted to parameters they are explicitly granted access to, via `api.mirage_premade_profile_owners` and `api.mirage_premade_profile_digital_parameter_values`.

---

### Running Tests

```bash
cd server
npm test
```

Tests use **Jest** with **ts-jest**. Test files are co-located under `server/src/BLs/`:

- `audit.test.ts` — core audit BL unit tests
- `audit_compartmentalization.test.ts` — permission/RLS scenarios

---

### Database

SQL files live in `server/database/`:

| File                                   | Purpose                                    |
| -------------------------------------- | ------------------------------------------ |
| `schema.sql`                           | Table definitions — run once on a fresh DB |
| `data.sql`                             | Seed data for local development            |
| `manual_migration_delete_function.sql` | One-off migration script                   |

PostgreSQL must be running locally and accessible via the `DATABASE_URL` in `server/.env`.

---

## Frontend: Client

### URL-Based Filters

Filters are synced to the URL as query parameters, enabling deep-linking and bookmarks. Full documentation: [`URL_FILTERS.md`](./URL_FILTERS.md).

**Quick reference:**

| Param                 | Type            | Example                    |
| --------------------- | --------------- | -------------------------- |
| `category`            | comma-separated | `USER,ENTITY`              |
| `action`              | comma-separated | `MANDAT_USER_SYNCED`       |
| `search`              | string          | `jane`                     |
| `actorSearch`         | string          | `john.doe`                 |
| `premadeProfile`      | UUID            | `123e4567-...`             |
| `dateFrom` / `dateTo` | ISO 8601        | `2026-01-01T00:00:00.000Z` |

### Adding a New Filter

1. **Add the field** to the `AuditFilters` interface in `src/types/audit.ts`.
2. **Register it** in the `filterToUrlMap` in `src/hooks/useUrlFilters.ts`, and add it to `dateFields` or `arrayFields` sets as needed.
3. **Wire it up** on the backend by adding a query param handler in the relevant `CategoryFilterHandler` or creating a new `GlobalFilterHandler`.

---

## Docker

The `Dockerfile` uses a **multi-stage build**:

1. **Stage 1** — builds the React frontend (`npm run build` → `dist/`)
2. **Stage 2** — compiles the TypeScript backend (`tsc` → `server/dist/`)
3. **Stage 3** — runtime image serving the compiled backend on port `8080`

```bash
docker build -t audit-logs-app .
docker run -p 8080:8080 \
  -e DATABASE_URL=postgres://user:pass@host:5432/dbname \
  audit-logs-app
```

> In production the backend serves the built frontend bundle. `NODE_ENV=production` and `PORT=8080` are set automatically.

---
