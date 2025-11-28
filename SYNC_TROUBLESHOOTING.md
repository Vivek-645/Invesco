# User Sync Troubleshooting Guide

## Issue: Users not syncing to database during signup

### Step 1: Start Backend Server

1. **Open Terminal 1** and navigate to server directory:
   ```bash
   cd /Users/vivek/Desktop/template/server
   ```

2. **Start the backend** (with logs visible):
   ```bash
   npm start
   ```
   
   You should see:
   ```
   ✅ MongoDB connected successfully
   ✅ Database indexes ensured
   ✅ Gemini initialized with model: gemini-2.0-flash-exp
   ✅ Knowledge base loaded: 32 chunks
   🚀 Server running on port 4000
   ```

### Step 2: Start Frontend

1. **Open Terminal 2** and navigate to client directory:
   ```bash
   cd /Users/vivek/Desktop/template/client
   ```

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

### Step 3: Test User Signup

1. **Open browser** to `http://localhost:5173`
2. **Click "Sign In"** or "Get Started"
3. **Sign up with a new account** or sign in with existing
4. **Open Browser Console** (F12 or Right Click > Inspect > Console)
5. Look for these logs:
   ```
   🔄 Syncing user to backend: your-email@example.com
   📤 Payload: { email, firstName, lastName, ... }
   ✅ Backend response: { success: true, data: {...} }
   ✓ New user created in backend (or) ✓ Existing user data synced to backend
   ```

### Step 4: Verify in Database

Check if user was created:
```bash
cd /Users/vivek/Desktop/template/server
node scripts/checkUserRole.js
```

### Step 5: Set User as Admin

Once user is in database, set them as admin:
```bash
cd /Users/vivek/Desktop/template/server
node scripts/setAdminRole.js your-email@example.com
```

## Common Issues

### 1. Backend Not Running
**Symptom:** Network error, fetch failed
**Solution:** Make sure backend is running on port 4000

### 2. CORS Error
**Symptom:** "Not allowed by CORS" in console
**Solution:** Check `server/.env` has correct `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### 3. Authentication Error
**Symptom:** 401 Unauthorized
**Solution:** 
- Make sure Clerk is properly configured
- Check `VITE_CLERK_PUBLISHABLE_KEY` in `client/.env`
- Check `CLERK_SECRET_KEY` in `server/.env`

### 4. User Not Syncing
**Symptom:** No logs in console, no database entry
**Solution:**
- Open browser console and check for errors
- Verify SyncUserToBackend component is being rendered
- Check network tab for API calls to `/api/users/upsert`

## Manual User Creation (If Auto-Sync Fails)

If automatic sync isn't working, you can manually create a user in MongoDB:

```javascript
// Connect to MongoDB via MongoDB Compass or mongo shell
use finsight

db.users.insertOne({
  clerkId: "user_YOUR_CLERK_ID", // Get this from Clerk dashboard
  email: "your-email@example.com",
  firstName: "Your",
  lastName: "Name",
  imageUrl: null,
  phone: null,
  metadata: null,
  role: "admin", // or "user"
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSeen: new Date()
})
```

## Debug Checklist

- [ ] Backend server running on port 4000
- [ ] Frontend running on port 5173 (or 5174)
- [ ] MongoDB connection working
- [ ] Clerk publishable key configured in client
- [ ] Clerk secret key configured in server
- [ ] CORS origins include frontend URL
- [ ] Browser console shows sync attempt
- [ ] Network tab shows POST to /api/users/upsert
- [ ] Backend logs show incoming request

## Getting Clerk User ID

To get your Clerk user ID:
1. Sign in to your app
2. Open browser console
3. Type: `window.Clerk.user.id`
4. Copy the ID (starts with `user_`)
