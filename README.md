# QuizForge

QuizForge is a full-stack math quiz generator that creates multiple-choice worksheets from a user-provided topic, renders equations with KaTeX, and supports local mock testing plus end-of-exam scoring.

## Features

- Generate topic-based quiz questions from an API endpoint
- Render mixed plain text + LaTeX math in question/answer content
- Support local `mock.json` test mode for fast iteration
- Capture user selections per question
- Submit at end of exam and compute total score
- Tailwind-based UI for quick styling and iteration

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, KaTeX (`react-katex`)
- **Backend:** Node.js, Express, OpenAI API
- **Dev tooling:** ESLint, dotenv, CORS

## Project Structure

```text
QuizForge/
├── client/
│   ├── src/
│   │   └── App.jsx
│   └── package.json
└── server/
    ├── server.js
    ├── mock.json
    ├── .env
    └── package.json
```

## How It Works

1. User enters a topic in the client.
2. Client sends a `POST` request to:
   - `/generate` for live AI-generated questions, or
   - `/mock` for local test payloads.
3. Server returns a normalized quiz object (`questions[]` with choices and `correctIndex`).
4. Client renders:
   - normal text as text
   - math fragments as KaTeX
5. User selects answers; app stores selections by question id.
6. On **Submit**, client compares selections vs `correctIndex` and shows final score.

## API Contract (Quiz Payload)

```json
{
  "questions": [
    {
      "id": "1",
      "question": "What is $7 \\times 8$?",
      "choices": ["48", "56", "64", "72"],
      "correctIndex": 1,
      "explanation": "The correct answer is $56$ because $7 \\times 8 = 56$.",
      "difficulty": "easy"
    }
  ]
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- OpenAI API key (for live generation mode)

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd QuizForge

cd client
npm install

cd ../server
npm install
```

### 2) Configure environment variables

Create `server/.env`:

```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
```

### 3) Run backend

From `server/`:

```bash
node server.js
```

### 4) Run frontend

From `client/`:

```bash
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:3000`

## Test Mode vs Live Mode

In `client/src/App.jsx`, toggle:

- `const TEST_MODE = true` -> use `/mock` with `server/mock.json`
- `const TEST_MODE = false` -> use `/generate` with OpenAI

This allows deterministic UI testing before using live generation.

## Available Scripts

### Client (`client/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

### Server (`server/package.json`)

- currently no start script; run with:
  - `node server.js`

## Current Behavior

- Users can generate and render quiz questions/answers
- Users can select one answer per question (highlighted in UI)
- End-of-exam submit calculates score against `correctIndex`

## Roadmap

- Add server `start`/`dev` scripts (`nodemon`)
- Disable submit until all questions are answered
- Add per-question feedback/explanations after submit
- Persist quiz attempts/history
- Add unit/integration tests for scoring and parsing
- Improve prompt hardening + JSON schema validation on server

## Known Notes

- Keep `.env` out of version control.
- Ensure `node_modules/` is ignored in both `client` and `server`.
- If OpenAI response formatting changes, server JSON parsing may need stricter validation.

## Contributing

1. Create a feature branch
2. Commit using clear Conventional Commit messages
3. Open a PR with:
   - what changed
   - why it changed
   - how it was tested

## License

Choose a license (for example, MIT) and add a `LICENSE` file if you plan to open-source the project.
