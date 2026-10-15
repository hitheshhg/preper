'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Mic, Sparkles, Activity } from 'lucide-react';

interface VoiceSample {
  question: string;
  topic: string;
  difficulty: 'Senior' | 'Staff' | 'Lead';
  candidateType: 'shallow' | 'deep';
  shallowResponse: {
    answer: string;
    followUp: string;
    reasoning: string;
    evaluation: string;
  };
  deepResponse: {
    answer: string;
    followUp: string;
    reasoning: string;
    evaluation: string;
  };
}

const SAMPLE_QUESTION: VoiceSample = {
  question:
    'In a distributed caching architecture under high write contention, how do you handle cache stampede and ensure strict consistency with a write-through invalidation strategy?',
  topic: 'Distributed Systems & Cache Invalidation',
  difficulty: 'Senior',
  candidateType: 'deep',
  shallowResponse: {
    answer:
      '"We use Redis to store cached keys and set a TTL of 60 seconds. When a key expires, the application queries PostgreSQL and writes the new value back to Redis."',
    followUp:
      '"You mentioned relying solely on a fixed TTL. How does your architecture prevent 50,000 concurrent threads from querying the primary database simultaneously the exact millisecond that key expires?"',
    reasoning: 'Candidate described naive TTL; escalates probing into Mutex/Locking & probabilistic early expiration.',
    evaluation: 'Surface-Level Answer (Depth: 42/100) → Triggering Concurrency Escalation',
  },
  deepResponse: {
    answer:
      '"We apply probabilistic early expiration (XFetch algorithm) combined with a distributed Mutex using Redlock so only one worker thread regenerates the cache while others read stale data with short lease."',
    followUp:
      '"Excellent trade-off. In the event of a network partition between Redis shards during lock acquisition, how do you maintain linearizability without sacrificing 99.9th percentile read latencies?"',
    reasoning: 'Candidate demonstrated strong mastery of cache stampede; escalating into CAP theorem & partition tolerance.',
    evaluation: 'High Architectural Depth (Depth: 94/100) → Triggering Distributed Partition Probing',
  },
};

export function InteractiveVoiceDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCandidateType, setActiveCandidateType] = useState<'shallow' | 'deep'>('deep');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [latency, setLatency] = useState(318);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check speech synthesis support on mount safely without cascading synchronous render
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const timer = setTimeout(() => {
        setSpeechSupported(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggleVoice = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SAMPLE_QUESTION.question);
    utterance.rate = 1.0;
    utterance.pitch = 0.98;

    utterance.onstart = () => {
      setIsPlaying(true);
      // Simulate real-time latency jitter
      setLatency(310 + Math.floor(Math.random() * 25));
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const responseData =
    activeCandidateType === 'deep' ? SAMPLE_QUESTION.deepResponse : SAMPLE_QUESTION.shallowResponse;

  return (
    <div className="w-full rounded-3xl border border-border bg-surface p-6 sm:p-10 space-y-8 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.16em] font-mono text-foreground font-semibold">
              Live Voice Activity Sandbox
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-foreground-muted">
              Viva Showcase
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
            Experience Adaptive Probing in Real Time
          </h3>
        </div>

        {/* Real-time telemetry indicators */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-foreground-secondary">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-lavender-text" />
            <span>VAD Latency: <strong className="text-foreground">{latency}ms</strong></span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-mint-text" />
            <span>Model: <strong className="text-foreground">Gemini 2.5 Flash</strong></span>
          </div>
        </div>
      </div>

      {/* Interleaved Voice Player & Prompt Display */}
      <div className="p-6 rounded-2xl border border-border bg-background space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-serif text-xs font-medium">
              Q
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block">Coach Questy (Lead Interviewer)</span>
              <span className="text-[10px] font-mono text-foreground-muted">{SAMPLE_QUESTION.topic}</span>
            </div>
          </div>

          {/* Audio Synthesis Trigger */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isPlaying
                ? 'border-lavender bg-lavender-soft/20 text-lavender-text shadow-xs'
                : 'border-border bg-surface hover:border-foreground/30 text-foreground'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen to Question</span>
              </>
            )}
          </button>
        </div>

        {/* Spoken Technical Question */}
        <p className="font-serif text-lg sm:text-xl text-foreground leading-relaxed pl-2 border-l-2 border-lavender">
          &ldquo;{SAMPLE_QUESTION.question}&rdquo;
        </p>

        {/* Dynamic Animated Audio Waveform */}
        <div className="flex items-center gap-1 h-8 px-2 py-1 bg-surface rounded-lg border border-border/60">
          {[40, 65, 85, 30, 95, 70, 50, 90, 60, 40, 80, 55, 95, 45, 65, 85, 30, 75, 90, 50, 40, 65, 80, 45, 90].map(
            (height, i) => {
              const activeHeight = Math.max(20, Math.min(95, Math.round(height * (0.65 + 0.35 * Math.sin(i * 0.8)))));
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-foreground' : 'bg-foreground-muted/30'
                  }`}
                  style={{
                    height: isPlaying ? `${activeHeight}%` : '18%',
                    transitionDelay: `${(i % 6) * 35}ms`,
                  }}
                />
              );
            }
          )}
        </div>
      </div>

      {/* Adaptive Follow-Up Probing Simulator */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-foreground">
            Simulate Candidate Response & Observe Adaptive Escalation:
          </span>

          {/* Toggle between Candidate Answers */}
          <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-xl">
            <button
              type="button"
              onClick={() => setActiveCandidateType('shallow')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeCandidateType === 'shallow'
                  ? 'bg-surface text-foreground shadow-xs font-semibold'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Surface-Level Answer
            </button>
            <button
              type="button"
              onClick={() => setActiveCandidateType('deep')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeCandidateType === 'deep'
                  ? 'bg-surface text-foreground shadow-xs font-semibold'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Architectural Mastery Answer
            </button>
          </div>
        </div>

        {/* Side-by-side Response & Adaptation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate Utterance */}
          <div className="p-5 rounded-2xl border border-border bg-background space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted uppercase tracking-wider">
              <span>Candidate Speech Input</span>
              <span className="flex items-center gap-1 text-foreground">
                <Mic className="w-3 h-3 text-lavender-text" />
                VAD Ingestion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed italic">
              {responseData.answer}
            </p>
          </div>

          {/* AI Adaptive Escalation */}
          <div className="p-5 rounded-2xl border border-lavender/50 bg-lavender-soft/10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-lavender-text uppercase tracking-wider">
              <span>AI Adaptive Escalation</span>
              <span className="text-[10px] font-semibold">Gemini Multi-Turn</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground font-serif leading-relaxed">
              {responseData.followUp}
            </p>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-foreground-secondary">{responseData.evaluation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
