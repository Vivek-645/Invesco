# Secure Node.js Backend with Clerk Auth & MongoDB

A production-ready Express.js backend that integrates Clerk authentication with MongoDB (using the official driver, not Mongoose) to store and manage user data.

## Features

- ✅ **Clerk Authentication**: Dual-pattern JWT verification (SDK + manual)
- ✅ **MongoDB Native Driver**: No Mongoose, pure MongoDB client
- ✅ **Security**: Helmet, CORS, rate limiting, input validation
- ✅ **User Management**: Upsert and fetch user profiles
- ✅ **Graceful Shutdown**: Proper cleanup on SIGINT/SIGTERM
- ✅ **Connection Resilience**: Automatic retry with exponential backoff
- ✅ **Type Safety**: Ready for TypeScript conversion

## Tech Stack

- **Runtime**: Node.js (>=16)
- **Framework**: Express.js
- **Database**: MongoDB (official `mongodb` driver)
- **Authentication**: Clerk (`@clerk/clerk-sdk-node`)
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

## Prerequisites

- Node.js 16+ and npm
- MongoDB instance (local or MongoDB Atlas)
- Clerk account with API keys ([clerk.com](https://clerk.com))

## Quick Start

### 1. Install Dependencies

\`\`\`bash
cd server
npm install
\`\`\`

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` with your configuration:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=myapp

# Server Configuration
PORT=4000
NODE_ENV=development

# Clerk Configuration
CLERK_API_KEY=sk_test_your_clerk_api_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
\`\`\`

**Where to find Clerk credentials:**
- Go to [Clerk Dashboard](https://dashboard.clerk.com)
- Select your application
- Navigate to **API Keys**
- Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Start the Server

\`\`\`bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
\`\`\`

The server will:
1. Connect to MongoDB with retry logic
2. Create necessary indexes on the `users` collection
3. Start listening on the configured PORT (default: 4000)

### 4. Verify Installation

Check the health endpoint:

\`\`\`bash
curl http://localhost:4000/health
\`\`\`

Expected response:
\`\`\`json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-27T...",
  "environment": "development"
}
\`\`\`

## API Endpoints

### Authentication

All `/api/users/*` endpoints require authentication. Include the Clerk token in the Authorization header:

\`\`\`
Authorization: Bearer <clerk_token>
\`\`\`

### POST /api/users/upsert

Upsert (create or update) user data in MongoDB based on Clerk user ID.

**Request:**
\`\`\`bash
curl -X POST http://localhost:4000/api/users/upsert \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "imageUrl": "https://example.com/avatar.jpg",
    "phone": "+1234567890",
    "metadata": {
      "preferences": { "theme": "dark" }
    }
  }'
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "clerkId": "user_xxx",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "imageUrl": "https://example.com/avatar.jpg",
      "phone": "+1234567890",
      "metadata": { "preferences": { "theme": "dark" } },
      "createdAt": "2025-11-27T...",
      "updatedAt": "2025-11-27T...",
      "lastSeen": "2025-11-27T..."
    },
    "isNewUser": true
  }
}
\`\`\`

**Error Response (401):**
\`\`\`json
{
  "success": false,
  "error": "Invalid or expired token"
}
\`\`\`

### GET /api/users/me

Fetch the current authenticated user's profile.

**Request:**
\`\`\`bash
curl -X GET http://localhost:4000/api/users/me \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "clerkId": "user_xxx",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-11-27T...",
      "updatedAt": "2025-11-27T...",
      "lastSeen": "2025-11-27T..."
    }
  }
}
\`\`\`

**Error Response (404):**
\`\`\`json
{
  "success": false,
  "error": "User not found. Please call /api/users/upsert first."
}
\`\`\`

## Database Schema

### Users Collection

\`\`\`javascript
{
  _id: ObjectId,
  clerkId: String (unique, indexed),  // Clerk user ID
  email: String | null,
  firstName: String | null,
  lastName: String | null,
  imageUrl: String | null,
  phone: String | null,
  metadata: Object | null,            // Custom user metadata
  createdAt: Date,
  updatedAt: Date,
  lastSeen: Date                      // Updated on each API call
}
\`\`\`

**Indexes:**
- `clerkId` (unique)
- `email` (sparse)
- `lastSeen` (descending)

## Project Structure

\`\`\`
server/
├── server.js                 # Main Express application
├── db.js                     # MongoDB connection manager
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Environment template
├── middleware/
│   └── verifyClerk.js        # Clerk authentication middleware
├── routes/
│   └── users.js              # User API routes
└── utils/
    └── indexes.js            # Database index creation
\`\`\`

## Clerk Token Verification

The backend supports **two verification patterns**:

### Pattern 1: Clerk SDK (Recommended)

Set `CLERK_API_KEY` in your `.env` file. The SDK handles all verification automatically.

### Pattern 2: Manual JWT Verification

If you don't set `CLERK_API_KEY`, the system falls back to manual JWT verification using `jsonwebtoken` and `jwks-rsa`. This provides more control but requires proper issuer validation in production.

## Security Features

1. **Helmet**: Security headers to protect against common vulnerabilities
2. **CORS**: Configurable origin whitelist (default: localhost:3000, localhost:5173)
3. **Rate Limiting**: 
   - General API: 100 requests per 15 minutes per IP
   - Auth endpoints: 20 requests per 15 minutes per IP
4. **Input Validation**: express-validator sanitizes and validates all inputs
5. **Error Handling**: No sensitive data leaked in error messages (production)
6. **Graceful Shutdown**: Proper cleanup of connections on termination

## Testing with curl

### 1. Get a Clerk Token

You need a valid Clerk session token. Get it from your frontend application (see Frontend Integration section).

### 2. Test Upsert Endpoint

\`\`\`bash
TOKEN="your_clerk_token_here"

curl -X POST http://localhost:4000/api/users/upsert \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User"
  }'
\`\`\`

### 3. Test Get Profile Endpoint

\`\`\`bash
curl -X GET http://localhost:4000/api/users/me \\
  -H "Authorization: Bearer $TOKEN"
\`\`\`

## Deployment

### Environment Variables

Set these in your production environment:

- `MONGODB_URI`: Your production MongoDB connection string
- `MONGODB_DB_NAME`: Production database name
- `CLERK_API_KEY`: Production Clerk secret key (starts with `sk_live_`)
- `NODE_ENV`: Set to `production`
- `PORT`: Server port (usually provided by hosting platform)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs

### Deployment Platforms

#### Heroku
\`\`\`bash
# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set CLERK_API_KEY="your_clerk_key"

# Deploy
git push heroku main
\`\`\`

#### Railway
1. Connect your GitHub repository
2. Add environment variables in the Railway dashboard
3. Deploy automatically on push

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Set build and run commands

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production Clerk API key
- [ ] Configure production MongoDB connection
- [ ] Set proper `ALLOWED_ORIGINS` (your production frontend URLs)
- [ ] Enable SSL/TLS for MongoDB connection
- [ ] Use a process manager (PM2) or container orchestration
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Regular security updates

## Troubleshooting

### MongoDB Connection Fails

**Error**: `Failed to connect to MongoDB after 5 attempts`

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB service is running: `mongod --version`
3. For Atlas: Ensure IP whitelist includes your server IP
4. Check network connectivity and firewall rules

### Clerk Token Verification Fails

**Error**: `Invalid or expired token`

**Solutions**:
1. Verify `CLERK_API_KEY` is correct (starts with `sk_test_` or `sk_live_`)
2. Ensure token is not expired (tokens have limited lifetime)
3. Check token is sent in correct format: `Authorization: Bearer <token>`
4. Verify Clerk application is active and not suspended

### CORS Errors

**Error**: `Not allowed by CORS`

**Solutions**:
1. Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
2. Format: `http://localhost:3000,https://myapp.com` (comma-separated, no spaces)
3. For development, ensure `NODE_ENV=development` to allow all origins

## Frontend Integration

See the `frontend-examples/` directory for complete TypeScript examples:

- **Next.js**: App Router and Pages Router examples
- **React + Vite**: Standalone React application example

Both show how to:
- Get a Clerk token using `getToken()`
- Call the backend API with proper authentication
- Handle responses and errors with TypeScript types

## License

ISC

## Support

For issues and questions:
- Backend issues: Check server logs and ensure environment variables are set
- Clerk issues: [Clerk Documentation](https://clerk.com/docs)
- MongoDB issues: [MongoDB Documentation](https://docs.mongodb.com)
