# ResQMeals Frontend

The frontend application for **ResQMeals** — a food redistribution platform connecting surplus food donors with NGOs and shelters.

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

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone git@github.com:deeepak-17/RMFrontend.git
cd RMFrontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (button, input, card)
│   ├── layout/       # Navbar, footer, bottom nav
│   ├── food/         # Food-specific components
│   └── sections/     # Landing page sections
├── pages/            # Route components
├── hooks/            # Custom hooks (useAuth)
├── lib/              # Utils, API client
└── types/            # TypeScript interfaces
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_DEFAULT_LAT=11.0168
VITE_DEFAULT_LNG=76.9558
```

See `AGENTS.md` for detailed context and coding guidelines.

## Related Repository

- **Backend**: [ResQMeals](https://github.com/deeepak-17/ResQMeals) (Node.js/Express/MongoDB)

## License

MIT
