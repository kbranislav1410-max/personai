# PersonAI

AI-powered job description generator built with Next.js.

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd personai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   Set `OPENAI_API_KEY` in `.env.local`.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                          # Next.js App Router
  /api                        # API routes
  page.tsx                    # Home page
/features
  /job-description
    /components               # UI components
    /services                 # Business logic
    /prompts                  # AI prompt templates
    /types                    # TypeScript types
/lib
  /ai                         # AI client helpers
```

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
