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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#E8DEF8] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#6750A4]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C1B1F]">{totalPoints}</p>
              <p className="text-xs font-semibold text-[#49454F]">Points Earned</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#C4EED0] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C1B1F]">{completedModules}/{mockLearning.length}</p>
              <p className="text-xs font-semibold text-[#49454F]">Completed</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#FFE6C8] flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C1B1F]">{completedModules}</p>
              <p className="text-xs font-semibold text-[#49454F]">Badges Earned</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard padding="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#D0BCFF] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#381E72]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#1C1B1F]">
                {Math.round(mockLearning.reduce((s, m) => s + m.progress, 0) / mockLearning.length)}%
              </p>
              <p className="text-xs font-semibold text-[#49454F]">Overall Progress</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {mockLearning.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlassCard hover padding="p-6" onClick={() => setSelectedModule(mod)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mod.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1C1B1F]">{mod.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={levelColors[mod.level] as any} size="sm">{mod.level}</Badge>
                      <span className="text-xs font-semibold text-[#49454F]">{mod.points} pts</span>
                    </div>
                  </div>
                </div>
                <ProgressRing progress={mod.progress} size={50} strokeWidth={4} color={mod.isCompleted ? '#10b981' : '#3b82f6'} />
              </div>

              <p className="text-xs font-medium text-[#49454F] leading-relaxed mb-4">{mod.description}</p>

              {/* Lesson bullets */}
              <div className="space-y-1.5 mb-4">
                {mod.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-2">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#49454F]" />
                    )}
                    <span className={`text-xs font-medium ${lesson.isCompleted ? 'text-[#49454F]' : 'text-[#1C1B1F]'}`}>{lesson.title}</span>
                  </div>
                ))}
              </div>

              {mod.isCompleted && (
                <div className="flex items-center gap-2 p-2 rounded-[8px] bg-[#C4EED0]/30 border border-[#C4EED0]">
                  <span className="text-sm">{mod.badge}</span>
                  <span className="text-xs text-emerald-700 font-bold">Completed!</span>
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
            <p className="text-sm font-medium text-[#1C1B1F]">{selectedModule.description}</p>

            <div className="flex items-center gap-4 p-4 rounded-[16px] bg-[#F3EDF7]">
              <ProgressRing progress={selectedModule.progress} size={60} strokeWidth={5} color="#6750A4" />
              <div>
                <p className="text-sm text-[#1C1B1F] font-bold">{selectedModule.progress}% Complete</p>
                <p className="text-xs font-semibold text-[#49454F]">{selectedModule.lessons.filter(l => l.isCompleted).length}/{selectedModule.lessons.length} lessons</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-bold text-amber-600">{selectedModule.points} pts</p>
                <p className="text-xs font-semibold text-[#49454F]">{selectedModule.badge}</p>
              </div>
            </div>

            {selectedModule.lessons.map((lesson) => (
              <motion.button
                key={lesson.id}
                whileHover={{ x: 4 }}
                onClick={() => { setActiveLesson(lesson); setQuizMode(false); resetQuiz(); }}
                className="w-full flex items-center gap-3 p-4 rounded-[16px] bg-[#FFFBFE] border border-[#E7E0EC] hover:bg-[#F3EDF7] transition-colors text-left"
              >
                {lesson.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[#49454F] shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1C1B1F]">{lesson.title}</p>
                  <p className="text-xs font-semibold text-[#49454F]">{lesson.quiz.length} quiz question{lesson.quiz.length > 1 ? 's' : ''}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#49454F]" />
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
                <div className="prose prose-sm max-w-none text-[#1C1B1F]">
                  {activeLesson.content.split('\n').map((line, i) => {
                    if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-[#1C1B1F] mt-4 mb-2">{line.slice(3)}</h2>;
                    if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-[#1C1B1F] mt-3 mb-1">{line.slice(4)}</h3>;
                    if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[#6750A4] bg-[#E8DEF8] p-3 my-2 text-sm text-[#1D192B] rounded-r-[8px] font-medium">{line.slice(2)}</blockquote>;
                    if (line.startsWith('- **')) {
                      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)/);
                      if (match) return <p key={i} className="text-sm font-medium text-[#49454F] ml-4 my-1"><strong className="font-bold text-[#1C1B1F]">{match[1]}</strong>: {match[2]}</p>;
                    }
                    if (line.startsWith('- ')) return <p key={i} className="text-sm font-medium text-[#49454F] ml-4 my-1">• {line.slice(2)}</p>;
                    if (line.startsWith('| ')) return null; // Skip tables for simplicity
                    if (line.trim() === '') return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm font-medium text-[#49454F] my-1 leading-relaxed">{line}</p>;
                  })}
                </div>

                <button
                  onClick={() => setQuizMode(true)}
                  className="w-full py-3 rounded-[16px] bg-[#6750A4] text-white font-bold text-sm hover:bg-[#523F84] transition-all shadow-sm"
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
                            className={`w-full text-left px-4 py-3 rounded-[12px] text-sm font-medium transition-all ${
                              isCorrect
                                ? 'bg-[#C4EED0]/30 border border-[#C4EED0] text-emerald-700'
                                : isWrong
                                ? 'bg-[#FFD8E4]/30 border border-[#FFD8E4] text-rose-700'
                                : isSelected
                                ? 'bg-[#E8DEF8] border border-[#6750A4] text-[#1D192B]'
                                : 'bg-[#FFFBFE] border border-[#E7E0EC] text-[#49454F] hover:bg-[#F3EDF7]'
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
                        className="p-4 rounded-[16px] bg-[#E8DEF8] border-none"
                      >
                        <p className="text-xs font-semibold text-[#1D192B]">💡 {q.explanation}</p>
                      </motion.div>
                    )}
                  </div>
                ))}

                {!showResults ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < activeLesson.quiz.length}
                    className="w-full py-3 rounded-[16px] bg-[#6750A4] text-white font-bold text-sm disabled:opacity-50 hover:bg-[#523F84] shadow-sm transition-all"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="p-5 rounded-[24px] bg-[#C4EED0]/30 border border-[#C4EED0] text-center">
                    <p className="text-lg font-bold text-emerald-700 mb-1">
                      Score: {activeLesson.quiz.filter((q, i) => quizAnswers[i] === q.correctIndex).length}/{activeLesson.quiz.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-600">Great effort! Keep learning 🎉</p>
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
