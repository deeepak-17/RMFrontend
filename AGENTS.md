# ResQMeals Frontend - AI Agent Context

> This document provides complete context for AI coding assistants to help team members work on this project.

## Project Overview

**ResQMeals** is a food redistribution platform (M7 Project) connecting surplus food donors with NGOs and shelters.

**Repositories:**
- **ResQMeals**: Backend API (Node.js/Express/MongoDB)
- **RMFrontend** (this repo): Frontend application

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Routing | React Router DOM v7 |
| API Client | Axios |
| State | React Context API |

## Project Structure

```
src/
├── components/
│   ├── ui/           # Generic atoms (button, input, card)
│   ├── layout/       # Navbar, footer, bottom nav
│   ├── food/         # Food-specific components (FoodCard, AddFoodForm)
│   └── sections/     # Landing page sections
├── pages/            # Route components (login, register, dashboards)
├── hooks/            # Custom hooks (useAuth, useLocation)
├── lib/              # Utils, API client (axios config)
└── types/            # TypeScript interfaces
```

## Routes

| Path | Component | Owner |
|------|-----------|-------|
| `/` | Landing page | Base setup |
| `/login` | Login form | Member 2 (Auth) |
| `/register` | Registration form | Member 2 (Auth) |
| `/donor/dashboard` | Donor overview | Member 3 (Donor) |
| `/donor/add` | Add food form | Member 3 (Donor) |
| `/donor/history` | Donation history | Member 3 (Donor) |
| `/ngo/dashboard` | NGO overview | Deepak (NGO) |
| `/ngo/available` | Nearby donations | Deepak (NGO) |
| `/ngo/history` | Claim history | Deepak (NGO) |
| `/volunteer/dashboard` | Volunteer overview | Member 4 (Volunteer) |
| `/volunteer/tasks` | Assigned tasks | Member 4 (Volunteer) |
| `/admin/dashboard` | Admin overview | Member 5 (Admin) |
| `/admin/users` | User management | Member 5 (Admin) |

## Design System

- **Primary**: `emerald-600` (Eco-friendly green)
- **Secondary**: `orange-500` (Urgency/Food)
- **Background**: `neutral-50` (Light mode)
- **Font**: Inter / System sans-serif

## Getting Started

```bash
git clone <repo-url>
cd RMFrontend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5173
```

## API Configuration

Backend runs on `http://localhost:5000/api`

Configure in `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Team Workflow

1. Pull latest `develop`: `git pull origin develop`
2. Create feature branch: `git checkout -b feature/your-module`
3. Make atomic commits: `git commit -m "feat: add login page"`
4. Push and create PR to `develop`
5. Code review and merge

## Dependencies

If adding new packages:
```bash
npm install axios react-router-dom
npm install -D @types/node
```
