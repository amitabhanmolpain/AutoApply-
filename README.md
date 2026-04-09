# AutoApply

A powerful AI-powered job application automation platform that intelligently applies to hundreds of jobs across multiple platforms.

## Project Structure

```
AutoApply-/
├── frontend/          # All frontend code (Next.js application)
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── public/       # Static assets
│   ├── styles/       # Global CSS
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── node_modules/     # Dependencies
└── [git files]

```

## Getting Started

### Development

Navigate to the frontend folder and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at **http://localhost:3000**

### Production Build

```bash
cd frontend
npm run build
npm run start
```

## Technology Stack

- **Framework**: Next.js 16.2.0 with Turbopack
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with glassmorphism design
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database**: Sonner (Toast notifications)
- **Language**: TypeScript

## Features

- 🚀 Lightning-fast job applications with AI automation
- 📊 Advanced analytics and tracking
- 🤖 Smart job matching
- 🔒 Secure & private data handling
- 🌐 Multi-platform support (LinkedIn, Indeed, Intershala, Naukri.com, Wellfound)
- 📱 Responsive design
- ✨ Beautiful glassmorphism UI with animations

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint and format
npm run lint
```

---

**All frontend development is now organized in the `frontend/` folder for better project structure and scalability.**
