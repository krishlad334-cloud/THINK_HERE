import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { JOB_INDUSTRIES, WORK_MODE_FILTERS } from '../../data/jobsCatalog';

export default function JobFiltersBar({
  jobs,
  selectedIndustry,
  onSelectIndustry,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  hasResume,
  onResetFilters,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    if (!isFilterOpen) return undefined;
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  const activeFilterCount =
    (selectedIndustry !== 'All Industries' ? 1 : 0) + (selectedType !== 'All' ? 1 : 0);

  const getIndustryCount = (industry) => {
    if (industry === 'All Industries') return jobs.length;
    return jobs.filter((job) => job.industry === industry).length;
  };

  return (
    <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
      <div className="relative flex items-center gap-2 sm:gap-2.5" ref={filterMenuRef}>
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles, skills, or companies..."
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={`flex-shrink-0 px-3 sm:px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap ${
            isFilterOpen || activeFilterCount > 0
              ? 'bg-[#020617] text-white border-[#020617] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#0891b2] text-white text-[10px] font-extrabold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isFilterOpen && (
          <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black text-slate-900">Filter Opportunities</span>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[11px] font-semibold text-[#0891b2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="job-industry-filter"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                Industry / Sector
              </label>
              <select
                id="job-industry-filter"
                value={selectedIndustry}
                onChange={(e) => onSelectIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] cursor-pointer"
              >
                {JOB_INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry} ({getIndustryCount(industry)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="job-mode-filter"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                Work Type & View
              </label>
              <select
                id="job-mode-filter"
                value={selectedType}
                onChange={(e) => onSelectType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#020617]/20 focus:border-[#020617] cursor-pointer"
              >
                {WORK_MODE_FILTERS.filter((mode) => hasResume || mode !== 'Recommended').map(
                  (mode) => (
                    <option key={mode} value={mode}>
                      {mode === 'Recommended' ? 'Recommended for My Resume' : mode}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold cursor-pointer"
              >
                Show Jobs
              </button>
            </div>
          </div>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-400">Active:</span>
            {selectedIndustry !== 'All Industries' && (
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                {selectedIndustry}
              </span>
            )}
            {selectedType !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-50 text-cyan-800 font-semibold">
                {selectedType === 'Recommended' ? 'Recommended Matches' : selectedType}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-bold text-[#0891b2] hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
