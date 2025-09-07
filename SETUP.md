# ZoneAlign Development Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Git

## Step 1: Environment Variables Setup

### 1.1 Create Clerk Account
1. Go to https://clerk.com and create an account
2. Create a new application
3. Copy your publishable and secret keys

### 1.2 Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your actual values:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/zonealign_dev"

# Clerk Authentication (GET FROM CLERK DASHBOARD)
CLERK_SECRET_KEY="sk_test_your_secret_key_here"
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_random"

# App Configuration
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# For later (can leave as placeholder for now)
GOOGLE_CLIENT_ID="placeholder"
GOOGLE_CLIENT_SECRET="placeholder"
GEMINI_API_KEY="your_gemini_api_key_if_you_have_it"
RESEND_API_KEY="placeholder"
STRIPE_SECRET_KEY="placeholder"
```

### 1.3 Frontend Environment (.env.local)
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` with your actual values:
```env
# Clerk Authentication (GET FROM CLERK DASHBOARD)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_key_here"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001/api/v1"

# App Configuration
NEXT_PUBLIC_APP_NAME="ZoneAlign"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 2: Database Setup

### 2.1 Create PostgreSQL Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zonealign_dev;

# Create user (optional)
CREATE USER zonealign WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE zonealign_dev TO zonealign;

# Exit
\q
```

### 2.2 Update DATABASE_URL
Make sure your `backend/.env` has the correct DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/zonealign_dev"
```

## Step 3: Install Dependencies & Setup

```bash
# From project root
npm install

# Backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init

# Frontend setup  
cd ../frontend
npm install
```

## Step 4: Start Development Servers

### Option 1: Start both servers at once (from root directory)
```bash
npm run dev
```

### Option 2: Start servers separately
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Backend Health Check: http://localhost:3001 (should return "Hello World!")

## Troubleshooting

### Database Issues
```bash
# Reset database
cd backend
npx prisma migrate reset
npx prisma generate
```

### Clerk Issues
- Make sure your Clerk keys are correct
- Check that your Clerk app allows localhost:3000
- Verify redirect URLs in Clerk dashboard

### Port Issues
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

## Testing the Application

1. Visit http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with Clerk
4. Complete the onboarding process
5. Create a team
6. Invite team members using the invite code
7. Test the world clock functionality

## Next Steps

Once everything is working:
- Add Google Calendar integration
- Implement meeting scheduling
- Add AI features with Gemini
- Set up email notifications
- Add payment processing

Happy coding! 🚀