import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  GraduationCap,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { CONSULTANT_QUESTIONS, PASSING_THRESHOLD } from '../../data/consultantExamQuestions';

export default function AssessmentResults({ score, answers, onComplete, onRetake }) {
  const totalQuestions = CONSULTANT_QUESTIONS.length;
  const isPassed = score >= PASSING_THRESHOLD;

  return (
    <div className="w-full space-y-6 animate-in zoom-in-95 duration-400">
      <div
        className={`p-6 sm:p-10 rounded-3xl border-2 text-center space-y-5 shadow-xl ${
          isPassed
            ? 'bg-gradient-to-b from-[#ecfeff] to-white border-[#22d3ee]'
            : 'bg-gradient-to-b from-rose-50 to-white border-rose-300'
        }`}
      >
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform animate-bounce">
          {isPassed ? (
            <div className="w-full h-full rounded-3xl bg-[#0891b2] text-white flex items-center justify-center shadow-cyan-500/30">
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          ) : (
            <div className="w-full h-full rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-rose-500/30">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          )}
        </div>

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
              isPassed
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {isPassed
              ? 'Official Verified Consultant Qualification'
              : 'Qualification Threshold Not Met'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isPassed
              ? 'Congratulations, You Passed!'
              : 'Exam Incomplete — Minimum 10 Correct Answers Required'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
            {isPassed
              ? `You scored ${score} of 15 questions correctly (Required: 10/15). You have met the qualification standards and are now authorized to enter the Consultant Workspace!`
              : `You scored ${score} of 15 questions correctly. At least 10 correct answers are strictly required to access client briefs and consultations. Please review the answers below and retake the exam.`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-lg mx-auto pt-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div
              className={`text-2xl sm:text-3xl font-black font-mono ${
                isPassed ? 'text-[#0891b2]' : 'text-rose-600'
              }`}
            >
              {score}/{totalQuestions}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Your Score</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div
              className={`text-2xl sm:text-3xl font-black font-mono ${
                isPassed ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {isPassed ? 'Qualified' : `${PASSING_THRESHOLD - score} Needed`}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              {isPassed ? 'Status' : 'To Pass'}
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">10/15</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Minimum Required
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isPassed ? (
            <button
              type="button"
              onClick={onComplete}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#020617] hover:bg-[#091528] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#020617]/25 cursor-pointer transition-all transform active:scale-98"
            >
              <span>Enter Consultant Workspace</span>
              <ArrowRight className="w-4 h-4 text-[#22d3ee]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment (Try Again)</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col gap-2 pb-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="min-w-0 text-base font-extrabold text-slate-900 tracking-tight flex items-start gap-2 sm:items-center">
            <GraduationCap className="w-5 h-5 text-[#0891b2] flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="min-w-0">Exam Question Breakdown & Explanations</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold sm:flex-shrink-0 sm:text-right">
            Review all {totalQuestions} questions
          </span>
        </div>

        <div className="space-y-4 pt-1">
          {CONSULTANT_QUESTIONS.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const chosenOpt = q.options.find((o) => o.id === userAnswer);
            const correctOpt = q.options.find((o) => o.id === q.correctAnswer);

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-rose-200 bg-rose-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{q.category}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                  {q.question}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-500 w-24 flex-shrink-0">
                      Your Answer:
                    </span>
                    <span
                      className={`font-semibold ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {chosenOpt ? `(${chosenOpt.id}) ${chosenOpt.text}` : 'No answer selected'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700 w-24 flex-shrink-0">
                        Correct Answer:
                      </span>
                      <span className="font-semibold text-emerald-800">
                        ({correctOpt.id}) {correctOpt.text}
                      </span>
                    </div>
                  )}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 mt-2 leading-relaxed">
                    <strong>Standard:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
