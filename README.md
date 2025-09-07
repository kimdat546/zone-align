# ZoneAlign - Remote Team Time Zone Coordination SaaS

ZoneAlign is an intelligent time zone coordination platform that prevents remote team burnout and optimizes async workflows through AI-powered fair scheduling.

## Project Structure

```
zonealign/
├── frontend/          # Next.js 14 + TypeScript frontend
├── backend/           # NestJS + TypeScript backend
├── docs/             # Documentation
├── planning/         # Project planning documents
├── mvp-specs/        # MVP feature specifications
└── architecture/     # Technical architecture docs
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand + React Query
- **Authentication**: Clerk

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT with Clerk integration
- **AI Integration**: Google Gemini API
- **API Documentation**: Swagger/OpenAPI

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway
- **Database**: Railway PostgreSQL
- **Monitoring**: Sentry + PostHog
- **Payments**: Stripe

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Development Setup

1. **Clone and install dependencies**
```bash
git clone <repo-url>
cd zonealign

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. **Environment Setup**
```bash
# Copy environment templates
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. **Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

4. **Start Development Servers**
```bash
# Terminal 1 - Frontend (localhost:3000)
cd frontend
npm run dev

# Terminal 2 - Backend (localhost:3001)
cd backend
npm run start:dev
```

## Development Phases

### Phase 1: MVP Foundation (Months 1-3)
- [ ] Core infrastructure and authentication
- [ ] Team management and time zone handling
- [ ] Calendar integration (Google Calendar)
- [ ] Basic meeting scheduling with fairness tracking
- [ ] Email notifications and payment system

**Target**: $5K MRR, 50+ active teams

### Phase 2: Intelligence Layer (Months 4-6)
- [ ] AI-powered meeting optimization (Gemini)
- [ ] Burnout prediction and warnings
- [ ] Slack/Teams integrations
- [ ] Advanced analytics

**Target**: $25K MRR, improved retention

### Phase 3: Enterprise Features (Months 7-9)
- [ ] Multi-team management
- [ ] Advanced admin controls
- [ ] SSO integration
- [ ] Compliance features

**Target**: $50K MRR, enterprise customers

### Phase 4: Platform Expansion (Months 10-12)
- [ ] Mobile apps
- [ ] Advanced AI insights
- [ ] Third-party integrations
- [ ] Market leadership features

**Target**: $90K MRR, market leadership

## Key Features

### MVP Features
- **Smart Team Coordination**: Visualize team availability across time zones
- **Fair Meeting Scheduling**: AI-powered rotation to prevent meeting burnout
- **Calendar Integration**: Seamless Google Calendar sync
- **Fairness Tracking**: Monitor and balance meeting inconvenience
- **Real-time Dashboard**: Live team status and upcoming meetings

### Post-MVP Features
- **AI Optimization**: Gemini-powered meeting recommendations
- **Burnout Prevention**: Proactive team wellness monitoring
- **Enterprise Management**: Multi-team and advanced admin features
- **Mobile Apps**: Native iOS and Android applications

## Contributing

1. Create feature branches from `main`
2. Follow conventional commits
3. Ensure tests pass
4. Update documentation as needed

## License

MIT License - see LICENSE file for details