'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProgressLine } from '@/components/ui/ProgressLine';
import { Badge } from '@/components/ui/Badge';
import { GDSession, GDEvaluation } from '@/types';
import { api } from '@/lib/api';
import { triggerConfetti } from '@/lib/confetti';
import { Clock, Send, Users } from 'lucide-react';

export default function GDSimulatorPage() {
  const [session, setSession] = useState<GDSession | null>(null);
  const [topic] = useState(
    'Artificial Intelligence in Engineering: Accelerator or Threat to Entry-Level Software Roles?'
  );
  const [userText, setUserText] = useState('');
  const [sending, setSending] = useState(false);
  const [evaluation, setEvaluation] = useState<GDEvaluation | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startNewGDRoom = async () => {
    setEvaluation(null);
    try {
      const res = await api.createGDSession(topic);
      setSession(res);
      setTimerSeconds(300);
    } catch (err) {
      console.warn('GD room creation error:', err);
    }
  };

  useEffect(() => {
    startNewGDRoom();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  useEffect(() => {
    if (evaluation) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [evaluation]);

  const handleSendMessage = async () => {
    if (!userText.trim() || !session) return;
    setSending(true);
    const msgToSend = userText;
    setUserText('');
    try {
      const updated = await api.sendGDMessage(session.session_id, msgToSend);
      setSession(updated);
    } catch (err) {
      console.warn('Send GD message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleCompleteGD = async () => {
    if (!session) return;
    try {
      const report = await api.completeGDSession(session.session_id);
      setEvaluation(report);
      triggerConfetti();
    } catch (err) {
      console.warn('Complete GD error:', err);
    }
  };

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-lavender selection:text-foreground transition-colors duration-200">
      <Navbar />

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-4xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="01" label="Boardroom Dynamics" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.05]">
                Lead without<br />dominating.
              </h1>
              <p className="text-xs text-foreground-secondary">
                5-candidate panel evaluating intervention timing, articulation, and diplomatic leadership.
              </p>
            </div>

            {!evaluation && (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs px-3 py-1.5 rounded-full border border-border flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeFormatted}</span>
                </span>
                <Button variant="secondary" size="sm" onClick={handleCompleteGD}>
                  Conclude Round
                </Button>
              </div>
            )}
          </div>

          {!evaluation ? (
            <div className="space-y-8">
              {/* Topic & Panelists Row */}
              <div className="p-6 border border-border bg-surface rounded-2xl space-y-4">
                <span className="text-[10px] uppercase tracking-wider text-foreground-muted block font-medium">
                  Discussion Agenda
                </span>
                <h3 className="font-serif text-2xl font-normal leading-snug">
                  &ldquo;{session?.topic || topic}&rdquo;
                </h3>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <span className="text-[11px] font-sans text-foreground px-3 py-1 rounded-full border border-primary">
                    You (Candidate)
                  </span>
                  {session?.participants.map(p => (
                    <span
                      key={p.id}
                      className="text-[11px] font-sans text-foreground-secondary px-3 py-1 rounded-full border border-border"
                    >
                      {p.name} · {p.role_type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dialogue Stream */}
              <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 space-y-6 min-h-[380px] max-h-[520px] overflow-y-auto">
                {session?.messages.map((m, i) => {
                  const isUser = m.sender_type === 'user';
                  return (
                    <div key={m.id || i} className={`space-y-1.5 ${isUser ? 'pl-8' : 'pr-8'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isUser ? 'text-foreground' : 'text-foreground-secondary'}`}>
                          {m.speaker_name}
                        </span>
                        {m.speaker_persona && (
                          <span className="text-[10px] uppercase tracking-wider text-foreground-muted">
                            ({m.speaker_persona})
                          </span>
                        )}
                      </div>
                      <p className={`font-serif text-sm sm:text-base leading-relaxed ${
                        isUser ? 'text-foreground font-medium' : 'text-foreground-secondary'
                      }`}>
                        {m.message}
                      </p>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Action Bar */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userText}
                    onChange={e => setUserText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Articulate your thesis, cite empirical trade-offs, or diplomatically intervene..."
                    className="flex-1 px-5 py-3 border border-border bg-surface rounded-full text-xs font-serif sm:text-sm focus:outline-hidden"
                  />
                  <Button variant="pill-dark" size="md" disabled={sending} onClick={handleSendMessage}>
                    <span>Intervene</span>
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-[11px] text-foreground-muted px-2">
                  Tip: Acknowledge previous viewpoints before presenting divergent evidence.
                </p>
              </div>
            </div>
          ) : (
            /* Post-GD Scorecard */
            <div className="space-y-12">
              <div className="space-y-4 border-b border-border pb-8">
                <SectionLabel number="00" label="Session Audit" />
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal">
                      Roundtable Rubric Report
                    </h2>
                    <p className="text-xs uppercase tracking-wider text-foreground-secondary pt-2">
                      Topic: &ldquo;{session?.topic}&rdquo;
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-foreground-secondary block">Score</span>
                    <span className="font-serif text-6xl font-normal block">{evaluation.overall_score}</span>
                  </div>
                </div>
              </div>

              {/* 6 Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ProgressLine label="Diplomatic Leadership" value={evaluation.leadership_score} metric={`${evaluation.leadership_score}%`} color="dark" />
                <ProgressLine label="Interruption Management" value={evaluation.interruption_handling_score} metric={`${evaluation.interruption_handling_score}%`} color="lavender" />
                <ProgressLine label="Argument Quality & Evidence" value={evaluation.argument_quality_score} metric={`${evaluation.argument_quality_score}%`} color="mint" />
                <ProgressLine label="Logical Rigor" value={evaluation.logical_reasoning_score} metric={`${evaluation.logical_reasoning_score}%`} color="pink" />
                <ProgressLine label="Turn Balance & Cadence" value={evaluation.participation_balance_score} metric={`${evaluation.participation_balance_score}%`} color="blue" />
                <ProgressLine label="Communicative Articulation" value={evaluation.communication_score} metric={`${evaluation.communication_score}%`} color="dark" />
              </div>

              {/* Strengths & Cadence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-border">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold block">Observed Strengths</span>
                  <ul className="space-y-1.5 text-xs text-foreground-secondary">
                    {evaluation.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-serif">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold block">Cadence Analysis</span>
                  <p className="text-xs text-foreground-secondary leading-relaxed">
                    {evaluation.speaking_analysis}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="secondary" size="md" onClick={startNewGDRoom}>
                  Configure New Chamber
                </Button>
                <Link href="/dashboard">
                  <Button variant="pill-dark" size="md">
                    Return to Studio
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </main>

      <Footer />
    </div>
  );
}
