import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Send, FileText } from 'lucide-react';

export default function SolutionProposalModal({ thought, onClose }) {
  const { submitSolution, setSelectedThoughtId } = useApp();

  const [diagnostic, setDiagnostic] = useState('');
  const [steps, setSteps] = useState([
    { step: 1, title: 'Immediate Strategic Adjustment', details: '' },
    { step: 2, title: 'Tactical Implementation', details: '' },
    { step: 3, title: 'Validation & Metrics Tracking', details: '' }
  ]);
  const [toolsInput, setToolsInput] = useState('');
  const [nextSteps, setNextSteps] = useState('I invite you to enter our OverThink Consultation Room to review the implementation roadmap live.');

  const handleStepChange = (index, field, value) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { step: prev.length + 1, title: `Phase ${prev.length + 1} Execution`, details: '' }
    ]);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return;
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, step: idx + 1 })));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnostic.trim()) return;

    const recommendedTools = toolsInput
      ? toolsInput.split(',').map(t => t.trim()).filter(Boolean)
      : ['OverThink Consultation Room', 'Architecture Canvas'];

    submitSolution(thought.id, {
      executiveSummary: diagnostic.trim(),
      actionPlan: steps.filter(s => s.details.trim().length > 0),
      recommendedTools,
      nextStepsPrompt: nextSteps
    });

    onClose();
    setSelectedThoughtId(thought.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Deliver Human Consultation Solution</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Providing structured roadmap for: "{thought.title.slice(0, 50)}..."
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Executive Diagnostic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Executive Assessment & Diagnostic *
            </label>
            <textarea
              required
              rows={3}
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
              placeholder="State your expert diagnostic: identify the root causes of the client's problem, industry benchmarks, and immediate leverage points..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Step-by-Step Action Plan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Strategic Action Plan (Step-by-Step)
              </label>
              <button
                type="button"
                onClick={addStep}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((st, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-700">Step {st.step}</span>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="Step Title"
                      className="flex-1 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={st.details}
                    onChange={(e) => handleStepChange(idx, 'details', e.target.value)}
                    placeholder="Specific actionable instructions for this phase..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tooling & Frameworks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Recommended Tools & Frameworks (Comma separated)
            </label>
            <input
              type="text"
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="e.g. PgBouncer, TimescaleDB, LaTeX CV, Miro Canvas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Next Steps & Invitation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Follow-Up & Consultation Room Invitation
            </label>
            <input
              type="text"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Deliver Solution to Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
