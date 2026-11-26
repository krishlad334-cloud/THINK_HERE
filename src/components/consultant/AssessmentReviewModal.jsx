import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AssessmentReviewModal({
  isOpen,
  answeredCount,
  totalQuestions,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0891b2] mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-slate-900">Ready to Submit Your Exam?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You have answered <strong className="text-slate-900">{answeredCount}</strong> of{' '}
            <strong className="text-slate-900">{totalQuestions}</strong> questions.
            <span className="block mt-1 font-bold text-slate-700">
              Passing Requirement: At least 10 correct answers.
            </span>
            {answeredCount < totalQuestions && (
              <span className="text-amber-700 block mt-1.5 font-semibold">
                ⚠️ You have {totalQuestions - answeredCount} unanswered questions! Unanswered questions will be scored as incorrect.
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
          >
            Back to Exam
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
