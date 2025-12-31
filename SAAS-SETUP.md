# ClientCare CRM - SaaS Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+ (for backend)
- Supabase account
- Stripe account (for billing)

## Frontend Setup

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase

**Create a Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

**Run the SQL Schema:**
1. Go to Supabase SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Run the SQL to create tables and RLS policies

### 3. Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000/api/v1
```

### 4. Update App.tsx

Wrap your app with AuthProvider:
```tsx
import { AuthProvider } from './contexts/AuthContext';

// In App.tsx
<AuthProvider>
  <QueryClientProvider client={queryClient}>
    {/* rest of app */}
  </QueryClientProvider>
</AuthProvider>
```

### 5. Protect Routes

Wrap protected routes:
```tsx
import { ProtectedRoute } from './components/ProtectedRoute';

<Route path="/leads" element={
  <ProtectedRoute>
    <Leads />
  </ProtectedRoute>
} />
```

### 6. Update Login/Signup Pages

Use the `useAuth` hook:
```tsx
import { useAuth } from '@/contexts/AuthContext';

const { signIn, signUp, signInWithGoogle } = useAuth();
```

## Backend Setup (FastAPI)

### 1. Create Backend Directory
```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install fastapi uvicorn supabase python-dotenv pydantic stripe
```

### 3. Create Backend Structure
```
backend/
├── main.py
├── config.py
├── database.py
├── models/
│   └── lead.py
├── routers/
│   ├── auth.py
│   ├── organizations.py
│   ├── leads.py
│   └── billing.py
└── .env
```

### 4. Backend .env
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

### 5. Run Backend
```bash
uvicorn main:app --reload --port 8000
```

## Stripe Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Get your publishable and secret keys

### 2. Create Products
Create 3 products in Stripe:
- Free Tier (₹0)
- Pro Tier (₹3,999/month)
- Enterprise (Custom)

### 3. Update Frontend
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Features Checklist

### ✅ Completed
- [x] Landing page
- [x] Pricing page
- [x] Signup/Login pages
- [x] Onboarding flow
- [x] Organization settings
- [x] Supabase authentication setup
- [x] Database schema
- [x] Protected routes
- [x] Auth context

### 🔄 Todo
- [ ] Connect signup to Supabase
- [ ] Connect login to Supabase
- [ ] Implement Google OAuth
- [ ] Stripe integration
- [ ] Backend API endpoints
- [ ] Real-time lead sync
- [ ] Email notifications
- [ ] Team invitations
- [ ] Webhook handlers (Meta/Google)

## Testing

### Test Authentication
```bash
# Signup
POST /auth/signup
{
  "email": "test@example.com",
  "password": "password123",
  "full_name": "Test User",
  "clinic_name": "Test Clinic"
}

# Login
POST /auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Protected Routes
1. Try accessing `/leads` without login → Redirects to `/login`
2. Login and access `/leads` → Shows dashboard

## Production Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
# Push to GitHub
git push origin main

# Deploy on Railway
# Connect GitHub repo
# Add environment variables
# Deploy
```

## Support

For issues or questions:
- Email: support@clientcare.io
- Docs: clientcare.io/docs
- GitHub: github.com/clientcare/crm

---

**Ready to Go!** 🎉

Your SaaS CRM is now set up with:
✅ Multi-tenant architecture
✅ Supabase authentication
✅ Row-level security
✅ Professional frontend
✅ Ready for Stripe integration
