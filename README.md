# Riftbound Atlas

High-performance card database platform for Riftbound with HD artwork, advanced search/filtering, deck building tools, and transformative analytics features.

## Project Structure

```
riftbound-atlas/
├── backend/          # Node.js/Express API server
├── frontend/         # Next.js/React frontend application
├── shared/           # Shared TypeScript types and utilities
└── docs/             # Documentation
```

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Redis
- **Frontend**: Next.js + React + TypeScript + Tailwind CSS
- **Search**: PostgreSQL full-text search
- **CDN**: Cloudflare/Fastly (for images)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   cd backend
   npm run db:migrate
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

This will start:
- Backend API on http://localhost:3001
- Frontend app on http://localhost:3000

## Development

- `npm run dev` - Start all services in development mode
- `npm run build` - Build all packages for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format all code with Prettier

## License

This is an unofficial fan project. Riftbound and related assets are property of Riot Games.
