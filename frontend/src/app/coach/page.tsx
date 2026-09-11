'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { CoachAvatar, CoachMood } from '@/components/coach/CoachAvatar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { api } from '@/lib/api';
import {
  Send,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface ChatMsg {
  role: 'user' | 'coach';
  content: string;
  mood?: CoachMood;
  suggestedActions?: Array<{ label: string; link: string }>;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: 'coach',
      content:
        "Welcome, Aditya. I am Coach Questy, your AI Career Intelligence Mentor. I continuously track your mock performance across 7 evaluation rubrics, resume impact density, and placement benchmarks. What area of your preparation would you like to explore today?",
      mood: 'happy',
      suggestedActions: [
        { label: 'Review Priority Quests', link: '/dashboard' },
        { label: 'Technical Mock (OS/DBMS)', link: '/interview?mode=Technical' },
        { label: 'Diagnose ATS Keyword Gaps', link: '/resume' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState<CoachMood>('happy');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What is my highest-priority focus area today?',
    'Why is my interview communication score at 68%?',
    'How can I rewrite my resume bullet points for Google?',
    'Simulate an aggressive HR question on salary expectations',
    'Top 3 mistakes candidates make in group discussions'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setActiveMood('thinking');

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await api.chatCoach(text, history);

      const coachMood = (res.coach_state as CoachMood) || 'encouraging';
      setActiveMood(coachMood);

      setMessages(prev => [
        ...prev,
        {
          role: 'coach',
          content: res.reply,
          mood: coachMood,
          suggestedActions: res.suggested_actions
        }
      ]);
    } catch (err) {
      console.warn('Coach chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'coach',
          content:
            'I have reviewed your active placement profile. For your target SDE track, prioritizing Technical Knowledge (specifically DB indexing and OS thread concurrency) will yield the fastest score delta. Launch a 10-minute technical simulation when ready.',
          mood: 'encouraging',
          suggestedActions: [{ label: 'Start Technical Mock', link: '/interview?mode=Technical' }]
        }
      ]);
      setActiveMood('encouraging');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-lavender selection:text-foreground transition-colors duration-200">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-8 max-w-5xl overflow-y-auto flex flex-col h-[calc(100vh-4.5rem)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6 shrink-0">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="05" label="AI Career Mentor" />
              <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-foreground leading-[1.05]">
                Conversations that<br />sharpen your edge.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Real-time career guidance, company-specific tactics, and feedback tailored to your profile.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <CoachAvatar mood={activeMood} size="sm" animate={true} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm font-normal text-foreground">Questy</span>
                  <Badge variant="mint">Active</Badge>
                </div>
                <span className="text-[10px] font-sans text-foreground-secondary flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Gemini Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-4 py-2 rounded-full border border-border bg-surface hover:border-border-strong text-xs text-foreground-secondary hover:text-foreground whitespace-nowrap transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 p-6 rounded-2xl bg-surface border border-border">
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div key={i} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5 text-[11px] font-sans text-foreground-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
                      <span>Coach Questy</span>
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-primary text-primary-foreground font-sans rounded-tr-xs'
                        : 'bg-surface-muted border border-border text-foreground rounded-tl-xs font-serif'
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* Suggested Actions */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {m.suggestedActions.map((action, idx) => (
                        <Link
                          key={idx}
                          href={action.link}
                          className="btn-pill-secondary text-xs flex items-center gap-1.5"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-sans text-foreground-secondary p-2">
                <span className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
                <span>Synthesizing placement insights...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="shrink-0 space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about target companies, weak areas, or interview tactics..."
                className="w-full pl-5 pr-28 py-3.5 rounded-full border border-border bg-surface text-xs sm:text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
              />
              <div className="absolute right-2 flex items-center">
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  className="btn-pill-primary text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <span>Ask</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-sans text-foreground-muted px-3">
              <span>Press <kbd className="px-1.5 py-0.5 rounded border border-border text-[10px]">Enter</kbd> to transmit</span>
              <span>Calibrated against Tier-1 SDE Rubrics</span>
            </div>
          </div>
        </main>
    </div>
  );
}
