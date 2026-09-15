import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Trophy, CheckCircle2, Star, ChevronRight, 
  BookOpen, HelpCircle, X, Award, Sparkles, ArrowRight, Play 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ThemeSelector from '../components/ThemeSelector';
import { useStore } from '../store/useStore';
import { mockLearning } from '../data/mockLearning';
import type { LearningModule, Lesson } from '../types';

export default function Learning() {
  const { user } = useStore();
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeLevel, setActiveLevel] = useState('all');

  const totalPoints = mockLearning.reduce((sum, m) => sum + (m.isCompleted ? m.points : Math.round(m.points * m.progress / 100)), 0);
  const completedCount = mockLearning.filter(m => m.isCompleted).length;

  const filteredModules = mockLearning.filter(m => activeLevel === 'all' || m.level === activeLevel);

  const handleOpenModule = (mod: LearningModule) => {
    setSelectedModule(mod);
    setActiveLesson(mod.lessons[0] || null);
    setQuizMode(false);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateScore = () => {
    if (!activeLesson?.quiz) return 0;
    return activeLesson.quiz.reduce((score: number, q: { correctIndex: number }, idx: number) => {
      return score + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  return (
    <div className="flex bg-transparent text-[var(--text-main)] w-full font-sans">
      <Sidebar activeId="sustainability" />

      <main className="flex-1 lg:ml-64 relative min-h-screen flex flex-col z-10 overflow-y-auto w-full">
        {/* Topbar */}
        <header className="px-8 py-5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[var(--text-main)]">Financial Education Academy</h1>
              <p className="text-xs text-[var(--text-muted)]">Master investing, tax planning & compounding</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />
            <div className="flex items-center gap-3 px-3 py-1.5 border rounded-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
                <span className="text-white text-xs font-bold">{user?.name?.[0] || 'U'}</span>
              </div>
              <span className="text-xs font-bold text-[var(--text-main)]">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
          
          {/* Stats Header Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.2)' }}>
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-main)]">{totalPoints} pts</p>
                <p className="text-xs text-[var(--text-muted)]">Knowledge Points Earned</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--border-card)' }}>
                <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-main)]">{completedCount}/{mockLearning.length}</p>
                <p className="text-xs text-[var(--text-muted)]">Completed Modules</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-main)]">4 Badges</p>
                <p className="text-xs text-[var(--text-muted)]">Verified Achievements</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(56,189,248,0.1)', borderColor: 'rgba(56,189,248,0.2)' }}>
                <Award className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[var(--text-main)]">Intermediate</p>
                <p className="text-xs text-[var(--text-muted)]">Current Investor Tier</p>
              </div>
            </motion.div>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 rounded-full border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              {['all', 'beginner', 'intermediate', 'advanced'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                    activeLevel === lvl ? 'text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                  style={activeLevel === lvl ? { background: 'var(--accent-gradient)' } : {}}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <span className="text-xs text-[var(--text-muted)]">{filteredModules.length} Modules Available</span>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card-lg p-6 flex flex-col justify-between group hover:border-[var(--border-hover)] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl p-3 rounded-2xl border" style={{ background: 'var(--input-bg)', borderColor: 'var(--border-card)' }}>
                      {mod.icon}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      mod.level === 'beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      mod.level === 'intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {mod.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-6 line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-card)' }}>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono">
                      <span className="text-[var(--text-muted)]">Progress</span>
                      <span className="font-bold text-[var(--text-main)]">{mod.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5">
                      <div className="h-full rounded-full transition-all" style={{ width: `${mod.progress}%`, background: 'var(--accent-gradient)' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> +{mod.points} pts
                    </span>
                    <button
                      onClick={() => handleOpenModule(mod)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 hover:brightness-110 transition-all"
                      style={{ background: 'var(--accent-gradient)' }}
                    >
                      <span>{mod.isCompleted ? 'Review' : mod.progress > 0 ? 'Continue' : 'Start'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Lesson & Quiz Modal */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[85vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl"
              style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-hover)' }}
            >
              {/* Modal Header */}
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-card)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedModule.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-main)]">{selectedModule.title}</h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {quizMode ? 'Knowledge Verification Quiz' : `Lesson: ${activeLesson?.title || 'Overview'}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-2 rounded-full hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {!quizMode ? (
                  <>
                    {/* Lesson Navigation Strip */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: 'var(--border-card)' }}>
                      {selectedModule.lessons.map((les, idx) => (
                        <button
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                            activeLesson?.id === les.id 
                              ? 'text-white' 
                              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                          }`}
                          style={activeLesson?.id === les.id ? { background: 'var(--accent-gradient)' } : {}}
                        >
                          {idx + 1}. {les.title}
                        </button>
                      ))}
                      {activeLesson?.quiz && activeLesson.quiz.length > 0 && (
                        <button
                          onClick={() => setQuizMode(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 whitespace-nowrap hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Take Quiz
                        </button>
                      )}
                    </div>

                    {/* Lesson Content */}
                    <div className="prose prose-invert prose-sm max-w-none space-y-4">
                      <div className="whitespace-pre-wrap leading-relaxed text-[var(--text-main)]">
                        {activeLesson?.content || 'No content found for this lesson.'}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Quiz View */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border-card)' }}>
                      <span className="text-sm font-bold text-[var(--text-main)]">Test your understanding</span>
                      <button
                        onClick={() => setQuizMode(false)}
                        className="text-xs text-[var(--accent-primary)] hover:underline"
                      >
                        ← Back to Lessons
                      </button>
                    </div>

                    {activeLesson?.quiz?.map((q: { question: string; options: string[]; correctIndex: number; explanation: string }, qIdx: number) => {
                      const selectedOpt = selectedAnswers[qIdx];
                      return (
                        <div key={qIdx} className="p-4 rounded-2xl border space-y-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                          <p className="text-sm font-bold text-[var(--text-main)]">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = q.correctIndex === optIdx;
                              let btnStyle: React.CSSProperties = { background: 'var(--input-bg)', borderColor: 'var(--border-card)', color: 'var(--text-main)' };
                              
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnStyle = { background: 'rgba(16,185,129,0.2)', borderColor: '#10b981', color: '#10b981' };
                                } else if (isSelected && !isCorrect) {
                                  btnStyle = { background: 'rgba(244,63,94,0.2)', borderColor: '#f43f5e', color: '#f43f5e' };
                                }
                              } else if (isSelected) {
                                btnStyle = { background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' };
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(qIdx, optIdx)}
                                  className="w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between"
                                  style={btnStyle}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {quizSubmitted && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl border text-center space-y-2" style={{ background: 'var(--accent-glow-subtle)', borderColor: 'var(--accent-primary)' }}>
                        <p className="text-lg font-extrabold text-[var(--accent-primary)]">
                          You scored {calculateScore()} / {activeLesson?.quiz?.length || 0}!
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          +{selectedModule?.points} knowledge points added to your profile badge!
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-card)' }}>
                {!quizMode ? (
                  <>
                    <span className="text-xs text-[var(--text-muted)]">Completed lessons count towards investor certification</span>
                    {activeLesson?.quiz && activeLesson.quiz.length > 0 && (
                      <button
                        onClick={() => setQuizMode(true)}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 hover:brightness-110 transition-all"
                        style={{ background: 'var(--accent-gradient)' }}
                      >
                        <span>Start Module Quiz</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      Reset Answers
                    </button>
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white hover:brightness-110 transition-all"
                        style={{ background: 'var(--accent-gradient)' }}
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedModule(null)}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white hover:brightness-110 transition-all"
                        style={{ background: 'var(--accent-gradient)' }}
                      >
                        Done
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
