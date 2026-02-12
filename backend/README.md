# Portfolio Backend API

NestJS backend API for the Personalized Portfolio website with Supabase integration.

## 🚀 Features

- **RESTful API** - Clean and organized endpoints
- **Supabase Integration** - Database for feedback storage
- **CORS Enabled** - Configured for frontend communication
- **Validation** - Input validation using class-validator
- **TypeScript** - Fully typed codebase

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## 🛠️ Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

Environment variables are already configured in `.env`:

```env
SUPABASE_URL=https://wcgkeofwjtgqlbrjprwy.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🏃 Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:3001`

## 📍 API Endpoints

### Health Check
```
GET /
```
Returns API status and available endpoints.

### Feedback Management

#### Create Feedback
```
POST /feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great portfolio!"
}
```

#### Get All Feedback
```
GET /feedback
```
Returns all feedback entries ordered by timestamp (newest first).

#### Get Single Feedback
```
GET /feedback/:id
```
Returns a specific feedback entry by ID.

#### Delete Feedback
```
DELETE /feedback/:id
```
Deletes a specific feedback entry by ID.

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── feedback/
│   │   ├── dto/
│   │   │   └── create-feedback.dto.ts
│   │   ├── feedback.controller.ts
│   │   ├── feedback.service.ts
│   │   └── feedback.module.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── .env
├── package.json
└── README.md
```

## 🔒 Security Notes

- The `.env` file contains sensitive keys and should not be committed to version control in production
- Update your `.gitignore` to exclude `.env` files
- Use service role keys only on the server-side
- Implement authentication for production deployment

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Vercel (Serverless)
1. Add environment variables in Vercel dashboard
2. Deploy using `vercel --prod`

### Railway/Render (Container)
1. Connect your repository
2. Add environment variables
3. Deploy automatically on push

## 🛠️ Built With

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [class-validator](https://github.com/typestack/class-validator) - Decorator-based validation

## 📝 License

This project is unlicensed and for personal use.
