-- ==========================================================
-- PrepQuest: PostgreSQL Database Schema (Supabase)
-- "Train smarter. Interview better. Get placed."
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------
-- 1. Profiles Table (Linked to auth.users)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Candidate',
    avatar_url TEXT,
    college TEXT,
    degree TEXT DEFAULT 'B.Tech / B.E.',
    branch TEXT DEFAULT 'Computer Science',
    graduation_year INTEGER DEFAULT 2026,
    target_role TEXT DEFAULT 'Software Development Engineer',
    target_companies TEXT[] DEFAULT ARRAY['Google', 'Microsoft', 'Amazon'],
    experience_level TEXT DEFAULT 'Fresher',
    daily_goal_minutes INTEGER DEFAULT 20,
    confidence_level INTEGER DEFAULT 60, -- 0 - 100
    
    -- Gamification Metrics
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_level INTEGER NOT NULL DEFAULT 1,
    current_streak INTEGER NOT NULL DEFAULT 1,
    max_streak INTEGER NOT NULL DEFAULT 1,
    last_active_date DATE DEFAULT CURRENT_DATE,
    
    -- Overall Placement Readiness Score (0 - 100)
    readiness_score INTEGER NOT NULL DEFAULT 65,
    technical_score INTEGER NOT NULL DEFAULT 60,
    coding_score INTEGER NOT NULL DEFAULT 60,
    communication_score INTEGER NOT NULL DEFAULT 70,
    hr_score INTEGER NOT NULL DEFAULT 75,
    resume_score INTEGER NOT NULL DEFAULT 65,
    problem_solving_score INTEGER NOT NULL DEFAULT 60,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 2. Resumes Table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT,
    file_size INTEGER,
    raw_text TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 3. Resume Analyses Table
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT,
    overall_score INTEGER NOT NULL DEFAULT 70, -- 0 - 100
    ats_score INTEGER NOT NULL DEFAULT 68,
    clarity_score INTEGER NOT NULL DEFAULT 75,
    structure_score INTEGER NOT NULL DEFAULT 72,
    relevance_score INTEGER NOT NULL DEFAULT 70,
    
    -- Extracted Elements (JSONB)
    skills_detected JSONB NOT NULL DEFAULT '{"technical": [], "soft": [], "tools": [], "frameworks": []}'::jsonb,
    missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    experience_analysis JSONB NOT NULL DEFAULT '{"has_metrics": true, "missing_metrics_points": [], "achievements_count": 0}'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    improved_bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 4. Skills Catalog & User Skills
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'Programming', 'DSA', 'DBMS', 'OS', 'Networks', 'System Design', 'Web Dev', 'HR', 'Behavioral'
    description TEXT,
    icon TEXT,
    prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[],
    max_level INTEGER DEFAULT 5
);

CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    mastery_percentage INTEGER NOT NULL DEFAULT 0, -- 0 - 100
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ----------------------------------------------------------
-- 5. Mock Interviews
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mode TEXT NOT NULL, -- 'HR', 'Technical', 'Behavioral', 'Mixed'
    role TEXT NOT NULL DEFAULT 'Software Engineer',
    difficulty TEXT NOT NULL DEFAULT 'Medium', -- 'Easy', 'Medium', 'Hard'
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
    duration_seconds INTEGER DEFAULT 0,
    
    -- Final Evaluation Summary
    overall_score INTEGER, -- 0 - 100
    technical_knowledge_score INTEGER,
    communication_score INTEGER,
    confidence_score INTEGER,
    structure_score INTEGER,
    problem_solving_score INTEGER,
    relevance_score INTEGER,
    
    strengths TEXT[],
    weaknesses TEXT[],
    missed_opportunities TEXT[],
    model_answer_highlights TEXT,
    follow_up_recommendations TEXT[],
    xp_earned INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    expected_concepts TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    confidence_score INTEGER, -- 0 - 100
    clarity_score INTEGER,
    correctness_score INTEGER,
    ai_feedback TEXT,
    better_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 6. Group Discussion Simulator
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gd_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    participants JSONB NOT NULL, -- Array of AI personas
    duration_seconds INTEGER DEFAULT 300,
    status TEXT NOT NULL DEFAULT 'completed',
    
    -- GD Evaluation
    overall_score INTEGER,
    communication_score INTEGER,
    leadership_score INTEGER,
    interruption_handling_score INTEGER,
    argument_quality_score INTEGER,
    logical_reasoning_score INTEGER,
    participation_balance_score INTEGER,
    
    strengths TEXT[],
    weaknesses TEXT[],
    improvement_plan TEXT,
    xp_earned INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gd_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.gd_sessions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'user' or 'ai'
    speaker_name TEXT NOT NULL,
    speaker_persona TEXT,
    message TEXT NOT NULL,
    timestamp_offset_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 7. Quests & Daily Gamification
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'HR', 'Technical', 'Resume', 'GD', 'Streak'
    difficulty TEXT NOT NULL DEFAULT 'Easy',
    estimated_minutes INTEGER DEFAULT 10,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    target_count INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
    progress_count INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, quest_id, assigned_date)
);

-- ----------------------------------------------------------
-- 8. Achievements Catalog & User Achievements
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL,
    category TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- ----------------------------------------------------------
-- 9. Roadmaps & Personalized Learning Tasks
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    total_weeks INTEGER DEFAULT 4,
    current_week INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    action_type TEXT NOT NULL, -- 'interview', 'resume', 'skill', 'quiz', 'gd'
    action_link TEXT,
    is_completed BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 30,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ----------------------------------------------------------
-- 10. Notifications
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'streak', 'achievement', 'score', 'recommendation'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gd_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gd_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Catalog tables are world-readable
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are readable by all authenticated users" ON public.skills FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Quests are readable by all authenticated users" ON public.quests FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Achievements are readable by all authenticated users" ON public.achievements FOR SELECT TO authenticated, anon USING (true);

-- User-scoped policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can manage own resumes" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own resume analyses" ON public.resume_analyses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own user_skills" ON public.user_skills FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own interviews" ON public.interviews FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own interview questions" ON public.interview_questions FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.interviews WHERE id = interview_questions.interview_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own interview answers" ON public.interview_answers FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.interviews WHERE id = interview_answers.interview_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own gd_sessions" ON public.gd_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view gd_messages for own sessions" ON public.gd_messages FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.gd_sessions WHERE id = gd_messages.session_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own quests" ON public.user_quests FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own achievements" ON public.user_achievements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own roadmaps" ON public.roadmaps FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own roadmap tasks" ON public.roadmap_tasks FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_tasks.roadmap_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================================
-- SEED DATA FOR CATALOGS
-- ==========================================================

-- Skills Catalog
INSERT INTO public.skills (name, category, description, icon, prerequisites, max_level) VALUES
('Python', 'Programming', 'Core Python, OOP, data structures, and standard library', 'python', ARRAY[]::TEXT[], 5),
('Java', 'Programming', 'Java syntax, collections framework, multi-threading, JVM internals', 'coffee', ARRAY[]::TEXT[], 5),
('JavaScript / TypeScript', 'Web Development', 'ES6+, asynchronous event loop, TypeScript typing system', 'code', ARRAY[]::TEXT[], 5),
('Data Structures', 'DSA', 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Heaps', 'binary', ARRAY['Python']::TEXT[], 5),
('Algorithms', 'DSA', 'Sorting, Dynamic Programming, Greedy, Binary Search, Graph traversals', 'zap', ARRAY['Data Structures']::TEXT[], 5),
('Database Management Systems', 'DBMS', 'SQL queries, normalization, ACID properties, indexing, transactions', 'database', ARRAY[]::TEXT[], 5),
('Operating Systems', 'Core CS', 'Processes, threads, CPU scheduling, deadlocks, virtual memory', 'cpu', ARRAY[]::TEXT[], 5),
('Computer Networks', 'Core CS', 'OSI model, TCP/IP, HTTP/HTTPS, DNS, routing protocols', 'network', ARRAY[]::TEXT[], 5),
('System Design', 'System Design', 'Scalability, microservices, load balancing, caching, CAP theorem', 'layers', ARRAY['Database Management Systems', 'Computer Networks']::TEXT[], 5),
('HR & Self Introduction', 'HR', 'Elevator pitch, career goals, strength/weakness framing', 'user-check', ARRAY[]::TEXT[], 5),
('Behavioral (STAR Method)', 'Behavioral', 'Situation, Task, Action, Result structured responses', 'message-square', ARRAY[]::TEXT[], 5),
('Group Discussion Leadership', 'GD', 'Initiating discussions, summarizing, constructive disagreement', 'users', ARRAY[]::TEXT[], 5)
ON CONFLICT (name) DO NOTHING;

-- Achievements Catalog
INSERT INTO public.achievements (code, title, description, badge_icon, category, xp_reward) VALUES
('FIRST_INTERVIEW', 'First Interview', 'Completed your first AI mock interview session', 'sparkles', 'Interview', 100),
('STREAK_7', '7-Day Streak', 'Maintained daily placement preparation for 7 consecutive days', 'flame', 'Streak', 200),
('RESUME_MASTER', 'Resume Master', 'Achieved an ATS Compatibility score above 85%', 'file-check', 'Resume', 150),
('TECH_BEAST', 'Technical Beast', 'Scored 90%+ in a Hard difficulty technical interview', 'award', 'Technical', 250),
('GD_LEADER', 'GD Leader', 'Demonstrated top-tier leadership in a multi-persona group discussion', 'crown', 'GD', 150),
('XP_1000', '1,000 XP Club', 'Earned 1,000 preparation XP through quests and sessions', 'trending-up', 'Gamification', 300),
('PLACEMENT_READY', 'Placement Ready', 'Attained an overall Placement Readiness Score of 85 or above', 'shield-check', 'Milestone', 500)
ON CONFLICT (code) DO NOTHING;

-- Daily Quests Template
INSERT INTO public.quests (title, description, category, difficulty, estimated_minutes, xp_reward, target_count) VALUES
('Complete a 10-Minute HR Interview', 'Practice answers for behavioral and introductory placement questions', 'HR', 'Easy', 10, 60, 1),
('Sharpen 3 Resume Project Bullets', 'Use AI suggestions to insert measurable metrics into project descriptions', 'Resume', 'Easy', 8, 50, 3),
('Take a Technical Quiz or Challenge', 'Review core OS, DBMS, or DSA concept questions', 'Technical', 'Medium', 15, 80, 1),
('Practice GD Voice Simulation', 'Speak in a 5-minute multi-persona group discussion room', 'GD', 'Medium', 10, 75, 1),
('Consult Coach Questy', 'Ask your AI career coach for personalized feedback on weak areas', 'Coach', 'Easy', 5, 40, 1)
ON CONFLICT DO NOTHING;
