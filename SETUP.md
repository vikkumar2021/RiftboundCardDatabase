# Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose (for local database)
- PostgreSQL >= 14 (if not using Docker)
- Redis >= 6 (if not using Docker)

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RiftboundCardDatabase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start database services with Docker**
   ```bash
   docker-compose up -d
   ```

   Or set up PostgreSQL and Redis manually and update `.env` accordingly.

5. **Set up the database**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

6. **Get Riot API Key**
   - Register at [Riot Games Developer Portal](https://developer.riotgames.com/)
   - Add your API key to `.env` as `RIOT_API_KEY`

## Development

### Start all services
```bash
npm run dev
```

This starts:
- Backend API on http://localhost:3001
- Frontend app on http://localhost:3000

### Start services individually

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Testing

**Backend tests:**
```bash
cd backend
npm test
npm run test:coverage
```

**Frontend tests:**
```bash
cd frontend
npm test
npm run test:coverage
```

## Database Management

**Run migrations:**
```bash
cd backend
npm run db:migrate
```

**Open Prisma Studio:**
```bash
cd backend
npm run db:studio
```

**Manual sync (admin):**
```bash
curl -X POST http://localhost:3001/api/admin/sync \
  -H "X-Admin-Secret: your_admin_secret"
```

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Build all packages: `npm run build`
3. Start backend: `cd backend && npm start`
4. Start frontend: `cd frontend && npm start`

For production, consider:
- Using a managed PostgreSQL database (AWS RDS, Railway, etc.)
- Using a managed Redis instance (Redis Cloud, Upstash, etc.)
- Setting up a CDN for images
- Configuring environment variables securely
- Setting up monitoring and logging (Sentry, DataDog, etc.)
