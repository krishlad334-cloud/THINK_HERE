import React from 'react';
import { TOPIC_SUGGESTIONS } from '../../data/mockSeedData';

export default function ClientTopicStarters({ firstName, onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-3xl mx-auto space-y-6 pt-6">
      <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center">
        <img src="/logo.svg" alt="OverThink" className="w-full h-full object-contain" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What's on your mind today, {firstName}?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Start a new thought, question, or business challenge. Receive verified human consultation within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left pt-2">
        {TOPIC_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt(suggestion.prompt)}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-[#020617] hover:bg-white hover:shadow-xs cursor-pointer transition-all group"
          >
            <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#020617] mb-1">
              {suggestion.label}
            </h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              "{suggestion.prompt}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
