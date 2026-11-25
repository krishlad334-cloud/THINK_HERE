import React from 'react';
import { useApp } from '../../context/useApp';
import UserAvatar from '../common/UserAvatar';
import { Bookmark, ArrowRight, Printer } from 'lucide-react';

export default function SavedSolutionsView() {
  const { thoughts, setSelectedThoughtId, toggleSaveThought } = useApp();

  const savedThoughts = thoughts.filter(t => t.isSaved);

  return (
    <div className="space-y-6 w-full pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
            <span>My Saved Solutions & Roadmaps</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access your bookmarked action plans, architectures, and consultant strategies anytime
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print All Saved</span>
        </button>
      </div>

      {savedThoughts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No saved solutions yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When reviewing roadmaps from consultants or AI, click the bookmark icon to save them for easy reference.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedThoughts.map((thought) => {
            const latestSol = thought.solutions?.[0];

            return (
              <div
                key={thought.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {thought.category}
                    </span>
                    <button
                      onClick={() => toggleSaveThought(thought.id)}
                      className="text-amber-500 hover:text-slate-400 p-1"
                      title="Remove from saved"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {thought.title}
                  </h3>

                  {latestSol && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <UserAvatar
                          src={latestSol.author.avatar}
                          name={latestSol.author.name}
                          size="xs"
                        />
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">
                          {latestSol.author.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({latestSol.isAIGenerated ? 'AI' : 'Human'})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {latestSol.executiveSummary}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {thought.solutions?.length || 0} solution(s) attached
                  </span>
                  <button
                    onClick={() => setSelectedThoughtId(thought.id)}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Open Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
