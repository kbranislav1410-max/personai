# PersonAI API Documentation

This Next.js application provides RESTful API endpoints for managing positions, analysis runs, and resume uploads using TypeScript, Prisma, and Zod validation.

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

#### POST `/api/analysis-runs/[id]/run`
Execute an analysis run using the MVP scoring engine. Processes all resumes with extracted text, scores them against the position requirements, and stores candidate scores.

**Request Body (Optional):**
```json
{
  "weights": {
    "mustHave": 70,
    "niceToHave": 20,
    "custom": 10
  }
}
```

**Scoring Logic:**
- **Keyword Matching**: Extracts keywords from position requirements and matches against resume text
- **Weighted Scoring**: Combines must-have (default 70%), nice-to-have (20%), and custom (10%) requirements
- **Recommendation Thresholds**:
  - `yes` (Strong Match): Score >= 75
  - `maybe` (Good/Potential Match): Score 50-74
  - `no` (Weak Match): Score < 50
- **Name Extraction**: Automatically extracts candidate name from first lines of resume text (fallback to filename)

**Response:** `200 OK`, `400 Bad Request`, or `404 Not Found`
```json
{
  "ok": true,
  "data": {
    "message": "Analysis completed successfully. Processed 3 candidate(s).",
    "analysisRun": {
      "id": 1,
      "positionId": 1,
      "customRequirements": "Must have experience with microservices",
      "status": "done",
      "createdAt": "2026-01-13T20:45:15.950Z",
      "Position": {
        "id": 1,
        "title": "Senior Software Engineer",
        "department": "Engineering",
        "mustHave": "5+ years of TypeScript, React, Node.js",
        "niceToHave": "Experience with Next.js, Prisma"
      },
      "CandidateScore": [
        {
          "id": 1,
          "analysisRunId": 1,
          "candidateId": 1,
          "score": 85,
          "recommendation": "yes",
          "summary": "Strong candidate with excellent alignment to position requirements. Matches 4 of 5 must-have requirements and 2 of 2 nice-to-have skills. Demonstrates proficiency in typescript, react, node.js.",
          "strengths": "typescript, react, node.js, next.js, prisma",
          "gaps": "microservices",
          "Candidate": {
            "id": 1,
            "fullName": "John Doe",
            "email": "john@example.com"
          }
        }
      ]
    }
  }
}
```

**Notes:**
- Analysis run status updates: `queued` → `running` → `done` or `failed`
- If already completed (status: `done`), returns existing results without re-running
- Processes all resumes with `rawText` extracted (use `/api/resumes/[id]/extract-text` first)
- Creates/updates Candidate records with extracted names
- Returns results ordered by score (highest first)

### Resumes

#### POST `/api/resumes/upload`
Upload one or multiple resume files for a candidate.

**Content-Type:** `multipart/form-data`

**Request Body:**
- `candidateId`: Required, integer (form field)
- `files`: Required, one or multiple files (form field, can be repeated)

**Validation:**
- File types: Only `.pdf` and `.docx` allowed
- File size: Maximum 5MB per file
- MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Candidate must exist in the database

**Response:** `201 Created`, `400 Bad Request`, or `404 Not Found`
```json
{
  "ok": true,
  "data": {
    "message": "Successfully uploaded 2 file(s)",
    "resumes": [
      {
        "id": 1,
        "candidateId": 1,
        "fileName": "john-doe-resume.pdf",
        "fileType": "pdf",
        "fileUrl": "/uploads/john-doe-resume-1768334554433-abc123.pdf",
        "storagePath": "/path/to/uploads/john-doe-resume-1768334554433-abc123.pdf",
        "rawText": "",
        "createdAt": "2026-01-13T20:02:34.436Z"
      },
      {
        "id": 2,
        "candidateId": 1,
        "fileName": "cover-letter.docx",
        "fileType": "docx",
        "fileUrl": "/uploads/cover-letter-1768334554440-def456.docx",
        "storagePath": "/path/to/uploads/cover-letter-1768334554440-def456.docx",
        "rawText": "",
        "createdAt": "2026-01-13T20:02:34.442Z"
      }
    ]
  }
}
```

**Error Examples:**
```json
// File too large
{
  "ok": false,
  "error": "File large-resume.pdf exceeds maximum size of 5MB"
}

// Invalid file type
{
  "ok": false,
  "error": "File document.txt has invalid type. Only PDF and DOCX files are allowed"
}

// Candidate not found
{
  "ok": false,
  "error": "Candidate not found"
}
```

**Notes:**
- Files are saved to `/public/uploads` with unique filenames to prevent collisions
- Filename format: `{original-name}-{timestamp}-{random}.{extension}`
- The `rawText` field is initially empty and can be populated later using the `/api/resumes/[id]/extract-text` endpoint
- Multiple files can be uploaded in a single request

#### POST `/api/resumes/[id]/extract-text`
Extract text content from an uploaded resume file.

**Request:** POST request with resume ID in the URL path

**Response:** `200 OK`, `404 Not Found`, or `500 Internal Server Error`
```json
{
  "ok": true,
  "data": {
    "message": "Text extracted successfully",
    "resume": {
      "id": 1,
      "candidateId": 1,
      "fileName": "john-doe-resume.pdf",
      "fileType": "pdf",
      "fileUrl": "/uploads/john-doe-resume-1768334554433-abc123.pdf",
      "storagePath": "/path/to/uploads/john-doe-resume-1768334554433-abc123.pdf",
      "rawText": "JOHN DOE\nEmail: john@example.com\n\nEXPERIENCE\nSenior Developer...",
      "createdAt": "2026-01-13T20:02:34.436Z"
    }
  }
}
```

**Error Examples:**
```json
// Resume not found
{
  "ok": false,
  "error": "Resume not found"
}

// Text extraction failed
{
  "ok": false,
  "error": "Failed to extract text from PDF file: Invalid PDF format"
}

// Invalid resume ID
{
  "ok": false,
  "error": "Invalid resume ID"
}
```

**Notes:**
- Uses `pdf-parse` for PDF text extraction
- Uses `mammoth` for DOCX text extraction
- Extracts and stores text in the `rawText` field of the Resume record
- If text has already been extracted, returns the existing resume without re-processing
- Handles extraction errors gracefully with detailed error messages

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
│   │   ├── analysis-runs/
│   │   │   ├── route.ts          # POST /api/analysis-runs
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET /api/analysis-runs/[id]
│   │   └── resumes/
│   │       ├── upload/
│   │       │   └── route.ts      # POST /api/resumes/upload
│   │       └── [id]/
│   │           └── extract-text/
│   │               └── route.ts  # POST /api/resumes/[id]/extract-text
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── api-response.ts           # Response utilities
│   ├── validation.ts             # Zod schemas
│   └── text-extraction.ts        # Resume text extraction utilities
├── public/
│   └── uploads/                  # Resume file storage
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

# Upload resume files
curl -X POST http://localhost:3000/api/resumes/upload \
  -F "candidateId=1" \
  -F "files=@/path/to/resume.pdf" \
  -F "files=@/path/to/cover-letter.docx"

# Extract text from uploaded resume
curl -X POST http://localhost:3000/api/resumes/1/extract-text
```
