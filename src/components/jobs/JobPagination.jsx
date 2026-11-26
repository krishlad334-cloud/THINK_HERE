import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    pages.push('ellipsis-start');
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    pages.push(page);
  }

  if (windowEnd < totalPages - 1) {
    pages.push('ellipsis-end');
  }

  pages.push(totalPages);
  return pages;
}

export default function JobPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pageItems = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Job list pagination"
      className="flex items-center justify-end gap-1 sm:gap-1.5 pt-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {pageItems.map((item) => {
        if (typeof item !== 'number') {
          return (
            <span
              key={item}
              className="w-5 sm:w-8 h-8 sm:h-9 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
            >
              ...
            </span>
          );
        }

        const isActive = item === currentPage;
        const isEdgeOrCurrent = item === 1 || item === totalPages || isActive;

        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={isActive ? 'page' : undefined}
            className={`min-w-8 sm:min-w-9 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer items-center justify-center ${
              isEdgeOrCurrent ? 'flex' : 'hidden sm:flex'
            } ${
              isActive
                ? 'bg-[#020617] text-white border-[#020617] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="h-8 sm:h-9 px-2 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
