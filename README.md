# Memory Game with AI-Generated Concepts

A visual memory game that uses Google's Gemini AI to generate concepts. Players memorize a concept and then identify the matching image from a selection.

## Project Structure

```
memory-game/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Node.js + Express + TypeScript backend
├── shared/            # Shared types between frontend and backend
└── package.json       # Root package.json for monorepo
```

## Features

- **AI-Powered Concepts**: Uses Gemini AI to generate unique concepts for each game
- **Secure Backend**: API keys are stored securely on the backend
- **Multiple Difficulty Levels**: Easy (4 images), Medium (6 images), Hard (9 images)
- **Modular Architecture**: Clean separation of concerns with controllers, services, and routes
- **Error Handling**: Comprehensive error handling and logging
- **Type Safety**: Full TypeScript support across frontend and backend

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Set up environment variables:
   
   **Backend** (create `backend/.env`):
   ```env
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key_here
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=debug
   ```
   
   **Frontend** (create `frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Building for Production

```bash
npm run build
```

## Backend Architecture

### Directory Structure

```
backend/src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utility functions
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/games` - Create a new game
- `GET /api/games/:gameId` - Get game details
- `POST /api/games/:gameId/submit` - Submit game results

### Error Handling

The backend uses a centralized error handling system with custom error classes:
- `AppError` - Base error class
- `ValidationError` - Input validation errors
- `NotFoundError` - Resource not found
- `ExternalServiceError` - External API errors

### Logging

Uses Winston for structured logging with different log levels and file outputs.

## Frontend Architecture

The frontend is built with React, TypeScript, and Vite, featuring:
- Component-based architecture
- API service layer for backend communication
- Type-safe API interactions using shared types
- Responsive design with Tailwind CSS

## Security Features

- API keys stored securely on backend only
- CORS configuration
- Rate limiting
- Input validation with Joi
- Helmet.js for security headers
- Environment variable validation

## Future Enhancements

- User authentication and profiles
- Game history and statistics
- Leaderboards
- Multiplayer support
- Image caching for better performance
- Database integration for persistence
