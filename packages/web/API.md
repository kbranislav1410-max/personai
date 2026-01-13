# PersonAI API Documentation

This Next.js application provides RESTful API endpoints for managing positions and analysis runs using TypeScript, Prisma, and Zod validation.

## Setup

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
cd packages/web
npm install
```

### Database Setup

```bash
# Generate Prisma client
npm run postinstall

# Run migrations (from project root)
cd ../..
npx prisma migrate dev --schema=./prisma/schema.prisma
```

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

All responses follow a consistent structure:

```typescript
{
  ok: boolean;
  data?: any;    // Present on success
  error?: string; // Present on failure
}
```

### Positions

#### GET `/api/positions`
Retrieve all positions from the database.

**Response:**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "seniority": "Senior",
      "description": "Looking for an experienced engineer",
      "mustHave": "5+ years of TypeScript",
      "niceToHave": "Experience with Next.js",
      "createdAt": "2026-01-13T19:44:48.184Z"
    }
  ]
}
```

#### POST `/api/positions`
Create a new position.

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "seniority": "Senior",
  "description": "Optional description",
  "mustHave": "5+ years of experience",
  "niceToHave": "Experience with Next.js"
}
```

**Validation:**
- `title`: Required, non-empty string
- `department`: Required, non-empty string
- `seniority`: Required, non-empty string
- `description`: Optional string
- `mustHave`: Required, non-empty string
- `niceToHave`: Required, non-empty string

**Response:** `201 Created`
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "title": "Senior Software Engineer",
    ...
  }
}
```

#### GET `/api/positions/[id]`
Retrieve a single position by ID.

**Response:** `200 OK` or `404 Not Found`

#### PUT `/api/positions/[id]`
Update a position by ID.

**Request Body:**
```json
{
  "title": "Lead Software Engineer",
  "seniority": "Lead"
}
```

**Validation:**
- At least one field must be provided
- All fields are optional but must be non-empty if provided

**Response:** `200 OK` or `404 Not Found`

#### DELETE `/api/positions/[id]`
Delete a position by ID.

**Response:** `200 OK` or `404 Not Found`

**Note:** Will fail with `500 Internal Server Error` if the position has related analysis runs due to foreign key constraints.

### Analysis Runs

#### POST `/api/analysis-runs`
Create a new analysis run for a position.

**Request Body:**
```json
{
  "positionId": 1,
  "customRequirements": "Must have experience with microservices"
}
```

**Validation:**
- `positionId`: Required, positive integer
- `customRequirements`: Required, non-empty string

**Response:** `201 Created` or `404 Not Found` (if position doesn't exist)
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "positionId": 1,
    "customRequirements": "Must have experience with microservices",
    "status": "queued",
    "createdAt": "2026-01-13T19:45:15.950Z"
  }
}
```

#### GET `/api/analysis-runs/[id]`
Retrieve an analysis run with its associated position and candidate scores.

**Response:** `200 OK` or `404 Not Found`
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "positionId": 1,
    "customRequirements": "Must have experience with microservices",
    "status": "queued",
    "createdAt": "2026-01-13T19:45:15.950Z",
    "Position": {
      "id": 1,
      "title": "Senior Software Engineer",
      ...
    },
    "CandidateScore": []
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful GET, PUT, or DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error or invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error (e.g., database constraint violation)

## Technology Stack

- **Next.js 16.1.1**: React framework with App Router
- **TypeScript 5**: Type-safe development
- **Prisma 5.22.0**: Database ORM
- **Zod 3.x**: Runtime type validation
- **SQLite**: Database (configured via Prisma)

## Project Structure

```
packages/web/
├── app/
│   ├── api/
│   │   ├── positions/
│   │   │   ├── route.ts          # GET/POST /api/positions
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/PUT/DELETE /api/positions/[id]
│   │   └── analysis-runs/
│   │       ├── route.ts          # POST /api/analysis-runs
│   │       └── [id]/
│   │           └── route.ts      # GET /api/analysis-runs/[id]
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── api-response.ts           # Response utilities
│   └── validation.ts             # Zod schemas
└── package.json
```

## Testing

Manual testing can be done using curl or any HTTP client:

```bash
# Create a position
curl -X POST http://localhost:3000/api/positions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "department": "Engineering",
    "seniority": "Mid",
    "mustHave": "3+ years experience",
    "niceToHave": "Python knowledge"
  }'

# Get all positions
curl http://localhost:3000/api/positions

# Create an analysis run
curl -X POST http://localhost:3000/api/analysis-runs \
  -H "Content-Type: application/json" \
  -d '{
    "positionId": 1,
    "customRequirements": "Experience with cloud platforms"
  }'
```
