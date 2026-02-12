# Personalized Portfolio Website

A full-stack portfolio website with React frontend and NestJS backend.

## 📁 Project Structure

```
PersonalizedWebsite/
├── assets/                  # Static assets (images, logos, posters, etc.)
│   ├── common/
│   ├── home/
│   ├── logo/
│   ├── posters/
│   └── profile/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── feedback/       # Feedback module (Supabase integration)
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                # Environment variables (Supabase keys)
│   └── package.json
├── legacy-frontend/         # Original static HTML/CSS/JS website
│   ├── js/
│   ├── styles/
│   ├── index.html
│   ├── content.html
│   └── resources.html
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```
Backend runs on: `http://localhost:3001`

### Legacy Frontend
Open `legacy-frontend/index.html` in a browser or use a local server.

## 🔧 Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Supabase** - PostgreSQL database
- **TypeScript** - Type-safe development

### Frontend (Legacy)
- **HTML5** - Structure
- **CSS3** - Styling with glassmorphism effects
- **Vanilla JavaScript** - Interactivity
- **Vue.js** - Form management
- **Supabase** - Direct database access

### Planned (React Rewrite)
- **React** - UI components
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling

## 📡 API Endpoints

Base URL: `http://localhost:3001`

### Health Check
- `GET /` - API status and available endpoints

### Feedback
- `POST /feedback` - Create new feedback
- `GET /feedback` - Get all feedback
- `GET /feedback/:id` - Get specific feedback
- `DELETE /feedback/:id` - Delete feedback

## 🗃️ Database Schema

### Supabase Table: `feedback`
```sql
id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4()
name        text        NOT NULL
email       text        NOT NULL
message     text        NOT NULL
timestamp   timestamp   NOT NULL DEFAULT now()
created_at  timestamp   DEFAULT now()
```

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 📝 Development Roadmap

- [x] Static HTML/CSS/JS website
- [x] Firebase integration (feedback system)
- [x] NestJS backend setup
- [x] Supabase integration
- [x] REST API endpoints
- [ ] React frontend migration
- [ ] Component-based architecture
- [ ] State management (Context/Redux)
- [ ] Frontend-Backend integration
- [ ] Authentication system
- [ ] Admin dashboard
- [ ] Vercel deployment

## 🎨 Features

- **Glassmorphism Design** - Modern glass-effect UI
- **Underwater Theme** - Aquatic-inspired aesthetics
- **Interactive Particles** - Animated background effects
- **Feedback System** - Visitor messages with drag & drop circles
- **Responsive Layout** - Mobile-friendly design
- **Smooth Animations** - Transitions and micro-interactions
- **Project Carousel** - Rotating project showcase
- **Poster Gallery** - Creative design portfolio

## 🚀 Deployment

### Backend (Recommended: Railway/Render)
1. Connect repository
2. Add environment variables
3. Deploy automatically

### Frontend (Recommended: Vercel)
1. Connect repository
2. Set build command
3. Deploy on every commit

## 📄 License

Personal portfolio project - all rights reserved.

---

Built with ❤️ by Sheila Nicole Cheng
