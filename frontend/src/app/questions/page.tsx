'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { api } from '@/lib/api';
import {
  Search,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [masteredIds, setMasteredIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getQuestions(
          selectedCategory === 'All' ? undefined : selectedCategory,
          selectedDifficulty === 'All' ? undefined : selectedDifficulty
        );
        setQuestions(res);
      } catch (err) {
        console.warn('Questions load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, selectedDifficulty]);

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      if (!searchQuery) return true;
      const qText = q.question.toLowerCase();
      const topicText = q.topic.toLowerCase();
      const query = searchQuery.toLowerCase();
      return qText.includes(query) || topicText.includes(query);
    });
  }, [questions, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <Navbar />

      

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-12 py-10 lg:py-14 space-y-12 max-w-5xl overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-8">
            <div className="space-y-3 max-w-xl">
              <SectionLabel number="06" label="Concept Intelligence Bank" />
              <h1 className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-foreground leading-[1.02]">
                Curated questions<br />& model rubrics.
              </h1>
              <p className="text-xs text-foreground-secondary pt-1 leading-relaxed">
                Curated technical and situational interview problems with benchmark expected concepts and rubric answers.
              </p>
            </div>

            <Badge variant="neutral">
              {filteredQuestions.length} Questions Cataloged
            </Badge>
          </div>

          {/* Search and Filters Toolbar */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by topic or question text (e.g. ACID, Threads, STAR)..."
                className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-transparent text-xs text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-full border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
              >
                <option value="All" className="bg-surface">All Disciplines</option>
                <option value="Technical" className="bg-surface">Technical</option>
                <option value="HR" className="bg-surface">Behavioral / HR</option>
                <option value="Coding" className="bg-surface">Coding / DSA</option>
                <option value="GD" className="bg-surface">Group Discussion</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 rounded-full border border-border bg-transparent text-xs text-foreground focus:border-primary focus:outline-hidden cursor-pointer"
              >
                <option value="All" className="bg-surface">All Difficulties</option>
                <option value="Easy" className="bg-surface">Easy</option>
                <option value="Medium" className="bg-surface">Medium</option>
                <option value="Hard" className="bg-surface">Hard</option>
              </select>
            </div>
          </div>

          {/* Questions Feed */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="p-8 rounded-2xl border border-border bg-surface animate-pulse space-y-4"
                >
                  <div className="h-4 bg-surface-muted rounded w-1/4" />
                  <div className="h-6 bg-surface-muted rounded w-3/4" />
                  <div className="h-3 bg-surface-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map(q => {
                const isRevealed = revealedIds[q.id];
                const isMastered = masteredIds[q.id];

                return (
                  <div
                    key={q.id}
                    className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                      isMastered
                        ? 'bg-surface-muted border-primary'
                        : 'bg-surface border-border hover:border-primary'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">{q.category}</Badge>
                        <span className="text-[11px] text-foreground-secondary">
                          Topic: {q.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            q.difficulty === 'Easy'
                              ? 'mint'
                              : q.difficulty === 'Medium'
                              ? 'lavender'
                              : 'pink'
                          }
                        >
                          {q.difficulty}
                        </Badge>

                        <button
                          type="button"
                          onClick={() => toggleMastered(q.id)}
                          className={`p-1 rounded-full transition-colors cursor-pointer ${
                            isMastered
                              ? 'text-foreground'
                              : 'text-foreground-muted hover:text-foreground'
                          }`}
                          title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground leading-snug">
                      {q.question}
                    </h3>

                    {/* Expected Concepts */}
                    <div className="mt-4 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-foreground-muted mr-1">
                        Keywords:
                      </span>
                      {q.expected_concepts.map((concept: string) => (
                        <span
                          key={concept}
                          className="text-[10px] font-sans px-2.5 py-0.5 rounded-full border border-border text-foreground-secondary"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    {/* Collapsible Model Answer */}
                    <div className="mt-6 pt-4 border-t border-border">
                      <button
                        type="button"
                        onClick={() => toggleReveal(q.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground hover:underline cursor-pointer"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isRevealed ? 'Hide Model Benchmark' : 'Reveal Model Benchmark'}</span>
                      </button>

                      {isRevealed && (
                        <div className="mt-4 p-5 rounded-xl border border-border bg-surface-muted font-serif text-xs sm:text-sm text-foreground leading-relaxed">
                          <span className="font-sans text-foreground-muted dark:text-foreground-muted text-[10px] uppercase tracking-wider block mb-2">
                            Evaluator Rubric & Model Answer:
                          </span>
                          {q.model_answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
    </div>
  );
}
