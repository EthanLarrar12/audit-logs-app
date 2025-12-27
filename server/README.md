# Audit Logs Backend API

Node.js + Express backend for the Audit Logs application.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### GET /audit/events

Retrieve paginated and filtered audit events.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 50, max: 200) - Items per page
- `from` (ISO date string) - Start date filter
- `to` (ISO date string) - End date filter
- `actorUsername` (string) - Filter by actor username (partial match)
- `targetName` (string) - Filter by target name (partial match)
- `action` (string) - Filter by action (exact match)
- `resourceType` (string) - Filter by resource type (exact match)
- `outcome` (string: success|failure) - Filter by outcome
- `search` (string) - Full-text search across actor, target, action, resource
- `sort` (string: created_at|action|actor_username|target_name, default: created_at)
- `order` (string: asc|desc, default: desc)

**Response:**
```json
{
  "page": 1,
  "pageSize": 10,
  "total": 15,
  "items": [...]
}
```

**Example:**
```bash
curl "http://localhost:3001/audit/events?page=1&pageSize=10&outcome=success"
```

### GET /audit/events/:id

Get a single audit event by ID.

**Response:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-12-26T10:15:32.000Z",
  ...
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Audit Logs API is running"
}
```

## Development

The server uses:
- **Express** for the web framework
- **TypeScript** for type safety
- **CORS** enabled for frontend requests
- **Nodemon** for auto-reload during development

Mock data is stored in `src/data/mockData.ts` and contains 15 sample audit events for testing pagination and filtering.

## Frontend Integration

The frontend at `http://localhost:5173` is configured to connect to this backend automatically. Make sure both servers are running:

1. Backend: `cd server && npm run dev` (port 3001)
2. Frontend: `npm run dev` (port 5173)
