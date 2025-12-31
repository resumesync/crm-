# ClientCare CRM - Complete End-to-End Setup Guide

## 🎯 Goal
Get your complete SaaS CRM running from signup to managing leads in 30 minutes.

---

## 📋 PHASE 1: Supabase Setup (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - Name: `clientcare-crm`
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait 2 minutes for project to initialize

### Step 2: Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open file: `clientcare-automata-main/supabase-schema.sql`
4. Copy ALL contents
5. Paste in SQL Editor
6. Click **"Run"** ✅
7. You should see: "Success. No rows returned"

### Step 3: Get API Credentials
1. Go to **Settings** → **API**
2. Copy these values:
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (⚠️ Keep secret!)
   JWT Secret: (under JWT Settings)
   ```

### Step 4: Enable Email Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google** provider:
   - Add Google Client ID & Secret
   - Set redirect URL: `http://localhost:8080/onboarding`

---

## 📋 PHASE 2: Backend Setup (10 minutes)

### Step 1: Install Python & Dependencies
```powershell
# Check Python version (need 3.9+)
python --version

# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment
```powershell
# Copy environment template
copy .env.example .env

# Edit .env file
notepad .env
```

**Paste your Supabase credentials:**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGc... (service_role key)
SUPABASE_JWT_SECRET=your_jwt_secret

DATABASE_URL=postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres

DEBUG=True
```

### Step 3: Start Backend Server
```powershell
# Make sure virtual environment is activated
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test it:** Open http://localhost:8000/health
Should see: `{"status": "healthy"}`

### Step 4: Test API Documentation
Open: http://localhost:8000/api/docs

You'll see Swagger UI with all API endpoints! ✅

---

## 📋 PHASE 3: Frontend Setup (10 minutes)

### Step 1: Configure Frontend Environment
```powershell
# Go back to root directory
cd ..

# Copy environment template
copy .env.example .env

# Edit .env
notepad .env
```

**Paste Supabase credentials:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (anon public key)
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 2: Update App.tsx with Auth Provider
The app is already running at http://localhost:8080

**Verify these pages work:**
- Landing: http://localhost:8080/
- Pricing: http://localhost:8080/pricing
- Sign up: http://localhost:8080/signup
- Login: http://localhost:8080/login

---

## 📋 PHASE 4: Test End-to-End Flow (5 minutes)

### Test 1: Sign Up New User
1. Go to http://localhost:8080/signup
2. Fill in form:
   - Name: Test User
   - Clinic: Test Clinic
   - Email: test@test.com
   - Phone: +91 9999999999
   - Password: test123456
3. Click "Create Account"
4. Should redirect to `/leads`

### Test 2: Check Supabase Dashboard
1. Go to Supabase → **Authentication** → **Users**
2. You should see your new user! ✅
3. Go to **Table Editor** → **organizations**
4. You should see "Test Clinic"! ✅

### Test 3: Create a Lead
1. In app at http://localhost:8080/leads
2. Click "+ Add Lead"
3. Fill in lead details
4. Click "Save"
5. Lead appears in list! ✅

### Test 4: Verify in Database
1. Supabase → **Table Editor** → **leads**
2. Your lead is there! ✅

---

## 📋 PHASE 5: Verify All Features

### ✅ Authentication
- [ ] Can sign up
- [ ] Can log in
- [ ] Can log out
- [ ] Redirects to login if not authenticated

### ✅ Leads Management
- [ ] Can create lead
- [ ] Can view lead list
- [ ] Can open lead detail panel
- [ ] Can edit lead (click Edit button)
- [ ] Can save changes
- [ ] Can filter/search leads

### ✅ Organization
- [ ] Can view org settings at `/settings/organization`
- [ ] Can see team members
- [ ] Can see usage stats

### ✅ Onboarding
- [ ] After signup, goes through onboarding
- [ ] 3-step process works
- [ ] Completes and goes to dashboard

---

## 🐛 TROUBLESHOOTING

### Issue: Backend won't start
**Error:** `ModuleNotFoundError: No module named 'fastapi'`
**Fix:**
```powershell
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend
**Error:** `Network Error` or `CORS error`
**Fix:**
1. Check backend is running: http://localhost:8000/health
2. Check `.env` has correct `VITE_API_URL=http://localhost:8000/api/v1`
3. Restart frontend: `npm run dev`

### Issue: Supabase connection error
**Error:** `Invalid API key`
**Fix:**
1. Backend uses **service_role** key (not anon key)
2. Frontend uses **anon public** key
3. Double-check in Supabase → Settings → API

### Issue: 401 Unauthorized
**Error:** When calling API
**Fix:**
1. Make sure you're logged in
2. Token might be expired - log out and log in again
3. Check Supabase JWT secret is correct in backend `.env`

### Issue: RLS Policy Error
**Error:** `new row violates row-level security policy`
**Fix:**
1. Make sure SQL schema was run completely
2. Check user was added to organization_members table
3. Run this to verify:
```sql
SELECT * FROM organization_members WHERE user_id = auth.uid();
```

---

## 🎯 COMPLETE FEATURE CHECKLIST

### Frontend Pages ✅
- [x] Landing page
- [x] Pricing page  
- [x] Sign up page
- [x] Login page
- [x] Onboarding (3 steps)
- [x] Dashboard/Leads
- [x] Lead detail panel
- [x] Organization settings
- [x] Messages
- [x] Campaigns
- [x] Reviews
- [x] Birthdays
- [x] Integrations
- [x] Settings

### Backend API ✅
- [x] Health check
- [x] Leads CRUD
- [x] Leads filtering & search
- [x] Organization management
- [x] Team member management
- [x] Usage statistics
- [x] Authentication middleware
- [x] Role-based access control

### Database ✅
- [x] Organizations table
- [x] Organization members table
- [x] Leads table
- [x] Row-level security
- [x] Auto-update triggers
- [x] Performance indexes

### Features ✅
- [x] Multi-tenant architecture
- [x] Role-based permissions
- [x] Lead management
- [x] Team collaboration
- [x] Usage tracking
- [x] Form validation
- [x] Toast notifications
- [x] Responsive design
- [x] Dark mode support

---

## 🚀 NEXT STEPS

### Immediate Enhancements
1. **Enable Google OAuth**
   - Add credentials to Supabase
   - Test Google login

2. **Add Stripe Billing**
   - Create Stripe account
   - Add products (Free/Pro/Enterprise)
   - Integrate payment

3. **Meta Ads Integration**
   - Create Meta app
   - Set up webhook
   - Test lead import

4. **Google Ads Integration**
   - Set up Google Ads API
   - Create conversion tracking
   - Import leads automatically

### Production Deployment

#### Deploy Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-backend.railway.app/api/v1
```

#### Deploy Backend (Railway)
```bash
# Push to GitHub
git add .
git commit -m "Backend ready"
git push

# Go to railway.app
# Connect GitHub repo
# Add environment variables
# Deploy automatically
```

---

## 📊 TESTING CHECKLIST

### User Flow Test
1. [ ] Visit landing page
2. [ ] Click "Get Started"
3. [ ] Sign up with new account
4. [ ] Complete onboarding (3 steps)
5. [ ] Arrive at leads dashboard
6. [ ] Create first lead
7. [ ] View lead details
8. [ ] Edit lead info
9. [ ] Add call log
10. [ ] Send message
11. [ ] Add follow-up
12. [ ] Check organization settings
13. [ ] View usage stats
14. [ ] Log out
15. [ ] Log back in
16. [ ] Data persists ✅

### API Test (using Swagger)
1. [ ] Open http://localhost:8000/api/docs
2. [ ] Click "Authorize"
3. [ ] Log in to frontend, get token from DevTools
4. [ ] Paste token in Swagger
5. [ ] Test GET /api/v1/leads
6. [ ] Test POST /api/v1/leads
7. [ ] Test GET /api/v1/organizations/current
8. [ ] All return data ✅

---

## 🎉 SUCCESS CRITERIA

Your CRM is **fully functional** when:

✅ Can sign up new users
✅ Users get their own organization
✅ Can create and manage leads
✅ Can view lead details
✅ Can edit lead information
✅ Can assign leads to team members
✅ Usage statistics show correct data
✅ All pages load without errors
✅ Backend API responds to all requests
✅ Data persists in Supabase
✅ Multi-tenancy works (users see only their data)

---

## 📞 SUPPORT

**Common Commands:**

```powershell
# Start frontend
npm run dev

# Start backend
cd backend
venv\Scripts\activate
uvicorn main:app --reload

# View backend logs
# Just watch the terminal

# View frontend in browser
http://localhost:8080

# View API docs
http://localhost:8000/api/docs
```

**Everything should be running!** 🚀

**Your complete SaaS CRM is now live locally.**

Next: Deploy to production or add integrations!
