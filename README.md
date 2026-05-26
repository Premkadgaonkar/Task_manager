# NeuroFlow – AI Productivity OS

A full-stack MERN application with dark neon UI, Pomodoro focus timer, intelligent task management, and analytics dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion |
| State | Zustand |
| Charts | Recharts |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |

## Project Structure

```
CC/
├── .env                        # Root env (PORT, MONGO_URI, JWT_SECRET)
├── package.json                # Root scripts (dev, start)
├── server/
│   ├── server.js               # Express entry point
│   ├── config/db.js            # MongoDB Atlas connection
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt hooks)
│   │   └── Task.js             # Task schema (indexes + timestamps)
│   ├── controllers/
│   │   ├── authController.js   # register, login, getMe
│   │   └── taskController.js   # CRUD + analytics + AI suggestions
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   └── tasks.js            # /api/tasks/*
│   └── middleware/
│       ├── auth.js             # JWT protect middleware
│       └── errorHandler.js     # Global error handler
└── client/
    ├── index.html
    ├── vite.config.js          # Vite + /api proxy
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx             # Router + layout
        ├── index.css           # Global styles + glassmorphism
        ├── store/
        │   ├── authStore.js    # Zustand auth state
        │   └── taskStore.js    # Zustand task state
        ├── utils/api.js        # Axios instance + interceptors
        ├── components/
        │   ├── Sidebar.jsx     # Responsive sidebar nav
        │   ├── PageLoader.jsx  # Animated splash screen
        │   └── SkeletonLoader.jsx
        └── pages/
            ├── AuthPage.jsx    # Login / Register
            ├── Dashboard.jsx   # Analytics + charts
            ├── TasksPage.jsx   # Kanban task manager
            ├── FocusMode.jsx   # Pomodoro timer
            └── AISuggestions.jsx
```

## Setup

### 1. Configure Environment

Edit `.env` in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/neuroflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 2. Install Dependencies

```powershell
# Root (backend)
npm install

# Frontend
cd client
npm install
```

### 3. Run Development

```powershell
# From project root — runs both server + client concurrently
npm run dev
```

- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173

### 4. Run Individually

```powershell
# Backend only
npm run dev:server

# Frontend only
npm run dev:client
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile (protected) |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks (with filters) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/analytics` | Dashboard analytics |
| GET | `/api/tasks/suggestions` | AI scheduling suggestions |

## Features

- **Authentication** – JWT with 7-day expiry, bcrypt hashing (12 salt rounds)
- **Task Kanban** – Three columns (Todo / In Progress / Done), search & filter
- **Focus Mode** – Pomodoro timer with animated SVG ring, auto-switches modes
- **Analytics** – Area chart, donut chart, bar chart, productivity score
- **AI Suggestions** – Logic-based suggestions using completion history & deadlines
- **Responsive** – Mobile sidebar + desktop layout
- **Glassmorphism UI** – Neon gradients, backdrop blur, micro-animations

## MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Copy the connection string and paste it as `MONGO_URI` in `.env`
