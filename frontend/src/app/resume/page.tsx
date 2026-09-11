'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { CoachAvatar } from '@/components/coach/CoachAvatar';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { Badge } from '@/components/ui/Badge';
import {
  ResumeAnalysisV2,
  ResumeVersionRecord,
  TailoredSummaryResponse
} from '@/types';
import { api } from '@/lib/api';
import { triggerConfetti } from '@/lib/confetti';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  Info,
  Target,
  History,
  Shield,
  RefreshCw,
  Wand2
} from 'lucide-react';

const ANALYSIS_STAGES = [
  { step: 1, label: 'Reading resume document & validating character structure...', progress: 20 },
  { step: 2, label: 'Indexing technical & soft skills taxonomy across 7 domains...', progress: 45 },
  { step: 3, label: 'Simulating ATS parsers & section formatting heuristics...', progress: 68 },
  { step: 4, label: 'Auditing bullet points & identifying quantifiable metric gaps...', progress: 85 },
  { step: 5, label: 'Comparing against hiring rubrics & synthesizing intelligence report...', progress: 98 }
];

export default function ResumeAnalyzerPage() {
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [rawText, setRawText] = useState('');
  const [showTextPaste, setShowTextPaste] = useState(false);

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStageIdx, setAnalysisStageIdx] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(10);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Result State
  const [analysis, setAnalysis] = useState<ResumeAnalysisV2 | null>(null);
  const [history, setHistory] = useState<ResumeVersionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'scores' | 'ats' | 'skills' | 'job_match' | 'experience' | 'projects' | 'bullets' | 'summary' | 'history'
  >('overview');

  // Copy Feedback
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Tailored Summary State
  const [generatedSummary, setGeneratedSummary] = useState<TailoredSummaryResponse | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Default Benchmark Sample Resume
  const defaultSampleResume = `ALEXANDER RIVERA
Email: alex.rivera@example.com | Phone: +1 (555) 019-2834 | GitHub: github.com/alexrivera | LinkedIn: linkedin.com/in/alexrivera

EDUCATION
National Institute of Technology — B.Tech in Computer Science & Engineering (2022 - 2026) | CGPA: 8.7/10
Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks

TECHNICAL SKILLS
Languages: Python, JavaScript, Java, C++, SQL
Frameworks & Libraries: React, Node.js, Next.js, FastAPI, Express
Databases: PostgreSQL, MongoDB, Redis
Developer Tools: Git, GitHub, Docker, Postman, Linux

PROJECTS
E-Commerce Microservices Platform (Python, FastAPI, PostgreSQL, Redis)
- Developed backend REST APIs for product catalog and user authentication.
- Implemented caching with Redis and database migrations with Alembic.
- Created frontend client using React and Tailwind CSS.

Real-Time Placement Discussion Portal (Next.js, WebSockets, Node.js)
- Built interactive web application allowing students to practice interview discussions.
- Integrated Web Speech API for voice recognition and live audio transcription.
- Deployed application on Vercel with automatic CI/CD workflows.

EXPERIENCE
Software Engineering Intern — TechNova Solutions (June 2025 - August 2025)
- Worked on internal developer tooling and bug fixes in Python backend.
- Collaborated with senior engineers in agile sprints and code reviews.`;

  // Load History on Mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const records = await api.getResumeHistory();
        setHistory(records);
      } catch (err) {
        console.warn('History load error:', err);
      }
    }
    loadHistory();
  }, []);

  // Staged Analysis Animation Driver
  const executeAnalysisWithRealisticStaging = async (
    apiCall: () => Promise<ResumeAnalysisV2>
  ) => {
    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisStageIdx(0);
    setAnalysisProgress(15);

    const startTime = Date.now();
    const MIN_PRESENTATION_MS = 2400;

    const stageInterval = setInterval(() => {
      setAnalysisStageIdx(prev => {
        const next = Math.min(prev + 1, ANALYSIS_STAGES.length - 1);
        setAnalysisProgress(ANALYSIS_STAGES[next].progress);
        return next;
      });
    }, 450);

    try {
      const result = await apiCall();

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_PRESENTATION_MS) {
        await new Promise(r => setTimeout(r, MIN_PRESENTATION_MS - elapsed));
      }

      setAnalysisProgress(100);
      setAnalysis(result);
      if (result.score_history) {
        setHistory(result.score_history);
      }
      triggerConfetti();
    } catch (err: any) {
      setAnalysisError(err.message || 'Failed to complete resume audit. Please check the file and try again.');
    } finally {
      clearInterval(stageInterval);
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError('Your resume exceeds the 10 MB limit. Please upload a smaller file.');
      return;
    }

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.pdf') && !lowerName.endsWith('.docx') && !lowerName.endsWith('.txt')) {
      setAnalysisError('Please upload a PDF or DOCX file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);
    if (jobDescription.trim()) {
      formData.append('job_description', jobDescription.trim());
    }

    executeAnalysisWithRealisticStaging(() => api.uploadResume(formData));
  };

  const handleTextAnalyze = (textToUse?: string) => {
    const text = textToUse || rawText || defaultSampleResume;
    if (text.trim().length < 40) {
      setAnalysisError('Please provide more comprehensive resume text to evaluate.');
      return;
    }

    executeAnalysisWithRealisticStaging(() =>
      api.analyzeResume(text, targetRole, jobDescription.trim() || undefined)
    );
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copySummaryText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleGenerateSummary = async () => {
    if (!analysis) return;
    setGeneratingSummary(true);
    try {
      const res = await api.generateTailoredSummary(rawText || defaultSampleResume, targetRole);
      setGeneratedSummary(res);
    } catch (err: any) {
      console.warn('Summary generation error:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-5xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-foreground-secondary">
                01 — Resume Intelligence
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                Every word should<br />earn its place.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Calibrated against enterprise applicant tracking parsers, recruiter screening rubrics, and engineering hiring bars.
              </p>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center gap-2.5 px-4 py-2 border border-border rounded-full bg-surface shrink-0 text-xs">
              <span className="text-foreground-muted uppercase tracking-wider text-[10px]">Target:</span>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="bg-transparent text-foreground font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="Software Development Engineer" className="bg-surface">Software Development Engineer</option>
                <option value="Frontend Engineer" className="bg-surface">Frontend Engineer</option>
                <option value="Backend Engineer" className="bg-surface">Backend Engineer</option>
                <option value="Full-Stack Developer" className="bg-surface">Full-Stack Developer</option>
                <option value="DevOps / Cloud Engineer" className="bg-surface">DevOps / Cloud Engineer</option>
                <option value="Data Analyst" className="bg-surface">Data Analyst</option>
              </select>
            </div>
          </div>

          {/* Staged AI Analysis Screen */}
          {analyzing && (
            <div className="p-12 rounded-2xl border border-border bg-surface space-y-6 text-center max-w-lg mx-auto my-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full border border-lavender animate-pulse flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-lavender" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-normal text-foreground">
                  Analyzing Document Hierarchy
                </h3>
                <p className="text-xs text-foreground-secondary">
                  {ANALYSIS_STAGES[analysisStageIdx]?.label}
                </p>
              </div>

              <div className="w-full h-1 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>

              <p className="text-[11px] text-foreground-muted pt-2">
                Auditing 9 hiring dimensions · Validating skill taxonomy · Zero hallucinated metrics
              </p>
            </div>
          )}

          {/* Upload Input State */}
          {!analyzing && !analysis && (
            <div className="space-y-6">
              {/* Optional Job Description Match Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowJdInput(!showJdInput)}
                    className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-foreground-secondary transition-colors cursor-pointer"
                  >
                    <Target className="w-4 h-4 text-lavender" />
                    <span>Target Job Description (Optional — Match Score & Skill Gaps)</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showJdInput ? 'rotate-180' : ''}`} />
                  </button>
                  {jobDescription.trim() && (
                    <Badge variant="mint">JD Connected</Badge>
                  )}
                </div>

                {showJdInput && (
                  <div className="pt-2 space-y-2.5">
                    <p className="text-[11px] text-foreground-secondary">
                      Paste a target job description. PREPER will calculate match percentage, missing requirements, and keyword deficits.
                    </p>
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      placeholder="Paste job description text here (requirements, qualifications, tech stack)..."
                      className="w-full p-3 rounded-xl border border-border bg-transparent text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Error Notice */}
              {analysisError && (
                <div className="p-4 rounded-xl bg-pink/15 border border-pink-soft/40 text-pink text-xs font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Main Upload Dropzone */}
              <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-normal text-foreground">
                    Document Ingestion
                  </h3>
                  <span className="text-[11px] text-foreground-muted uppercase tracking-wider font-mono">
                    PDF or DOCX · Max 10 MB
                  </span>
                </div>

                {/* Drag and Drop Box */}
                <div className="relative border border-dashed border-border hover:border-border-strong rounded-2xl p-10 sm:p-14 text-center transition-colors group cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-full border border-border group-hover:border-primary flex items-center justify-center transition-colors">
                      <Upload className="w-5 h-5 text-foreground-secondary group-hover:text-foreground transition-colors" />
                    </div>
                    <div>
                      <p className="font-sans text-xs sm:text-sm font-medium text-foreground">
                        Drag & drop resume file here or <span className="underline underline-offset-4">browse files</span>
                      </p>
                      <p className="text-[11px] text-foreground-muted mt-1">
                        Secure in-memory validation · Magic header checks · Never shared
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-foreground-secondary pt-1">
                  <Shield className="w-3.5 h-3.5 text-foreground-secondary shrink-0" />
                  <span>Your resume is evaluated securely in memory and only used to generate your report.</span>
                </div>

                {/* Past Analyses Pill if Available */}
                {history.length > 0 && (
                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-foreground-secondary">
                      <History className="w-3.5 h-3.5 text-foreground-muted" />
                      <span>{history.length} Previous Audits Stored</span>
                    </div>
                    <span className="font-serif font-bold text-foreground">
                      Latest: {history[history.length - 1].overall_score}/100 Health
                    </span>
                  </div>
                )}

                {/* Plain Text Accordion */}
                <div className="pt-4 border-t border-border space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowTextPaste(!showTextPaste)}
                    className="text-xs font-medium text-foreground-secondary hover:text-foreground flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Or paste plain resume text</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showTextPaste ? 'rotate-180' : ''}`} />
                  </button>

                  {showTextPaste && (
                    <div className="space-y-3 pt-2">
                      <textarea
                        rows={6}
                        value={rawText}
                        onChange={e => setRawText(e.target.value)}
                        placeholder="Paste resume content here..."
                        className="w-full p-3 rounded-xl border border-border bg-transparent font-mono text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden leading-relaxed"
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRawText(defaultSampleResume);
                            handleTextAnalyze(defaultSampleResume);
                          }}
                          className="text-xs font-medium text-foreground-secondary hover:text-foreground flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-lavender" />
                          <span>Load Standard Benchmark Sample</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTextAnalyze()}
                          className="btn-pill-primary w-full sm:w-auto text-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Run Audit on Pasted Text</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RESULTS VIEW */}
          {!analyzing && analysis && (
            <div className="space-y-8">
              {/* RESULTS HERO */}
              <div className="p-8 sm:p-10 rounded-2xl bg-surface border border-border space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-6xl sm:text-7xl font-normal text-foreground leading-none">
                      {analysis.overall_score}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-sans tracking-[0.15em] text-foreground-muted">
                          / 100 HEALTH
                        </span>
                        <Badge variant={analysis.overall_score >= 80 ? 'mint' : 'lavender'}>
                          {analysis.health_status}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-secondary">
                        {analysis.health_status === 'Placement Ready'
                          ? 'Exceptional profile — satisfies Tier-1 corporate screening benchmarks.'
                          : 'Good foundation — targeted improvements will unlock higher hiring committee pass rates.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border border-border text-foreground-secondary">
                      {analysis.version_name}
                    </span>
                    <button
                      onClick={() => setAnalysis(null)}
                      className="btn-pill-secondary text-xs cursor-pointer"
                    >
                      Audit New File
                    </button>
                  </div>
                </div>

                {/* Score Key Indicators Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-border space-y-2">
                    <ProgressLine
                      label="ATS Compatibility"
                      value={analysis.detailed_scores.ats_compatibility.score}
                      metric={`${analysis.detailed_scores.ats_compatibility.score}%`}
                      color="dark"
                    />
                    <span className="text-[10px] text-foreground-muted block">Standard structure</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border space-y-2">
                    <ProgressLine
                      label={analysis.job_match.has_job_description ? 'Job Match' : 'Role Alignment'}
                      value={analysis.job_match.match_percentage}
                      metric={`${analysis.job_match.match_percentage}%`}
                      color="blue"
                    />
                    <span className="text-[10px] text-foreground-muted block truncate">Target: {targetRole}</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border space-y-2">
                    <ProgressLine
                      label="Impact Metrics"
                      value={analysis.detailed_scores.impact.score}
                      metric={`${analysis.detailed_scores.impact.score}%`}
                      color="lavender"
                    />
                    <span className="text-[10px] text-foreground-muted block">Quantifiable evidence</span>
                  </div>

                  <div className="p-4 rounded-xl border border-border space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-foreground-secondary block">Improvement Delta</span>
                    <span className="font-serif text-2xl font-bold text-foreground block">
                      +{100 - analysis.overall_score} pts
                    </span>
                    <span className="text-[10px] text-foreground-muted block">Clear path to 90+</span>
                  </div>
                </div>

                {/* AI Briefing Callout */}
                <div className="p-4 rounded-xl border border-border bg-surface-muted flex items-center gap-3.5">
                  <CoachAvatar mood={analysis.coach_feedback.state as any} size="sm" animate={false} />
                  <p className="text-xs text-foreground-secondary font-normal leading-relaxed">
                    {analysis.coach_feedback.message}
                  </p>
                </div>
              </div>

              {/* TAB NAVIGATION */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'scores', label: '9 Dimensions' },
                  { id: 'ats', label: 'ATS Analysis' },
                  { id: 'skills', label: `Skills (${analysis.skill_taxonomy.length})` },
                  { id: 'job_match', label: `Job Match (${analysis.job_match.match_percentage}%)` },
                  { id: 'experience', label: 'Experience' },
                  { id: 'projects', label: `Projects (${analysis.project_entries.length})` },
                  { id: 'bullets', label: `Impact Rewriter (${analysis.bullet_evaluations.length})` },
                  { id: 'summary', label: 'AI Summary' },
                  { id: 'history', label: `History (${history.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'border border-border text-foreground-secondary hover:text-foreground bg-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* What is already strong */}
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                      <div className="flex items-center gap-2 text-xs uppercase font-sans tracking-wider font-semibold text-foreground">
                        <span className="w-2 h-2 rounded-full bg-mint" />
                        <span>Already Strong</span>
                      </div>
                      <ul className="space-y-2.5">
                        {analysis.health_summary.what_is_strong.map((item, idx) => (
                          <li key={idx} className="text-xs text-foreground-secondary flex items-start gap-2 leading-relaxed">
                            <span className="text-foreground">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What is holding you back */}
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                      <div className="flex items-center gap-2 text-xs uppercase font-sans tracking-wider font-semibold text-foreground">
                        <span className="w-2 h-2 rounded-full bg-pink" />
                        <span>Holding You Back</span>
                      </div>
                      <ul className="space-y-2.5">
                        {analysis.health_summary.what_is_holding_back.map((item, idx) => (
                          <li key={idx} className="text-xs text-foreground-secondary flex items-start gap-2 leading-relaxed">
                            <span className="text-pink">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highest Impact Improvements */}
                    <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
                      <div className="flex items-center gap-2 text-xs uppercase font-sans tracking-wider font-semibold text-foreground">
                        <span className="w-2 h-2 rounded-full bg-lavender" />
                        <span>Priority Actions</span>
                      </div>
                      <ul className="space-y-2.5">
                        {analysis.health_summary.highest_impact_improvements.map((item, idx) => (
                          <li key={idx} className="text-xs text-foreground-secondary flex items-start gap-2 leading-relaxed">
                            <span className="text-lavender">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Direct Action Shortcut Row */}
                  <div className="p-5 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-foreground-secondary">
                      <strong className="text-foreground">Next Step:</strong> {analysis.bullet_evaluations.length} project bullets lack measurable engineering metrics. Review the Impact Rewriter to add numbers.
                    </div>
                    <button
                      onClick={() => setActiveTab('bullets')}
                      className="btn-pill-primary text-xs shrink-0 cursor-pointer"
                    >
                      Open Impact Rewriter →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: 9 SCORE DIMENSIONS */}
              {activeTab === 'scores' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { key: 'ats_compatibility', title: 'ATS Compatibility', data: analysis.detailed_scores.ats_compatibility },
                    { key: 'content_quality', title: 'Content Quality', data: analysis.detailed_scores.content_quality },
                    { key: 'skills', title: 'Skills Taxonomy', data: analysis.detailed_scores.skills },
                    { key: 'experience', title: 'Experience Depth', data: analysis.detailed_scores.experience },
                    { key: 'projects', title: 'Project Depth', data: analysis.detailed_scores.projects },
                    { key: 'education', title: 'Education Credential', data: analysis.detailed_scores.education },
                    { key: 'impact', title: 'Measurable Impact', data: analysis.detailed_scores.impact },
                    { key: 'formatting', title: 'Formatting & Layout', data: analysis.detailed_scores.formatting },
                    { key: 'communication', title: 'Communication Tone', data: analysis.detailed_scores.communication }
                  ].map(item => (
                    <div
                      key={item.key}
                      className="p-6 rounded-2xl bg-surface border border-border space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <ProgressLine
                          label={item.title}
                          value={item.data.score}
                          metric={`${item.data.score}%`}
                          color={item.data.score >= 80 ? 'mint' : item.data.score >= 70 ? 'blue' : 'pink'}
                        />

                        {/* Strengths */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted block">
                            Strengths
                          </span>
                          <p className="text-xs text-foreground-secondary">
                            {item.data.strengths.join(', ') || 'Meets baseline expectations.'}
                          </p>
                        </div>

                        {/* Deductions */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-pink block">
                            Deductions
                          </span>
                          <p className="text-xs text-foreground-secondary">
                            {item.data.deductions.join(', ') || 'No critical deductions.'}
                          </p>
                        </div>
                      </div>

                      {/* How to improve */}
                      <div className="pt-3 border-t border-border text-[11px] text-foreground-secondary">
                        <strong className="text-foreground">Advice:</strong> {item.data.how_to_improve}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: ATS ANALYSIS */}
              {activeTab === 'ats' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl font-normal text-foreground">
                          ATS Parser Diagnostics: {analysis.detailed_scores.ats_compatibility.score}%
                        </h3>
                        <p className="text-xs text-foreground-secondary">
                          {analysis.ats_diagnostics.reasoning}
                        </p>
                      </div>
                      <Badge variant="mint">
                        Density: {analysis.ats_diagnostics.keyword_density_assessment}
                      </Badge>
                    </div>

                    {/* Section Detection Matrix */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <span className="text-xs font-sans uppercase tracking-wider text-foreground-secondary block">
                        Standard Section Detection Matrix:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(analysis.ats_diagnostics.sections_detected).map(([sec, found]) => (
                          <div
                            key={sec}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                              found
                                ? 'bg-surface border-border text-foreground'
                                : 'bg-transparent border-border/60  text-foreground-muted'
                            }`}
                          >
                            <span className="capitalize">{sec}</span>
                            {found ? (
                              <Check className="w-3.5 h-3.5 text-foreground" />
                            ) : (
                              <span className="text-[10px] text-pink font-sans">Missing</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info Checks */}
                    <div className="pt-4 border-t border-border space-y-3">
                      <span className="text-xs font-sans uppercase tracking-wider text-foreground-secondary block">
                        Contact Information Verification:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(analysis.ats_diagnostics.contact_info_found).map(([info, found]) => (
                          <span
                            key={info}
                            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border ${
                              found
                                ? 'border-border text-foreground bg-surface'
                                : 'border-transparent text-foreground-muted line-through'
                            }`}
                          >
                            {found ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3 text-pink" />}
                            <span className="capitalize">{info}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Formatting Risks */}
                    <div className="pt-4 border-t border-border space-y-2">
                      <span className="text-xs font-sans uppercase tracking-wider text-foreground-secondary block">
                        Formatting & Parser Heuristics:
                      </span>
                      {analysis.ats_diagnostics.formatting_risks.map((risk, i) => (
                        <p key={i} className="text-xs text-foreground-secondary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{risk}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS INTELLIGENCE */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between text-xs text-foreground-secondary">
                    <span>Evidence Taxonomy: Distinguishes between verified resume skills and missing role requirements.</span>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="flex items-center gap-1 text-[11px] text-foreground">
                        <Check className="w-3 h-3" /> Detected
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-pink">
                        <AlertCircle className="w-3 h-3" /> Missing
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Programming Languages', 'Frameworks', 'Databases', 'Tools', 'Cloud', 'Soft Skills'].map(cat => {
                      const catSkills = analysis.skill_taxonomy.filter(s => s.category.includes(cat) || (cat === 'Frameworks' && s.category === 'Architecture'));
                      if (catSkills.length === 0) return null;

                      return (
                        <div
                          key={cat}
                          className="p-6 rounded-2xl bg-surface border border-border space-y-3"
                        >
                          <h4 className="font-sans text-xs uppercase tracking-wider text-foreground font-semibold">
                            {cat}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {catSkills.map(skill => (
                              <span
                                key={skill.name}
                                className={`px-3 py-1 rounded-full text-xs font-sans flex items-center gap-1.5 border ${
                                  skill.confidence === 'detected'
                                    ? 'bg-surface-muted border-border text-foreground'
                                    : 'border-pink-soft/40 text-pink bg-pink/10'
                                }`}
                              >
                                {skill.confidence === 'detected' ? (
                                  <Check className="w-3 h-3 text-foreground" />
                                ) : (
                                  <span className="text-[10px] font-bold">+</span>
                                )}
                                <span>{skill.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: JOB MATCH */}
              {activeTab === 'job_match' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-normal text-foreground">
                          Target Role Alignment: {analysis.job_match.match_percentage}%
                        </h3>
                        <p className="text-xs text-foreground-secondary">
                          Targeting {analysis.job_match.target_role}
                        </p>
                      </div>
                      <span className="font-serif text-4xl font-normal text-foreground">
                        {analysis.job_match.match_percentage}%
                      </span>
                    </div>

                    {/* Rationale Box */}
                    <div className="p-5 rounded-xl bg-surface-muted border border-border text-xs text-foreground-secondary leading-relaxed">
                      <strong className="text-foreground block mb-1">Explainable Match Breakdown:</strong>
                      {analysis.job_match.explanation}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Strong Matches */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-sans uppercase tracking-wider text-foreground block font-semibold">
                          Demonstrated Skills ({analysis.job_match.strong_matches.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.job_match.strong_matches.map(s => (
                            <span key={s} className="px-3 py-1 rounded-full border border-border text-xs text-foreground bg-surface">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-sans uppercase tracking-wider text-pink block font-semibold">
                          Missing Role-Relevant Skills ({analysis.job_match.missing_skills.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {analysis.job_match.missing_skills.map(s => (
                            <span key={s} className="px-3 py-1 rounded-full border border-pink-soft/40 text-xs text-pink bg-pink/10">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Keyword & Experience Gaps */}
                    <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div>
                        <strong className="text-foreground block mb-1">Terminology / Keyword Gaps:</strong>
                        <ul className="space-y-1 text-foreground-secondary">
                          {analysis.job_match.keyword_gaps.map((k, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-foreground-muted">•</span> {k}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-foreground block mb-1">Experience Gaps:</strong>
                        <ul className="space-y-1 text-foreground-secondary">
                          {analysis.job_match.experience_gaps.map((g, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-foreground-muted">•</span> {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  {analysis.experience_entries.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-xl font-normal text-foreground">
                            {exp.role_title}
                          </h4>
                          <span className="text-xs text-foreground-secondary">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">
                            Action Verbs: {exp.action_verbs_strength}
                          </Badge>
                          <Badge variant="mint">
                            Relevance: {exp.relevance_to_target_role}%
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-foreground-secondary">
                        <strong className="text-foreground">Technical Depth:</strong> {exp.technical_depth}
                      </div>

                      <div className="pt-3 border-t border-border space-y-1.5">
                        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted block">
                          Targeted Improvement Opportunities:
                        </span>
                        <ul className="space-y-1 text-xs text-foreground-secondary">
                          {exp.targeted_suggestions.map((sug, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-foreground">•</span>
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 7: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {analysis.project_entries.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-xl font-normal text-foreground">
                            {proj.name}
                          </h4>
                          <span className="text-xs text-foreground-secondary">{proj.purpose}</span>
                        </div>
                        <Badge variant="blue">
                          Depth: {proj.technical_depth_score}%
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map(t => (
                          <span key={t} className="px-2.5 py-0.5 rounded-full border border-border text-[11px] text-foreground-secondary">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-border space-y-1.5">
                        <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted block">
                          Recommendations:
                        </span>
                        <ul className="space-y-1 text-xs text-foreground-secondary">
                          {proj.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-foreground">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 8: BULLET REWRITER */}
              {activeTab === 'bullets' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl border border-border bg-surface text-xs text-foreground-secondary">
                    Each enhancement preserves your actual achievements and provides guidance where you can add your measured metrics (e.g. latency, scale, volume).
                  </div>

                  {analysis.bullet_evaluations.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Original */}
                        <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-2">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-pink block">
                            Current Bullet Point
                          </span>
                          <p className="text-xs text-foreground-secondary italic leading-relaxed">
                            "{b.original}"
                          </p>
                          <span className="text-[10px] text-foreground-muted block pt-1">
                            <strong className="text-foreground-secondary">Why it is weak:</strong> {b.weakness_reason}
                          </span>
                        </div>

                        {/* Enhanced */}
                        <div className="p-4 rounded-xl border border-border bg-surface space-y-2 relative">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground block">
                            Factually Grounded Suggestion
                          </span>
                          <p className="text-xs text-foreground font-medium leading-relaxed">
                            "{b.suggested_improvement}"
                          </p>

                          <button
                            onClick={() => copyToClipboard(b.suggested_improvement, idx)}
                            className="inline-flex items-center gap-1.5 text-xs font-sans text-foreground hover:underline pt-2 cursor-pointer"
                          >
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIdx === idx ? 'Copied to Clipboard' : 'Copy Enhanced Bullet'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-muted text-[11px] text-foreground-secondary flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-foreground shrink-0" />
                        <span><strong className="text-foreground">Metric Guidance:</strong> {b.metric_guidance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 9: AI SUMMARY */}
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-normal text-foreground">
                          Role-Tailored Professional Summary
                        </h3>
                        <p className="text-xs text-foreground-secondary">
                          Constructed strictly from facts in your resume. Zero hallucinated experiences.
                        </p>
                      </div>

                      <button
                        onClick={handleGenerateSummary}
                        disabled={generatingSummary}
                        className="btn-pill-secondary text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${generatingSummary ? 'animate-spin' : ''}`} />
                        <span>{generatingSummary ? 'Synthesizing...' : 'Regenerate Summary'}</span>
                      </button>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-surface-muted font-serif text-sm sm:text-base text-foreground leading-relaxed">
                      {generatedSummary?.summary || analysis.tailored_summary}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <div className="text-[11px] text-foreground-muted">
                        Copy and paste directly into the top of your resume document.
                      </div>

                      <button
                        onClick={() => copySummaryText(generatedSummary?.summary || analysis.tailored_summary)}
                        className="inline-flex items-center gap-1.5 font-sans font-medium text-foreground hover:underline cursor-pointer"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSummary ? 'Copied to Clipboard' : 'Copy Summary'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-normal text-foreground">
                        Resume Score Progression History
                      </h3>
                      <p className="text-xs text-foreground-secondary">
                        Tracks score trajectories across consecutive resume iterations.
                      </p>
                    </div>

                    {history.length === 0 ? (
                      <p className="text-xs text-foreground-muted">This is your first recorded resume iteration.</p>
                    ) : (
                      <div className="divide-y divide-border">
                        {history.map((record, i) => (
                          <div key={record.version_id || i} className="py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-full border border-border font-serif text-xs font-normal flex items-center justify-center">
                                v{i + 1}
                              </span>
                              <div>
                                <span className="font-sans font-medium text-xs text-foreground block">
                                  {record.version_name} · {record.file_name}
                                </span>
                                <span className="text-[10px] text-foreground-muted">
                                  {record.created_at} · Role: {record.target_role}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-serif text-sm font-normal text-foreground block">
                                {record.overall_score}/100 Health
                              </span>
                              <span className="text-[10px] text-foreground-secondary">
                                ATS: {record.ats_score}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
    </div>
  );
}
