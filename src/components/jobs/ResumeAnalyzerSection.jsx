import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Sparkles, X } from 'lucide-react';
import { SAMPLE_RESUMES } from '../../data/resumeTaxonomy';
import JobCard from './JobCard';
import JobPagination from './JobPagination';
import ResumeUploadStep from './resume/ResumeUploadStep';
import ResumeScanningStep from './resume/ResumeScanningStep';
import ResumeProfileSummary from './resume/ResumeProfileSummary';

const RECOMMENDED_PER_PAGE = 10;

const UPLOAD_STEPS = [
  { id: 1, title: 'Upload Resume' },
  { id: 2, title: 'Scan & Analyze' },
  { id: 3, title: 'Profile & Matches' },
];

export default function ResumeAnalyzerSection({
  resumeProfile,
  recommendedJobs,
  onUploadFile,
  onAnalyzeText,
  onSelectSample,
  onToggleSaveJob,
  onApplyJob,
  onClearResume,
  onBackToJobs,
  onCloseAndReset,
}) {
  const recListRef = useRef(null);
  const [step, setStep] = useState(resumeProfile ? 3 : 1);
  const [scanStageIndex, setScanStageIndex] = useState(0);
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState('');
  const [recPage, setRecPage] = useState(1);

  const activeStep = !resumeProfile && step === 3 ? 1 : step;
  const totalRecPages = Math.max(1, Math.ceil(recommendedJobs.length / RECOMMENDED_PER_PAGE));
  const activeRecPage = Math.min(recPage, totalRecPages);
  const recStartIndex = (activeRecPage - 1) * RECOMMENDED_PER_PAGE;
  const visibleRecommendedJobs = recommendedJobs.slice(
    recStartIndex,
    recStartIndex + RECOMMENDED_PER_PAGE
  );

  useEffect(() => {
    if (activeStep !== 2) return undefined;

    const timers = [
      setTimeout(() => setScanStageIndex(1), 180),
      setTimeout(() => setScanStageIndex(2), 380),
      setTimeout(() => setScanStageIndex(3), 580),
      setTimeout(() => {
        setScanStageIndex(4);
        setStep(3);
      }, 820),
    ];

    return () => timers.forEach((id) => clearTimeout(id));
  }, [activeStep]);

  const beginScanTransition = () => {
    setScanStageIndex(0);
    setRecPage(1);
    setStep(2);
  };

  const handleFilePick = async (file) => {
    if (!file) return;
    setShowPasteBox(false);
    beginScanTransition();
    await onUploadFile(file);
  };

  const handlePasteSubmit = (rawText) => {
    setShowPasteBox(false);
    onAnalyzeText(rawText, {
      fileName: resumeProfile?.fileName || 'Custom_Resume.txt',
      fileSizeLabel: `${Math.max(1, Math.round(rawText.length / 1024))} KB`,
    });
    beginScanTransition();
  };

  const handleSampleChange = (sampleId) => {
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_RESUMES.find((item) => item.id === sampleId);
    if (!sample) return;
    onSelectSample(sample);
    beginScanTransition();
  };

  const handleRecPageChange = (nextPage) => {
    setRecPage(nextPage);
    recListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full pb-16 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onBackToJobs}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#020617] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span>Back to Job & Career Opportunities</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedSampleId('');
            setStep(1);
            onCloseAndReset();
          }}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
          title="Close section and reset uploaded resume"
        >
          <X className="w-3.5 h-3.5" />
          <span>Close Resume Section</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-5 sm:space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-lg sm:text-2xl font-black text-slate-900">
            Resume Analyzer & Personalized Job Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload your resume to automatically scan skills, qualifications, experience, and career interests.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {UPLOAD_STEPS.map((item) => {
            const isCompleted =
              activeStep > item.id || (activeStep === 3 && item.id === 3 && Boolean(resumeProfile));
            const isActive = activeStep === item.id;
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2.5 p-2.5 sm:p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-[#020617] bg-[#ecfeff]/60'
                    : isCompleted
                      ? 'border-[#0891b2]/40 bg-cyan-50/40'
                      : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-[#0891b2] text-white'
                      : isActive
                        ? 'bg-[#020617] text-white'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.id}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                    Step {item.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                    {item.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {activeStep === 1 && (
          <ResumeUploadStep
            initialDraftText={resumeProfile?.rawText}
            showPasteBox={showPasteBox}
            selectedSampleId={selectedSampleId}
            onTogglePasteBox={() => setShowPasteBox((prev) => !prev)}
            onCancelPasteBox={() => setShowPasteBox(false)}
            onFileSelected={handleFilePick}
            onPasteSubmit={handlePasteSubmit}
            onSampleSelect={handleSampleChange}
          />
        )}

        {activeStep === 2 && <ResumeScanningStep scanStageIndex={scanStageIndex} />}

        {activeStep === 3 && resumeProfile && (
          <ResumeProfileSummary
            resumeProfile={resumeProfile}
            recommendedCount={recommendedJobs.length}
            onOpenPasteBox={() => {
              setShowPasteBox(true);
              setStep(1);
            }}
            onUploadAnother={() => {
              setSelectedSampleId('');
              setStep(1);
            }}
            onClearResume={() => {
              setSelectedSampleId('');
              setStep(1);
              onClearResume();
            }}
          />
        )}
      </div>

      {activeStep === 3 && resumeProfile && (
        <div ref={recListRef} className="space-y-4 scroll-mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0891b2]" />
              <span>Recommended Job Opportunities ({recommendedJobs.length})</span>
            </h2>
            {recommendedJobs.length > RECOMMENDED_PER_PAGE && (
              <span className="text-xs font-semibold text-slate-500">
                Page <strong className="text-slate-900">{activeRecPage}</strong> of{' '}
                <strong className="text-slate-900">{totalRecPages}</strong>
              </span>
            )}
          </div>

          {recommendedJobs.length > 0 ? (
            <div className="space-y-4">
              {visibleRecommendedJobs.map((job) => (
                <JobCard
                  key={`rec-step-${job.id}`}
                  job={job}
                  hasResume={true}
                  onToggleSave={onToggleSaveJob}
                  onApply={onApplyJob}
                />
              ))}

              <JobPagination
                currentPage={activeRecPage}
                totalPages={totalRecPages}
                onPageChange={handleRecPageChange}
              />
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-sm font-bold text-slate-900">
                No direct sector matches found from extracted text yet.
              </p>
              <p className="text-xs text-slate-500">
                Try pasting your full resume summary/skills in Step 1 or browse all 210 jobs via Back to Job & Career Opportunities.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
