# ClientCare CRM - React Frontend

A modern CRM application built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:8080**

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Supabase** - Backend as a Service (Auth, Database)
- **React Query** - Data Fetching
- **React Router** - Routing

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── layout/     # Sidebar, Header, Layout components
│   ├── leads/      # Lead-related components
│   └── ui/         # shadcn/ui components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities (Supabase client, utils)
├── services/       # API service functions
├── types/          # TypeScript type definitions
└── data/           # Mock data
```

## 🔑 Features

- **Dashboard** - Overview with stats and metrics
- **Leads Management** - Add, view, edit, delete leads
- **Campaigns** - Create and manage WhatsApp campaigns
- **Messages** - Quick messaging templates
- **Integrations** - WhatsApp Business API, Meta Leads, Google Leads
- **Organization Settings** - Team management, billing
- **Reviews & Birthdays** - Customer engagement features

## ⚙️ Configuration

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## 🌐 Deployment

- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment with CI/CD
- **GitHub Pages** - Free static hosting

## 📄 License

MIT
