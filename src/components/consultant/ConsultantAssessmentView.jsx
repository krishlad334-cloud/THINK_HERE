import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LogOut } from 'lucide-react';
import { useApp } from '../../context/useApp';
import Logo from '../common/Logo';
import AssessmentResults from './AssessmentResults';
import AssessmentReviewModal from './AssessmentReviewModal';
import { CONSULTANT_QUESTIONS, PASSING_THRESHOLD } from '../../data/consultantExamQuestions';

const AUTO_ADVANCE_DELAY_MS = 300;

export default function ConsultantAssessmentView({
  onComplete,
  onBackToLanding,
}) {
  const { currentUser, updateUserProfile, showToast, logoutUser } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const autoAdvanceTimerRef = useRef(null);

  const totalQuestions = CONSULTANT_QUESTIONS.length;
  const currentQ = CONSULTANT_QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearAutoAdvance, [clearAutoAdvance]);

  const handleSelectOption = (optionId) => {
    if (isSubmitted) return;
    const clickedIndex = currentIndex;
    const questionId = currentQ.id;

    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    clearAutoAdvance();

    autoAdvanceTimerRef.current = setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      if (clickedIndex < totalQuestions - 1) {
        setCurrentIndex(clickedIndex + 1);
      } else {
        setShowReviewModal(true);
      }
    }, AUTO_ADVANCE_DELAY_MS);
  };

  const handlePrev = () => {
    clearAutoAdvance();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    clearAutoAdvance();
    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
  };

  const handleSubmitTest = () => {
    clearAutoAdvance();
    const correctCount = CONSULTANT_QUESTIONS.reduce(
      (sum, q) => (answers[q.id] === q.correctAnswer ? sum + 1 : sum),
      0
    );

    setScore(correctCount);
    setIsSubmitted(true);
    setShowReviewModal(false);

    const hasPassed = correctCount >= PASSING_THRESHOLD;

    if (currentUser?.id) {
      updateUserProfile(currentUser.id, {
        assessmentPassed: hasPassed,
        isVerified: hasPassed,
        assessmentScore: `${correctCount}/${totalQuestions}`,
        assessmentScoreNum: correctCount,
        assessmentCompletedAt: new Date().toISOString(),
      });
    }

    if (hasPassed) {
      showToast(
        'Exam Passed!',
        `Congratulations! You answered ${correctCount}/${totalQuestions} correctly. Welcome to the Consultant Workspace!`,
        'success'
      );
    } else {
      showToast(
        'Qualification Incomplete',
        `You answered ${correctCount}/${totalQuestions} correctly. At least ${PASSING_THRESHOLD} right answers are required to continue as a consultant.`,
        'error'
      );
    }
  };

  const handleRetake = () => {
    clearAutoAdvance();
    setAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-950 overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-16 px-4 sm:px-8 lg:px-12 w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Logo size="sm" showTagline={false} />
          <div className="hidden sm:block h-5 w-px bg-slate-200 mx-0.5" />
          <span className="hidden sm:inline text-xs font-bold text-slate-800 truncate">
            Consultant Qualification Exam
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="hidden md:inline-block text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 shadow-2xs">
            Pass {PASSING_THRESHOLD}/{totalQuestions} Required
          </span>
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          )}
          <button
            type="button"
            onClick={logoutUser}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col justify-center">
        {!isSubmitted ? (
          <div className="w-full my-auto animate-in fade-in duration-300 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 px-4 sm:px-6 py-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Complete Qualification Exam to Enter Consultant Workspace
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecting any option automatically advances to the next question. Score at least {PASSING_THRESHOLD} of {totalQuestions} to pass.
                </p>
              </div>
              <span className="self-start sm:self-center flex-shrink-0 text-[11px] font-bold text-[#0891b2] bg-[#ecfeff] border border-[#0891b2]/25 px-3 py-1 rounded-full">
                Auto-Next Active
              </span>
            </div>

            <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
              <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0891b2] to-[#22d3ee] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="px-4 sm:px-7 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-2 sm:gap-3 bg-white">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="px-3 py-1 rounded-xl bg-[#020617] text-white text-xs font-black shadow-2xs flex-shrink-0">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-bold text-cyan-900 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200/80 truncate max-w-full">
                    {currentQ.category}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/80 flex items-center gap-1 flex-shrink-0">
                  <span className="text-slate-400 font-normal hidden sm:inline">Answered: </span>
                  <span className="text-[#0891b2] font-black">{answeredCount}</span>
                  <span className="text-slate-400">/{totalQuestions}</span>
                </div>
              </div>

              <div className="p-4 sm:p-7 lg:p-8 space-y-5 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug tracking-tight">
                  {currentQ.question}
                </h2>

                <div className="space-y-2.5 sm:space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-center gap-3.5 group select-none ${
                          isSelected
                            ? 'border-[#0891b2] bg-[#ecfeff]/80 shadow-xs ring-4 ring-[#0891b2]/10 scale-[1.002]'
                            : 'border-slate-200/80 bg-white hover:border-[#0891b2]/40 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[#0891b2] text-white shadow-md shadow-[#0891b2]/25'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-[#ecfeff] group-hover:text-[#0891b2]'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : opt.id}
                        </div>

                        <p
                          className={`text-xs sm:text-sm leading-relaxed font-medium transition-colors ${
                            isSelected
                              ? 'text-slate-950 font-bold'
                              : 'text-slate-700 group-hover:text-slate-900'
                          }`}
                        >
                          {opt.text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 sm:px-7 py-3.5 sm:py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="px-3.5 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <span className="hidden sm:inline text-slate-400">Question</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#020617] text-white text-xs font-black">
                    {currentIndex + 1}
                  </span>
                  <span className="text-slate-400">of {totalQuestions}</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="hidden md:inline text-[#0891b2] font-semibold">
                    {PASSING_THRESHOLD}+ right to pass
                  </span>
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0891b2] to-[#0e7490] hover:from-[#06b6d4] hover:to-[#0891b2] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-900/15 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      clearAutoAdvance();
                      setShowReviewModal(true);
                    }}
                    className="px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Submit Exam</span>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <AssessmentResults
            score={score}
            answers={answers}
            onComplete={onComplete}
            onRetake={handleRetake}
          />
        )}
      </main>

      <AssessmentReviewModal
        isOpen={showReviewModal}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onCancel={() => setShowReviewModal(false)}
        onConfirm={handleSubmitTest}
      />

      <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 w-full">
        OverThink Verified Consultant Certification • 24-Hour Human Guidance Standards
      </footer>
    </div>
  );
}
