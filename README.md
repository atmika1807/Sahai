# Sahai 2.0 — AI Mental Wellness Companion

> A safe space to feel, reflect & grow.

Full-stack app with React frontend + FastAPI backend + PostgreSQL + Claude AI.

---

## 📁 Project Structure

```
sahai/
├── frontend/          ← React app (CRA)
│   ├── src/
│   │   ├── pages/     ← Landing, Login, Register, Dashboard, Chat, Journal, MoodTracker
│   │   ├── components/← Sidebar, ProtectedLayout
│   │   ├── context/   ← AuthContext (login/logout/register)
│   │   ├── lib/       ← api.js (axios), supabase.js
│   │   └── styles/    ← All CSS files
│   ├── public/
│   └── package.json
│
└── backend/           ← FastAPI app
    ├── core/          ← config, database, security (JWT)
    ├── models/        ← SQLAlchemy: User, JournalEntry, MoodLog
    ├── routers/       ← auth, chat, journal, mood, dashboard
    ├── services/      ← claude_service.py (AI logic)
    ├── main.py
    └── requirements.txt
```

---

## ⚙️ Prerequisites

Install these before starting:

| Tool | Download |
|------|----------|
| Node.js 18+ | https://nodejs.org |
| Python 3.11+ | https://python.org |
| PostgreSQL 15+ | https://postgresql.org |
| VS Code | https://code.visualstudio.com |

---

## 🚀 How to Run in VS Code (Step by Step)

### Step 1 — Open the project

```
File → Open Folder → select the "sahai" folder
```

Open two terminals in VS Code:  
`Terminal → New Terminal` (do this twice — one for frontend, one for backend)

---

### Step 2 — Set up PostgreSQL

Open **pgAdmin** or the **psql** terminal and run:

```sql
CREATE DATABASE sahai;
```

That's it — SQLAlchemy will create the tables automatically on first run.

---

### Step 3 — Set up the Backend (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and fill in env file
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sahai
SECRET_KEY=any-long-random-string-here
ANTHROPIC_API_KEY=sk-ant-your-key-from-anthropic-console
```

Get your Anthropic API key from: https://console.anthropic.com

```bash
# Start the backend
uvicorn main:app --reload --port 8000
```

✅ You should see: `Uvicorn running on http://127.0.0.1:8000`

Test it: open http://localhost:8000 in your browser — you'll see `{"message":"Sahai API is running 💚"}`

---

### Step 4 — Set up the Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env
```

Open `frontend/.env` — the default values work for local dev:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

> Note: Supabase is optional for now — auth is handled by FastAPI/JWT. You can leave the Supabase values as placeholders and the app will still work.

```bash
# Start the frontend
npm start
```

✅ Browser opens automatically at http://localhost:3000

---

## 🎉 You're running!

| URL | What it is |
|-----|-----------|
| http://localhost:3000 | React frontend |
| http://localhost:8000 | FastAPI backend |
| http://localhost:8000/docs | Interactive API docs (Swagger) |
| http://localhost:8000/redoc | Alternative API docs |

---

## 🔑 API Keys You Need

### 1. Anthropic (required for AI features)
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click "API Keys" → "Create Key"
4. Paste into `backend/.env` as `ANTHROPIC_API_KEY`

### 2. Supabase (optional — for file uploads & OAuth later)
1. Go to https://supabase.com → New project
2. Settings → API → copy "URL" and "anon public" key
3. Paste into `frontend/.env`

---

## 📡 API Endpoints Reference

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user |

### Chat
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/chat/message` | Send message, get AI reply |

### Journal
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/journal` | List all entries |
| POST | `/journal` | Create entry (triggers AI insight) |
| GET | `/journal/{id}` | Get single entry |
| DELETE | `/journal/{id}` | Delete entry |

### Mood
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/mood` | List mood logs |
| POST | `/mood` | Log a mood (score 1–5) |
| DELETE | `/mood/{id}` | Delete a log |

### Dashboard
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/dashboard/stats` | Journal count, mood count, streak |

---

## 🌐 Deploying to Production

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, connect repo to vercel.com
# Set env vars in Vercel dashboard
```

### Backend → Railway
1. Go to railway.app → New Project → Deploy from GitHub
2. Add a PostgreSQL plugin
3. Set environment variables in Railway dashboard
4. Railway auto-detects FastAPI and deploys

---

## 🧪 What Each Phase Teaches You

| Phase | Concepts |
|-------|---------|
| Auth system | JWT, bcrypt, protected routes, HTTP interceptors |
| Chat page | Stateful message history, async/await, AI APIs |
| Journal page | CRUD, two-panel layouts, optimistic UI |
| Mood tracker | Recharts, date manipulation, streak algorithms |
| Dashboard | Aggregate SQL queries, component composition |
| Deployment | CI/CD, env management, CORS, build pipelines |

---

## 🐛 Common Issues

**`CORS error` in browser**  
→ Make sure backend is running on port 8000 and `REACT_APP_API_URL=http://localhost:8000` is set.

**`could not connect to server` (PostgreSQL)**  
→ Make sure PostgreSQL is running. On Windows: check Services. On Mac: `brew services start postgresql`.

**`401 Unauthorized` on API calls**  
→ You're not logged in or the token expired. Log out and log back in.

**`anthropic.AuthenticationError`**  
→ Your `ANTHROPIC_API_KEY` is missing or wrong in `backend/.env`.

**`Module not found` (Python)**  
→ Make sure your venv is activated (`venv\Scripts\activate` on Windows).

---

## 📚 Next Features to Build

- [ ] Twilio SMS crisis alerts (Phase 3)
- [ ] Celery + Redis background job for daily reminders  
- [ ] Therapist matching page
- [ ] Profile picture uploads (Supabase Storage)
- [ ] Stripe payments for premium plan
- [ ] pytest test suite for all API routes
- [ ] GitHub Actions CI/CD pipeline
- [ ] Sentry error tracking + PostHog analytics

---

Built with ❤️ using React, FastAPI, PostgreSQL, and Claude AI.
