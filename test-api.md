# ZoneAlign API Testing Guide

## 🚀 **Current Status**
- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:3000  
- ✅ Database (SQLite) initialized with schema
- ⚠️  Clerk authentication needs real keys for testing

## API Endpoints Available

### Health Check
```bash
curl http://localhost:3001
# Response: Hello World!
```

### Authentication Required Endpoints
All other endpoints require Clerk authentication:
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `GET /api/v1/teams` - Get user's teams
- `POST /api/v1/teams` - Create new team
- `POST /api/v1/teams/join` - Join team by invite code

## Testing Without Real Clerk Keys

Since we have placeholder Clerk keys, the authentication endpoints won't work yet. However, the application structure is complete and ready for testing once you:

1. **Get Real Clerk Keys**:
   - Sign up at https://clerk.com
   - Create a new application
   - Copy the publishable key and secret key
   - Update `.env.local` and `backend/.env`

2. **Test the Complete Flow**:
   - Visit http://localhost:3000
   - Sign up/sign in with Clerk
   - Complete onboarding process
   - Create a team
   - Invite team members
   - Test world clock functionality

## Frontend Pages Available
- `/` - Landing page with authentication
- `/sign-in` - Clerk sign-in page
- `/sign-up` - Clerk sign-up page  
- `/onboarding` - User profile setup (3-step process)
- `/dashboard` - Team dashboard with world clock

## Features Implemented & Ready
- ✅ **User Authentication** with Clerk
- ✅ **User Profile Setup** with timezone detection
- ✅ **Team Management** (create, join, manage members)
- ✅ **Role-Based Permissions** (owner, admin, member)
- ✅ **World Clock Dashboard** with real-time updates
- ✅ **Invite Code System** for team joining
- ✅ **Database Schema** with all relationships
- ✅ **API Endpoints** for all core features
- ✅ **React Query** for efficient data fetching
- ✅ **Responsive Design** with Tailwind CSS

## Next Steps for Full Testing
1. Replace placeholder Clerk keys with real ones
2. Test complete user flow from signup to dashboard
3. Test team creation and member management
4. Verify timezone handling and world clock
5. Add Google Calendar integration
6. Implement meeting scheduling
7. Add AI features with Gemini

The foundation is solid and ready for immediate testing once authentication is properly configured!