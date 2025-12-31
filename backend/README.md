# ClientCare CRM - FastAPI Backend

Complete backend API for ClientCare CRM with Supabase integration.

## 🚀 Quick Start

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Copy Supabase URL and service role key
- Add Stripe keys (optional for now)
- Keep META/Google fields empty (will add later)

### 4. Run Server
```bash
# Development
uvicorn main:app --reload --port 8000

# Or use Python directly
python main.py
```

Server will start at: `http://localhost:8000`

API Docs: `http://localhost:8000/api/docs`

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── config.py               # Configuration settings
├── database.py             # Supabase client
├── auth.py                 # Authentication middleware
├── models.py               # Pydantic models
├── routers/
│   ├── leads.py           # Leads endpoints
│   └── organizations.py   # Org management
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔌 API Endpoints

### Health Check
```
GET /health
GET /
```

### Leads
```
GET    /api/v1/leads                 # List leads (with pagination)
GET    /api/v1/leads/{id}            # Get lead details
POST   /api/v1/leads                 # Create lead
PUT    /api/v1/leads/{id}            # Update lead
DELETE /api/v1/leads/{id}            # Delete lead (admin only)
```

### Organizations
```
GET  /api/v1/organizations/current       # Get current organization
PUT  /api/v1/organizations/current       # Update organization
GET  /api/v1/organizations/members       # List team members
POST /api/v1/organizations/members/invite # Invite member
DELETE /api/v1/organizations/members/{id} # Remove member
GET  /api/v1/organizations/usage         # Usage statistics
```

## 🔐 Authentication

All endpoints (except `/health` and `/`) require authentication.

### How to Authenticate
1. User logs in via frontend (Supabase Auth)
2. Frontend receives JWT token
3. Frontend sends token in Bearer header:
```
Authorization: Bearer <jwt_token>
```

### Testing with curl
```bash
# Get token from Supabase login
TOKEN="your_jwt_token_here"

# Make authenticated request
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8000/api/v1/leads
```

## 📊 Data Models

### Lead
```python
{
  "id": "uuid",
  "organization_id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "service": "string",
  "status": "new|contacted|qualified|converted|lost",
  "source": "meta|google|manual|website",
  "created_at": "datetime",
  ...
}
```

### Organization
```python
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "subscription_tier": "free|pro|enterprise",
  "subscription_status": "trial|active|cancelled",
  ...
}
```

## 🧪 Testing

### Interactive API Docs
Visit `http://localhost:8000/api/docs`

Click "Authorize" button and paste your JWT token.

### Manual Testing
```bash
# Health check (no auth required)
curl http://localhost:8000/health

# Get leads (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/v1/leads

# Create lead
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "phone": "+91 1234567890",
    "email": "test@example.com",
    "service": "cosmetic_surgery",
    "clinic_name": "Test Clinic",
    "city": "Mumbai",
    "source": "manual",
    "status": "new",
    "organization_id": "your_org_id"
  }' \
  http://localhost:8000/api/v1/leads
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Enforced at database level via Supabase
- **JWT Verification**: All requests verified against Supabase
- **Role-Based Access**: Owner/Admin/Manager/Agent permissions
- **Tenant Isolation**: Users can only access their organization's data
- **CORS Protection**: Only allowed origins can access API

## 🐛 Debugging

### Enable Debug Mode
In `.env`:
```
DEBUG=True
```

### View Logs
```bash
# Start with verbose logging
uvicorn main:app --reload --log-level debug
```

### Common Issues

**1. Supabase Connection Error**
- Check SUPABASE_URL and SUPABASE_KEY in `.env`
- Use service role key (not anon key) for backend

**2. 401 Unauthorized**
- Token might be expired (15 min default)
- Get fresh token from frontend login

**3. 403 Forbidden**
- User lacks required role for action
- Check organization membership

## 📦 Deployment

### Railway
```bash
1. Push code to GitHub
2. Connect Railway to repo
3. Add environment variables
4. Deploy!
```

### Render
```bash
1. Create new Web Service
2. Connect repo
3. Build Command: pip install -r requirements.txt
4. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔄 Next Steps

1. **Test the API**: Use Swagger docs at `/api/docs`
2. **Connect Frontend**: Update frontend API calls
3. **Add Webhooks**: Meta & Google Ads integrations
4. **Add Stripe**: Billing endpoints
5. **Add Emails**: Team invitations & notifications

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| SUPABASE_URL | Your Supabase project URL | Yes |
| SUPABASE_KEY | Service role key (not anon!) | Yes |
| DATABASE_URL | PostgreSQL connection string | No* |
| STRIPE_SECRET_KEY | Stripe secret key | No |
| META_APP_ID | Meta app ID | No |
| GOOGLE_CLIENT_ID | Google OAuth client ID | No |

*DATABASE_URL optional if using Supabase (recommended)

## 🆘 Support

- Backend Issues: Check server logs
- API Questions: See `/api/docs`
- Supabase Help: [supabase.com/docs](https://supabase.com/docs)

---

**Backend is ready!** 🚀 Start the server and test with `curl` or Swagger docs.
