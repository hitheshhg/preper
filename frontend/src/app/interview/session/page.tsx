'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Maximize2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { Badge } from '@/components/ui/Badge';
import { AbstractOrb } from '@/components/visuals/AbstractOrb';
import { SkillWave, ThinkingField } from '@/components/visuals/SkillWave';
import {
  InterviewQuestion,
  InterviewEvaluation,
  InterviewLiveState,
  IntegrityEvent,
  QuestionReviewItem
} from '@/types';
import { api } from '@/lib/api';
import { triggerConfetti } from '@/lib/confetti';
import { saveCompletedInterviewAction } from '@/app/actions/interview';

function InterviewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'Technical';
  const role = searchParams.get('role') || 'Software Development Engineer';
  const difficulty = searchParams.get('difficulty') || 'Medium';
  const questionCountParam = parseInt(searchParams.get('count') || '5', 10);
  const durationParam = parseInt(searchParams.get('duration') || '15', 10);

  // Core Lifecycle State Machine
  const [liveState, setLiveState] = useState<InterviewLiveState>('PREFLIGHT');
  const [interviewId, setInterviewId] = useState<string>('');
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(questionCountParam);
  const [durationMinutes, setDurationMinutes] = useState(durationParam);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(durationParam * 60);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);

  // Live Transcripts & Voice Loop
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewerMsg, setInterviewerMsg] = useState('Welcome. Please verify your audio and video before entering.');

  // Preflight Diagnostic States
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [speakerTested, setSpeakerTested] = useState(false);
  const [preflightError, setPreflightError] = useState<string | null>(null);

  // Proctoring & Integrity States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [activeWarningToast, setActiveWarningToast] = useState<string | null>(null);

  // Post-Interview Evaluation State
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  // Refs for Web APIs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const liveStateRef = useRef<InterviewLiveState>(liveState);
  liveStateRef.current = liveState;

  // -------------------------------------------------------------
  // 1. PREFLIGHT HARDWARE DIAGNOSTICS
  // -------------------------------------------------------------
  const startHardwareDiagnostics = useCallback(async () => {
    try {
      setPreflightError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true
      });

      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setMicActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
    } catch (err: any) {
      console.warn('Hardware access error:', err);
      setPreflightError(
        'Camera or microphone permission was denied. You can proceed using text responses or click the lock icon in your browser to allow permissions.'
      );
    }
  }, []);

  useEffect(() => {
    startHardwareDiagnostics();
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [startHardwareDiagnostics]);

  const testSpeakerSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        setSpeakerTested(true);
      }
    } catch (e) {
      setSpeakerTested(true);
    }
  };

  // -------------------------------------------------------------
  // 2. PROCTORING & INTEGRITY SENTINEL
  // -------------------------------------------------------------
  const logIntegrityViolation = useCallback(
    async (eventType: IntegrityEvent['event_type'], metadata: string, severity: 'INFO' | 'WARNING' | 'HIGH' = 'WARNING') => {
      const event: IntegrityEvent = {
        event_type: eventType,
        timestamp: new Date().toISOString(),
        severity,
        metadata
      };

      setIntegrityEvents(prev => [...prev, event]);

      const deduction = eventType === 'TAB_SWITCH' || eventType === 'WINDOW_BLUR' ? 4 : eventType === 'FULLSCREEN_EXIT' ? 5 : 8;
      setIntegrityScore(prev => Math.max(40, prev - deduction));

      setActiveWarningToast(`Integrity notice: ${metadata} (-${deduction} pts)`);
      setTimeout(() => setActiveWarningToast(null), 4000);

      if (interviewId) {
        try {
          await api.logIntegrityEvent(interviewId, event);
        } catch (e) {}
      }
    },
    [interviewId]
  );

  useEffect(() => {
    if (liveState === 'PREFLIGHT' || liveState === 'COMPLETED') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logIntegrityViolation('TAB_SWITCH', 'Switched away from interview tab', 'WARNING');
      }
    };

    const handleBlur = () => {
      logIntegrityViolation('WINDOW_BLUR', 'Interview window lost focus', 'WARNING');
    };

    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        logIntegrityViolation('FULLSCREEN_EXIT', 'Exited fullscreen examination mode', 'WARNING');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [liveState, logIntegrityViolation]);

  const enterFullscreenMode = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // 3. CONTINUOUS SPEECH RECOGNITION & 1.8s SILENCE AUTO-SUBMIT
  // -------------------------------------------------------------
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);

  const handleAnswerSubmit = useCallback(
    async (finalAnswer: string) => {
      const trimmed = finalAnswer.trim();
      if (!trimmed) return;

      stopListening();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      setLiveState('PROCESSING');
      setIsSubmitting(true);
      setInterviewerMsg('Analyzing technical rigor and formulating follow-up...');

      try {
        const res = await api.submitInterviewAnswer({
          interview_id: interviewId || 'interview-demo-1',
          question_id: currentQuestion?.id || 'q-1',
          user_answer: trimmed,
          time_taken_seconds: 30
        });

        if (res.is_completed || step >= totalSteps) {
          setLiveState('COMPLETED');
          const evalReport = await api.getInterviewEvaluation(interviewId || 'interview-demo-1');
          setEvaluation(evalReport);
          triggerConfetti();

          if (evalReport) {
            saveCompletedInterviewAction({
              interviewId: evalReport.interview_id,
              role,
              mode,
              difficulty,
              overallScore: evalReport.overall_score || 80,
              technicalScore: evalReport.technical_score || 80,
              communicationScore: evalReport.communication_score || 80,
              structureScore: evalReport.structure_score || 80,
              problemSolvingScore: evalReport.problem_solving_score || 80,
              confidenceScore: evalReport.confidence_score || 80,
              integrityScore: evalReport.integrity_score ?? 100,
              strengths: evalReport.strengths || [],
              weaknesses: evalReport.weaknesses || [],
              recommendations: evalReport.actionable_recommendations || [],
              questionsWithAnswers: (evalReport.question_reviews || []).map((q: any) => ({
                order: q.question_order,
                question: q.question_text,
                category: q.category,
                userAnswer: q.user_answer,
                score: q.score,
                feedback: q.ideal_answer_structure,
                strengths: q.strengths,
                weaknesses: q.weaknesses,
              })),
            }).catch(e => console.warn('Error saving interview to PostgreSQL:', e));
          }
        } else {
          setStep(res.step);
          setCurrentQuestion(res.next_question);
          setTranscript('');
          setInterimTranscript('');
          setInterviewerMsg(res.coach_reaction?.message || res.immediate_feedback || 'Continuing to next question.');

          if (res.next_question) {
            speakQuestionAndListen(res.next_question.question_text);
          }
        }
      } catch (err) {
        setLiveState('COMPLETED');
        const evalReport = await api.getInterviewEvaluation(interviewId || 'interview-demo-1');
        setEvaluation(evalReport);
        triggerConfetti();

        if (evalReport) {
          saveCompletedInterviewAction({
            interviewId: evalReport.interview_id,
            role,
            mode,
            difficulty,
            overallScore: evalReport.overall_score || 80,
            technicalScore: evalReport.technical_score || 80,
            communicationScore: evalReport.communication_score || 80,
            structureScore: evalReport.structure_score || 80,
            problemSolvingScore: evalReport.problem_solving_score || 80,
            confidenceScore: evalReport.confidence_score || 80,
            integrityScore: evalReport.integrity_score ?? 100,
            strengths: evalReport.strengths || [],
            weaknesses: evalReport.weaknesses || [],
            recommendations: evalReport.actionable_recommendations || [],
            questionsWithAnswers: (evalReport.question_reviews || []).map((q: any) => ({
              order: q.question_order,
              question: q.question_text,
              category: q.category,
              userAnswer: q.user_answer,
              score: q.score,
              feedback: q.ideal_answer_structure,
              strengths: q.strengths,
              weaknesses: q.weaknesses,
            })),
          }).catch(e => console.warn('Error saving interview fallback:', e));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [interviewId, currentQuestion, step, totalSteps, stopListening]
  );

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setLiveState('LISTENING');
      setInterviewerMsg('Speech recognition unavailable. You can type your response below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setLiveState('LISTENING');
        setIsAiSpeaking(false);
        setInterviewerMsg('Listening... Speak naturally.');
      };

      recognition.onresult = (event: any) => {
        let full = '';
        let interim = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            full += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        const candidateText = full || interim;
        setTranscript(candidateText);
        setInterimTranscript(interim);

        // Adaptive silence detector: auto-submit after 1.8s silence if candidate has articulated > 20 chars
        if (candidateText.trim().length > 20) {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            handleAnswerSubmit(candidateText);
          }, 1800);
        }
      };

      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          console.warn('Speech recognition warning:', e.error);
        }
      };

      recognition.onend = () => {
        if (liveStateRef.current === 'LISTENING') {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setLiveState('LISTENING');
    }
  }, [handleAnswerSubmit]);

  const speakQuestionAndListen = useCallback(
    (questionText: string) => {
      setLiveState('AI_SPEAKING');
      setIsAiSpeaking(true);
      setInterviewerMsg('Interviewer is speaking...');

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
          setIsAiSpeaking(false);
          startListening();
        };

        utterance.onerror = () => {
          setIsAiSpeaking(false);
          startListening();
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsAiSpeaking(false);
        startListening();
      }
    },
    [startListening]
  );

  const handleInterruptAi = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
    startListening();
  };

  const handleStartInterview = async () => {
    enterFullscreenMode();
    setLiveState('AI_SPEAKING');

    try {
      const res = await api.createInterview({
        mode,
        role,
        difficulty,
        question_count: totalSteps,
        duration_minutes: durationMinutes
      });

      setInterviewId(res.interview_id);
      setCurrentQuestion(res.current_question);
      setTotalSteps(res.total_questions || totalSteps);
      setDurationMinutes(res.duration_minutes || durationMinutes);
      setTimeRemainingSeconds((res.duration_minutes || durationMinutes) * 60);

      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(sessionTimerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const introText = `${res.coach_intro?.message || 'Welcome to your interview session.'} Here is your first question: ${res.current_question.question_text}`;
      speakQuestionAndListen(introText);
    } catch (err) {
      const fallbackQ: InterviewQuestion = {
        id: 'q-1',
        question_order: 1,
        question_text: 'Explain the difference between a process and a thread, and describe how context switching is handled by the operating system.',
        category: 'Operating Systems & Concurrency',
        difficulty: 'Medium',
        expected_concepts: ['Shared memory vs isolated address space', 'PCB vs TCB', 'CPU registers & context switch latency']
      };
      setCurrentQuestion(fallbackQ);
      speakQuestionAndListen(`Welcome to your interview. Here is your first question: ${fallbackQ.question_text}`);
    }
  };

  const timerMins = Math.floor(timeRemainingSeconds / 60);
  const timerSecs = timeRemainingSeconds % 60;
  const formattedTimer = `${timerMins}:${timerSecs < 10 ? '0' : ''}${timerSecs}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-lavender selection:text-foreground transition-colors duration-200">
      {/* Toast Warning */}
      {activeWarningToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs uppercase tracking-wider font-medium shadow-lg flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{activeWarningToast}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOP SESSION HEADER */}
      {/* ============================================================== */}
      <header className="border-b border-border py-4 px-6 sm:px-12">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-4">
            <Link
              href="/interview"
              className="text-foreground-secondary hover:text-foreground transition-colors uppercase tracking-[0.1em]"
            >
              ← Exit
            </Link>
            <span className="text-border">/</span>
            <span className="font-serif tracking-wider text-foreground uppercase text-xs">
              {role}
            </span>
          </div>

          {liveState !== 'PREFLIGHT' && liveState !== 'COMPLETED' && (
            <div className="flex items-center gap-6">
              <span className="text-[11px] uppercase tracking-wider text-foreground-secondary font-mono">
                Trust Index: {integrityScore}%
              </span>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full border border-border">
                {formattedTimer}
              </span>
              <span className="text-[11px] font-mono text-foreground-secondary">
                Q 0{step} / 0{totalSteps}
              </span>
              <button
                type="button"
                onClick={enterFullscreenMode}
                className="p-1 text-foreground-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN VIEWPORT */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-6 sm:px-12 py-10 lg:py-16 flex flex-col justify-center">
        {/* ============================================================== */}
        {/* 1. PREFLIGHT DIAGNOSTIC CHECK */}
        {/* ============================================================== */}
        {liveState === 'PREFLIGHT' && (
          <div className="space-y-12 max-w-2xl mx-auto w-full">
            <div className="space-y-3 text-center sm:text-left">
              <SectionLabel number="00" label="Acoustic & Video Check" />
              <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight leading-tight">
                Prepare your space.
              </h1>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Confirm your camera and microphone. Once launched, the interview runs hands-free: the interviewer speaks first, and silence detection auto-submits answers.
              </p>
            </div>

            {preflightError && (
              <div className="p-4 rounded-xl border border-border bg-surface text-xs text-foreground-secondary flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>{preflightError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
              {/* Camera Preview */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-foreground-secondary block font-medium">
                  Optical Feed
                </span>
                <div className="relative rounded-2xl border border-border bg-surface-elevated overflow-hidden aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover -scale-x-100 ${!cameraActive ? 'hidden' : ''}`}
                  />
                  {!cameraActive && (
                    <div className="text-center p-4 text-xs text-foreground-muted">
                      <VideoOff className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span>Standby</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hardware Diagnostics */}
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground-secondary uppercase tracking-wider text-[11px] font-medium">
                      Microphone Pickup
                    </span>
                    <span className="font-mono text-xs">{micVolume}%</span>
                  </div>
                  <ProgressLine value={micVolume} color="dark" />
                  <p className="text-[11px] text-foreground-muted">
                    Speak naturally to test sensitivity.
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase tracking-wider text-foreground font-medium block">
                      Synthetic Audio
                    </span>
                    <p className="text-[11px] text-foreground-muted">
                      Ensure you can hear the interviewer.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={testSpeakerSound}>
                    {speakerTested ? '✓ Tested' : 'Emit Tone'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="pill-dark" size="lg" onClick={handleStartInterview} className="w-full sm:w-auto">
                <span>Start Proctored Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. LIVE INTERVIEW ARENA (Voice Automated) */}
        {/* ============================================================== */}
        {liveState !== 'PREFLIGHT' && liveState !== 'COMPLETED' && (
          <div className="space-y-12">
            {/* AI Speaker & Status */}
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-4">
                <AbstractOrb size="sm" active={isAiSpeaking} />
                <div>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-foreground-muted block">
                    Interviewer Status
                  </span>
                  <p className="text-xs text-foreground font-medium">
                    {isAiSpeaking ? 'Interviewer speaking...' : 'Listening to your response'}
                  </p>
                </div>
              </div>

              {isAiSpeaking && (
                <Button variant="secondary" size="sm" onClick={handleInterruptAi}>
                  Interrupt & Respond
                </Button>
              )}
            </div>

            {/* DOMINANT QUESTION — Big Editorial Typography */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{currentQuestion?.category || 'Technical Depth'}</Badge>
                {currentQuestion?.is_followup && (
                  <Badge variant="lavender">Adaptive Follow-Up</Badge>
                )}
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal text-foreground leading-[1.12]">
                {currentQuestion?.question_text || 'Explain how you would architect this system under high concurrent load.'}
              </h2>

              {currentQuestion?.expected_concepts && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-foreground-muted mr-2">
                    Key concepts:
                  </span>
                  {currentQuestion.expected_concepts.map(c => (
                    <span key={c} className="text-xs text-foreground-secondary">
                      · {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ANSWER AREA — Textarea + Voice Stream */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  {liveState === 'LISTENING' && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Listening (Submits on 1.8s silence)
                    </span>
                  )}
                  {liveState === 'PROCESSING' && (
                    <span className="inline-flex items-center gap-2 text-xs text-foreground-secondary">
                      <ThinkingField />
                      <span>Synthesizing response...</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-foreground-muted">
                  {transcript.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={5}
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder={
                  liveState === 'AI_SPEAKING'
                    ? 'Interviewer is speaking... Speech transcription will begin automatically.'
                    : 'Listening... Speak naturally or type your answer directly.'
                }
                className="w-full p-6 border border-border bg-surface rounded-2xl font-serif text-base sm:text-lg focus:border-primary focus:outline-hidden leading-relaxed shadow-2xs text-foreground"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  {liveState === 'LISTENING' ? (
                    <button
                      type="button"
                      onClick={stopListening}
                      className="text-xs uppercase tracking-wider text-foreground-secondary hover:text-foreground flex items-center gap-1.5 cursor-pointer"
                    >
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Pause Mic</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startListening}
                      className="text-xs uppercase tracking-wider text-foreground-secondary hover:text-foreground flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Resume Mic</span>
                    </button>
                  )}
                </div>

                <Button
                  variant="pill-dark"
                  size="md"
                  disabled={isSubmitting || !transcript.trim()}
                  onClick={() => handleAnswerSubmit(transcript)}
                >
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer →'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. POST-INTERVIEW COMPREHENSIVE SCORECARD */}
        {/* ============================================================== */}
        {liveState === 'COMPLETED' && evaluation && (
          <div className="space-y-16 py-4">
            {/* Header: Large Serif Score */}
            <div className="space-y-6 border-b border-border pb-10">
              <SectionLabel number="00" label="Interview Complete" />
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <h1 className="font-serif text-5xl sm:text-7xl font-normal leading-[1.0] text-foreground">
                    You&apos;re closer<br />than you think.
                  </h1>
                  <p className="text-xs uppercase tracking-[0.14em] text-foreground-secondary pt-3">
                    {role} · {mode} Assessment Track
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-foreground-secondary block">
                    Overall Score
                  </span>
                  <span className="font-serif text-7xl sm:text-8xl font-normal text-foreground leading-none block">
                    {evaluation.overall_score}
                  </span>
                </div>
              </div>
            </div>

            {/* Skill Breakdown: Horizontal Lines */}
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.14em] font-medium text-foreground-secondary">
                Competency Breakdown
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ProgressLine label="Technical Knowledge" value={evaluation.technical_score} metric={`${evaluation.technical_score}%`} color="dark" />
                <ProgressLine label="Communication & Articulation" value={evaluation.communication_score} metric={`${evaluation.communication_score}%`} color="lavender" />
                <ProgressLine label="STAR Structure & Organization" value={evaluation.structure_score} metric={`${evaluation.structure_score}%`} color="mint" />
                <ProgressLine label="Problem Solving & Trade-offs" value={evaluation.problem_solving_score} metric={`${evaluation.problem_solving_score}%`} color="pink" />
                <ProgressLine label="Confidence & Executive Presence" value={evaluation.confidence_score} metric={`${evaluation.confidence_score}%`} color="blue" />
                <ProgressLine label="Proctoring Integrity Index" value={evaluation.integrity_score || integrityScore} metric={`${evaluation.integrity_score || integrityScore}%`} color="dark" />
              </div>
            </div>

            {/* What You Did Well vs What Needs Attention */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4 border-t border-border">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground block">
                  What Worked
                </span>
                <ul className="space-y-2 text-xs text-foreground-secondary leading-relaxed">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-foreground font-serif">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.14em] font-semibold text-foreground block">
                  What Needs Attention
                </span>
                <ul className="space-y-2 text-xs text-foreground-secondary leading-relaxed">
                  {evaluation.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-lavender-border font-serif">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Detailed Review */}
            <div className="space-y-4 pt-4 border-t border-border">
              <span className="text-xs uppercase tracking-[0.14em] font-medium text-foreground-secondary block mb-2">
                Question Archive & Model Solutions
              </span>

              {evaluation.question_reviews && evaluation.question_reviews.map(q => {
                const isExpanded = expandedQuestion === q.question_order;
                return (
                  <div key={q.question_order} className="border border-border rounded-2xl overflow-hidden bg-surface">
                    <button
                      type="button"
                      onClick={() => setExpandedQuestion(isExpanded ? null : q.question_order)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-[10px] font-mono uppercase text-foreground-muted">
                          Question 0{q.question_order} · {q.category}
                        </span>
                        <h4 className="font-serif text-lg text-foreground line-clamp-1">
                          {q.question_text}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-serif text-lg font-normal">{q.score}%</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-foreground-muted" /> : <ChevronDown className="w-4 h-4 text-foreground-muted" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-6 border-t border-border space-y-4 text-xs">
                        <div>
                          <span className="uppercase tracking-wider text-[10px] text-foreground-muted block mb-1">
                            Your Recorded Answer:
                          </span>
                          <p className="text-foreground-secondary leading-relaxed font-serif text-sm">
                            {q.user_answer || 'No speech captured.'}
                          </p>
                        </div>

                        {q.ideal_answer_structure && (
                          <div className="pt-2">
                            <span className="uppercase tracking-wider text-[10px] text-foreground font-semibold block mb-1">
                              Model Benchmark Answer:
                            </span>
                            <p className="text-foreground leading-relaxed font-serif text-sm">
                              {q.ideal_answer_structure}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <Link href="/interview">
                <Button variant="secondary" size="md">
                  Practice Another Round
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="pill-dark" size="md">
                  Return to Studio Overview
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
          <span className="font-serif text-xl tracking-wider">Loading session...</span>
        </div>
      }
    >
      <InterviewSessionContent />
    </Suspense>
  );
}
