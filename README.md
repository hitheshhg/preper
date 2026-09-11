# PrepQuest — AI Placement Preparation Platform

> **"Train smarter. Interview better. Get placed."**

PrepQuest is a production-grade, major-project AI placement preparation platform. Inspired by the habit-forming engagement psychology of **Duolingo**, it pairs an animated **AI Career Coach ("Coach Questy")** with adaptive technical/behavioral mock interviews, ATS resume intelligence, multi-persona group discussion simulations, and a transparent weighted readiness scoring engine.

---

## 🌟 Key Highlights & Engineering Features

1. **Duolingo-Inspired Engagement & Psychology**:
   - Daily Preparation Streaks 🔥 with animated indicators.
   - XP progression, level milestones (Beginner → Placement Pro), and celebratory micro-interactions.
   - Animated SVG AI Coach character (**Coach Questy**) with 7 distinct emotional states: `happy`, `excited`, `encouraging`, `thinking`, `concerned`, `celebrating`, and `explaining`.
   - Daily Quests with claimable XP bursts and confetti animations.

2. **Resume ATS Intelligence Hub**:
   - Deep text extraction supporting **PDF, DOCX, and TXT** documents.
   - ATS compatibility scoring, keyword gap identification, and missing metrics detection.
   - Side-by-side AI Bullet Rewriter injecting verifiable numbers and scale into project descriptions.

3. **Adaptive AI Mock Interview Arena**:
   - Modes: **HR**, **Technical**, **Behavioral (STAR Method)**, and **Mixed**.
   - Dynamically escalates technical depth if answers are thorough or asks guiding follow-ups if answers are incomplete.
   - Real-time countdown timer, Web Speech API speech-to-text recording, and audio question synthesis.
   - Comprehensive post-interview scorecard: 6-dimensional category scores, strengths, weaknesses, missed opportunities, and exemplary model answer blueprints.

4. **Group Discussion (GD) Simulator**:
   - Interactive 5-person panel with **7 distinct AI persona archetypes**:
     - *The Leader* (structured, inclusive)
     - *The Aggressive Speaker* (frequently interrupts, high energy)
     - *The Silent Expert* (rarely speaks, but delivers profound points)
     - *The Data Person* (cites percentages and research data)
     - *The Contrarian* (plays devil's advocate)
     - *The Moderator* (balances turns and restores order)
     - *The Emotional Speaker* (appeals to human ethics)
   - Real-time turn taking, "Raise Hand" interventions, and rubric evaluations.

5. **Transparent Placement Readiness Index**:
   - Multi-dimensional weighted composite calculation:
     - Technical Knowledge: **20%**
     - Coding Proficiency: **15%**
     - Communication: **15%**
     - Problem Solving & CS Core: **15%**
     - HR Fit: **10%**
     - Resume ATS Strength: **10%**
     - Confidence & Consistency: **15%**
   - Transparent attribution explaining exactly *why* a score changed.

6. **Full-Stack Architecture & Zero Credential Lock-In**:
   - Centralized Gemini AI Service abstraction with structured JSON schemas.
   - Resilient High-Fidelity Demo Mode: Runs seamlessly out of the box even if external API keys are not yet configured!
   - Production-grade PostgreSQL database schema with 18 normalized tables and Supabase Row-Level Security (RLS).

---

## 🏛️ System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │           PrepQuest User Journey             │
                               │  Assess ➔ Practice ➔ Evaluate ➔ Level Up     │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
         ┌───────────────────────────┐                                 ┌───────────────────────────┐
         │     Frontend (Next.js)    │                                 │     Backend (FastAPI)     │
         │  - Next.js 16 App Router  │                                 │  - Python 3.14 + Pydantic │
         │  - TypeScript & Tailwind  │ ◄────────── REST / JSON ──────► │  - Centralized AI Client  │
         │  - Animated Coach Questy  │                                 │  - Transparent Readiness  │
         │  - Recharts & Confetti    │                                 │  - PDF/DOCX Parser        │
         └─────────────┬─────────────┘                                 └─────────────┬─────────────┘
                       │                                                             │
                       ▼                                                             ▼
         ┌───────────────────────────┐                                 ┌───────────────────────────┐
         │      Supabase Cloud       │                                 │     Google Gemini API     │
         │  - Authentication         │                                 │  - Gemini 2.5 Flash       │
         │  - 18 Normalized Tables   │                                 │  - Structured Prompts     │
         │  - Row Level Security     │                                 │  - Adaptive Interviews    │
         └───────────────────────────┘                                 └───────────────────────────┘
```

---

## 📁 Directory Structure

```
try/
├── backend/                        # FastAPI Backend Service
│   ├── api/                        # Modular API Routers
│   │   ├── health.py               # System health & configuration check
│   │   ├── auth.py                 # User profiles & onboarding handler
│   │   ├── resume.py               # Resume upload, ATS score & rewrites
│   │   ├── interview.py            # Adaptive mock interview engine
│   │   ├── gd.py                   # 7-persona Group Discussion simulator
│   │   ├── dashboard.py            # Readiness metrics & daily quests
│   │   ├── coach.py                # Conversational AI mentor endpoint
│   │   ├── skills.py               # Visual skill tree catalog
│   │   ├── roadmaps.py             # 4-week adaptive flight plan
│   │   ├── gamification.py         # XP claim & achievements
│   │   └── catalog.py              # Companies & question bank
│   ├── core/
│   │   └── config.py               # Pydantic Settings & readiness weights
│   ├── schemas/
│   │   └── models.py               # Request/response validation schemas
│   ├── services/
│   │   ├── ai_service.py           # Centralized Gemini AI + mock fallbacks
│   │   ├── readiness_engine.py     # Transparent scoring calculation
│   │   └── resume_parser.py        # PDF/DOCX file extractors
│   ├── requirements.txt            # Python dependencies
│   └── main.py                     # FastAPI application entrypoint
├── frontend/                       # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/                    # Next.js App Router Pages
│   │   │   ├── page.tsx            # Premium Landing Page
│   │   │   ├── onboarding/         # Gamified 4-step onboarding
│   │   │   ├── dashboard/          # Core Gamified Dashboard
│   │   │   ├── resume/             # AI Resume Analyzer & Rewriter
│   │   │   ├── interview/          # Mock Interview Setup & Adaptive Room
│   │   │   ├── gd/                 # Group Discussion Simulation Room
│   │   │   ├── roadmap/            # 4-Week Adaptive Flight Plan
│   │   │   ├── skills/             # Visual Skill Tree Progression
│   │   │   ├── coach/              # AI Career Coach Studio ("Coach Questy")
│   │   │   ├── analytics/          # Recharts Progress Visualizations
│   │   │   ├── companies/          # Target Company Hiring Blueprints
│   │   │   └── questions/          # Filterable Question Bank
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── coach/CoachAvatar.tsx
│   │   │   ├── common/Navbar.tsx
│   │   │   ├── common/Sidebar.tsx
│   │   │   └── dashboard/ReadinessGauge.tsx
│   │   ├── lib/                    # API clients, Supabase, and Confetti
│   │   └── types/                  # TypeScript interfaces
│   └── package.json
├── supabase/
│   └── schema.sql                  # Complete 18-table schema with RLS & seeds
├── .env.example                    # Environment variable template
└── package.json                    # Root script orchestrator
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.14)
- **npm** or **pnpm**

### 2. Environment Configuration
Copy `.env.example` into `.env`:
```bash
cp .env.example .env
```
Key configuration items:
- `GEMINI_API_KEY`: *(Optional)* Get a free key from [Google AI Studio](https://aistudio.google.com/). If omitted, PrepQuest automatically runs in **Resilient High-Fidelity Demo Mode**.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Optional)* Provide from your Supabase project.

### 3. Running the Backend
From the root directory:
```bash
# Install Python requirements
pip install -r backend/requirements.txt

# Start backend on http://localhost:8000
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Running the Frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a project at [supabase.com](https://supabase.com/).
2. Open the **SQL Editor** tab in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. The script initializes all 18 tables, catalogs, seed data, and Row-Level Security (RLS) policies.

---

## 🧪 Testing & Verification

- **Backend Health Check**:
  ```bash
  curl http://localhost:8000/api/health
  ```
- **Frontend Production Build**:
  ```bash
  cd frontend && npm run build
  ```

---

## 🏆 Major Project Defense Criteria
PrepQuest demonstrates genuine architectural depth across all pillars:
- **Scalability**: Decoupled async backend service with stateless REST routes.
- **AI Sophistication**: Context-aware prompts with strict JSON schemas and fallback resilience.
- **Human Psychology**: Duolingo-style short learning loops, streak mechanics, and empathetic coaching.
- **Security**: Strict RLS policies, input sanitization, and zero client-side credential exposure.
