import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ChevronRight, CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import ProgressRing from '../components/ui/ProgressRing';
import Modal from '../components/ui/Modal';
import { mockLearning } from '../data/mockLearning';
import type { LearningModule, Lesson, QuizQuestion } from '../types';

export default function Learning() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const totalPoints = mockLearning.reduce((sum, m) => sum + (m.isCompleted ? m.points : Math.round(m.points * m.progress / 100)), 0);
  const completedModules = mockLearning.filter((m) => m.isCompleted).length;

  const handleQuizSubmit = () => setShowResults(true);

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
  };

  const levelColors: Record<string, string> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  };

  return (
    <PageWrapper title="Financial Learning" subtitle="Build your financial literacy with interactive lessons and quizzes">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{totalPoints}</p>
              <p className="text-xs text-slate-400">Points Earned</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{completedModules}/{mockLearning.length}</p>
              <p className="text-xs text-slate-400">Completed</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{completedModules}</p>
              <p className="text-xs text-slate-400">Badges Earned</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {Math.round(mockLearning.reduce((s, m) => s + m.progress, 0) / mockLearning.length)}%
              </p>
              <p className="text-xs text-slate-400">Overall Progress</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mockLearning.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard hover padding="p-5" onClick={() => setSelectedModule(mod)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mod.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{mod.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={levelColors[mod.level] as any} size="sm">{mod.level}</Badge>
                      <span className="text-xs text-slate-400">{mod.points} pts</span>
                    </div>
                  </div>
                </div>
                <ProgressRing progress={mod.progress} size={50} strokeWidth={4} color={mod.isCompleted ? '#10b981' : '#3b82f6'} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{mod.description}</p>

              {/* Lesson bullets */}
              <div className="space-y-1.5 mb-4">
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-2">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                    )}
                    <span className={`text-xs ${lesson.isCompleted ? 'text-slate-400' : 'text-slate-300'}`}>{lesson.title}</span>
                  </div>
                ))}
              </div>

              {mod.isCompleted && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                  <span className="text-sm">{mod.badge}</span>
                  <span className="text-xs text-emerald-400 font-medium">Completed!</span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Module Detail Modal */}
      <Modal isOpen={!!selectedModule && !activeLesson} onClose={() => setSelectedModule(null)} title={`${selectedModule?.icon} ${selectedModule?.title}`} size="lg">
        {selectedModule && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">{selectedModule.description}</p>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-700/50">
              <ProgressRing progress={selectedModule.progress} size={60} strokeWidth={5} color="#3b82f6" />
              <div>
                <p className="text-sm text-white font-medium">{selectedModule.progress}% Complete</p>
                <p className="text-xs text-slate-400">{selectedModule.lessons.filter(l => l.isCompleted).length}/{selectedModule.lessons.length} lessons</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-bold text-amber-400">{selectedModule.points} pts</p>
                <p className="text-xs text-slate-400">{selectedModule.badge}</p>
              </div>
            </div>

            {selectedModule.lessons.map((lesson) => (
              <motion.button
                key={lesson.id}
                whileHover={{ x: 4 }}
                onClick={() => { setActiveLesson(lesson); setQuizMode(false); resetQuiz(); }}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-dark-700/30 hover:bg-dark-600/30 transition-colors text-left"
              >
                {lesson.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-500 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{lesson.title}</p>
                  <p className="text-xs text-slate-400">{lesson.quiz.length} quiz question{lesson.quiz.length > 1 ? 's' : ''}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </motion.button>
            ))}
          </div>
        )}
      </Modal>

      {/* Lesson Reader Modal */}
      <Modal isOpen={!!activeLesson} onClose={() => { setActiveLesson(null); resetQuiz(); }} title={activeLesson?.title || ''} size="xl">
        {activeLesson && (
          <div className="space-y-6">
            {!quizMode ? (
              <>
                {/* Render lesson content as styled text */}
                <div className="prose prose-invert prose-sm max-w-none">
                  {activeLesson.content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(3)}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-white mt-3 mb-1">{line.slice(4)}</h3>;
                    if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-emerald-500 pl-3 my-2 text-sm text-emerald-300 italic">{line.slice(2)}</blockquote>;
                    if (line.startsWith('- **')) {
                      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
                      if (match) return <p key={i} className="text-sm text-slate-300 ml-4 my-1"><strong className="text-white">{match[1]}</strong>: {match[2]}</p>;
                    }
                    if (line.startsWith('- ')) return <p key={i} className="text-sm text-slate-300 ml-4 my-1">• {line.slice(2)}</p>;
                    if (line.startsWith('| ')) return null; // Skip tables for simplicity
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-slate-300 my-1 leading-relaxed">{line}</p>;
                  })}
                </div>

                <button
                  onClick={() => setQuizMode(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20 text-purple-400 font-semibold text-sm hover:text-white transition-all"
                >
                  📝 Take Quiz
                </button>
              </>
            ) : (
              /* Quiz Mode */
              <div className="space-y-6">
                {activeLesson.quiz.map((q, qi) => (
                  <div key={qi} className="space-y-3">
                    <p className="text-sm font-medium text-white">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = quizAnswers[qi] === oi;
                        const isCorrect = showResults && oi === q.correctIndex;
                        const isWrong = showResults && isSelected && oi !== q.correctIndex;

                        return (
                          <button
                            key={oi}
                            onClick={() => !showResults && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                              isCorrect
                                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                                : isWrong
                                ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400'
                                : isSelected
                                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                                : 'bg-dark-700/50 border border-border-primary text-slate-300 hover:border-border-hover'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                      >
                        <p className="text-xs text-emerald-300">💡 {q.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                ))}

                {!showResults ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < activeLesson.quiz.length}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm disabled:opacity-30"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/15 text-center">
                    <p className="text-lg font-bold text-white mb-1">
                      Score: {activeLesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length}/{activeLesson.quiz.length}
                    </p>
                    <p className="text-xs text-slate-400">Great effort! Keep learning 🎉</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
