import React, { useRef } from 'react';
import { Briefcase, CheckCircle, Upload } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { JOBS_PER_PAGE, useJobHubState } from '../../hooks/useJobHubState';
import ResumeAnalyzerSection from '../jobs/ResumeAnalyzerSection';
import JobFiltersBar from '../jobs/JobFiltersBar';
import JobCard from '../jobs/JobCard';
import JobPagination from '../jobs/JobPagination';
import EasyApplyModal from '../jobs/EasyApplyModal';

export default function ClientJobHub() {
  const { jobs, toggleSaveJob, applyJob, currentUser, showToast } = useApp();
  const listTopRef = useRef(null);

  const {
    isResumeSectionOpen,
    setIsResumeSectionOpen,
    selectedIndustry,
    selectedType,
    searchQuery,
    appliedNotification,
    resumeProfile,
    rankedJobs,
    recommendedJobs,
    filteredJobs,
    visibleJobs,
    totalPages,
    activePage,
    startIndex,
    setCurrentPage,
    activeApplyJob,
    setActiveApplyJobId,
    handleUploadFile,
    handleAnalyzeRawText,
    handleSelectSample,
    handleClearResume,
    handleCloseAndResetResume,
    handleResetFilters,
    handleIndustryChange,
    handleTypeChange,
    handleSearchChange,
    handleConfirmApply,
  } = useJobHubState({ jobs, applyJob, currentUser, showToast });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {isResumeSectionOpen ? (
        <>
          {appliedNotification && (
            <div className="mb-4 p-3 bg-cyan-50 border border-cyan-300 rounded-xl text-cyan-800 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle className="w-4 h-4 text-[#0891b2] flex-shrink-0" />
              <span>{appliedNotification}</span>
            </div>
          )}
          <ResumeAnalyzerSection
            resumeProfile={resumeProfile}
            recommendedJobs={recommendedJobs}
            onUploadFile={handleUploadFile}
            onAnalyzeText={handleAnalyzeRawText}
            onSelectSample={handleSelectSample}
            onToggleSaveJob={toggleSaveJob}
            onApplyJob={(job) => setActiveApplyJobId(job.id)}
            onClearResume={handleClearResume}
            onBackToJobs={() => setIsResumeSectionOpen(false)}
            onCloseAndReset={handleCloseAndResetResume}
          />
        </>
      ) : (
        <div ref={listTopRef} className="space-y-5 sm:space-y-6 w-full pb-16 scroll-mt-4">
          {appliedNotification && (
            <div className="p-3 bg-cyan-50 border border-cyan-300 rounded-xl text-cyan-800 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle className="w-4 h-4 text-[#0891b2] flex-shrink-0" />
              <span>{appliedNotification}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-[#020617] flex-shrink-0" />
                <span>Job & Career Opportunities</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore roles across all 21 industries including IT, healthcare, education, finance, engineering, sales, marketing, government, and more
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsResumeSectionOpen(true)}
              className="self-end sm:self-auto px-4 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer flex-shrink-0"
            >
              <Upload className="w-4 h-4 text-[#22d3ee]" />
              <span>Upload Resume</span>
              {resumeProfile && recommendedJobs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#0891b2] text-white text-[10px] font-extrabold">
                  {recommendedJobs.length}
                </span>
              )}
            </button>
          </div>

          <JobFiltersBar
            jobs={rankedJobs}
            selectedIndustry={selectedIndustry}
            onSelectIndustry={handleIndustryChange}
            selectedType={selectedType}
            onSelectType={handleTypeChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            hasResume={Boolean(resumeProfile)}
            onResetFilters={handleResetFilters}
          />

          <div className="flex items-center justify-between gap-2 px-1">
            <p className="text-xs font-semibold text-slate-500 truncate">
              {filteredJobs.length === 0 ? (
                <>Showing <strong className="text-slate-900">0</strong> jobs</>
              ) : (
                <>
                  Showing{' '}
                  <strong className="text-slate-900">
                    {startIndex + 1}–{Math.min(startIndex + JOBS_PER_PAGE, filteredJobs.length)}
                  </strong>{' '}
                  of <strong className="text-slate-900">{filteredJobs.length}</strong>
                  <span className="hidden sm:inline">
                    {' '}opportunities
                    {selectedIndustry !== 'All Industries'
                      ? ` in ${selectedIndustry}`
                      : ' across 21 industries'}
                  </span>
                  <span className="sm:hidden"> jobs</span>
                </>
              )}
            </p>
            {filteredJobs.length > JOBS_PER_PAGE && (
              <p className="text-xs font-semibold text-slate-500 flex-shrink-0 whitespace-nowrap">
                Page <strong className="text-slate-900">{activePage}</strong> of{' '}
                <strong className="text-slate-900">{totalPages}</strong>
              </p>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <p className="text-sm font-bold text-slate-900">No jobs matched those filters.</p>
              <p className="text-xs text-slate-500">
                Try clearing your search or resetting filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#020617] text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  hasResume={Boolean(resumeProfile)}
                  onToggleSave={toggleSaveJob}
                  onApply={(targetJob) => setActiveApplyJobId(targetJob.id)}
                />
              ))}

              <JobPagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {activeApplyJob && (
        <EasyApplyModal
          key={activeApplyJob.id}
          job={activeApplyJob}
          currentUser={currentUser}
          resumeProfile={resumeProfile}
          onUploadResumeFile={handleUploadFile}
          onSubmitApplication={handleConfirmApply}
          onClose={() => setActiveApplyJobId(null)}
        />
      )}
    </>
  );
}
