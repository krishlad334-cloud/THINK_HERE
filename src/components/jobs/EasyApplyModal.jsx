import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import EasyApplyContactStep from './apply/EasyApplyContactStep';
import EasyApplyQuestionsStep from './apply/EasyApplyQuestionsStep';
import EasyApplyReviewStep from './apply/EasyApplyReviewStep';
import EasyApplySuccessStep from './apply/EasyApplySuccessStep';

const APPLY_STEPS = [
  { id: 1, label: 'Contact Info' },
  { id: 2, label: 'Resume & Questions' },
  { id: 3, label: 'Review' },
];

export default function EasyApplyModal({
  job,
  currentUser,
  resumeProfile,
  onUploadResumeFile,
  onSubmitApplication,
  onClose,
}) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.mobile || '+1 (555) 234-8910');
  const [city, setCity] = useState(currentUser?.location || 'San Francisco, CA');
  const [useScannedResume, setUseScannedResume] = useState(Boolean(resumeProfile));
  const [isScanningUpload, setIsScanningUpload] = useState(false);
  const [yearsExp, setYearsExp] = useState(
    resumeProfile?.experienceYears ? String(resumeProfile.experienceYears) : '3'
  );
  const [meetsQualification, setMeetsQualification] = useState('Yes');
  const [matchesWorkMode, setMatchesWorkMode] = useState('Yes');
  const [coverNote, setCoverNote] = useState('');
  const [followCompany, setFollowCompany] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  const progressPercent = step === 4 ? 100 : Math.round((step / 3) * 100);
  const resumeLabel =
    useScannedResume && resumeProfile
      ? resumeProfile.fileName
      : 'OverThink Verified Profile';

  const initials = (fullName || currentUser?.name || 'OT')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase();

  const validateContactStep = () => {
    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (phone.replace(/\D/g, '').length < 7) {
      setValidationError('Please enter a valid contact phone number.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const validateQuestionsStep = () => {
    const parsedExp = Number(yearsExp);
    if (yearsExp === '' || Number.isNaN(parsedExp) || parsedExp < 0 || parsedExp > 50) {
      setValidationError('Please enter valid years of relevant experience (0–50).');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateContactStep()) {
      setStep(2);
      return;
    }
    if (step === 2 && validateQuestionsStep()) {
      setStep(3);
    }
  };

  const handleResumePick = async (file) => {
    if (!file || !onUploadResumeFile) return;
    setIsScanningUpload(true);
    setValidationError('');
    try {
      const parsedProfile = await onUploadResumeFile(file);
      if (parsedProfile) {
        setUseScannedResume(true);
        if (parsedProfile.experienceYears > 0) {
          setYearsExp(String(parsedProfile.experienceYears));
        }
      }
    } finally {
      setIsScanningUpload(false);
    }
  };

  const handleSubmit = () => {
    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      resumeLabel,
      yearsExp: Number(yearsExp) || 0,
      meetsQualification,
      matchesWorkMode,
      coverNote: coverNote.trim(),
      followCompany,
      submittedAt: new Date().toISOString(),
    };

    onSubmitApplication(job.id, payload);
    setSubmittedRecord({
      ...payload,
      applicantNumber: (job.applicantsCount || 0) + 1,
    });
    setStep(4);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="easy-apply-modal-title"
        className="w-full max-w-lg sm:max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-h-[88dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 flex-shrink-0 bg-white">
          <div className="min-w-0">
            <h2
              id="easy-apply-modal-title"
              className="text-base sm:text-lg font-black text-slate-900 truncate"
            >
              {step === 4 ? 'Application Sent' : `Apply to ${job.company}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {job.title} • {job.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step < 4 && (
          <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                {APPLY_STEPS.map((item) => {
                  const isDone = step > item.id;
                  const isActive = step === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? 'text-[#020617]'
                          : isDone
                            ? 'text-[#0891b2]'
                            : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                          isDone
                            ? 'bg-[#0891b2] text-white'
                            : isActive
                              ? 'bg-[#020617] text-white'
                              : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : item.id}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <span className="text-[#0891b2] flex-shrink-0 pl-2">{progressPercent}%</span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0891b2] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {validationError}
            </div>
          )}

          {step === 1 && (
            <EasyApplyContactStep
              fullName={fullName}
              onFullNameChange={setFullName}
              email={email}
              onEmailChange={setEmail}
              phone={phone}
              onPhoneChange={setPhone}
              city={city}
              onCityChange={setCity}
              userTitle={currentUser?.title}
              initials={initials}
            />
          )}

          {step === 2 && (
            <EasyApplyQuestionsStep
              job={job}
              resumeProfile={resumeProfile}
              useScannedResume={useScannedResume}
              onToggleResumeMode={setUseScannedResume}
              isScanningUpload={isScanningUpload}
              onUploadFile={handleResumePick}
              yearsExp={yearsExp}
              onYearsExpChange={setYearsExp}
              meetsQualification={meetsQualification}
              onMeetsQualificationChange={setMeetsQualification}
              matchesWorkMode={matchesWorkMode}
              onMatchesWorkModeChange={setMatchesWorkMode}
              coverNote={coverNote}
              onCoverNoteChange={setCoverNote}
            />
          )}

          {step === 3 && (
            <EasyApplyReviewStep
              job={job}
              fullName={fullName}
              email={email}
              phone={phone}
              city={city}
              resumeLabel={resumeLabel}
              yearsExp={yearsExp}
              meetsQualification={meetsQualification}
              matchesWorkMode={matchesWorkMode}
              coverNote={coverNote}
              followCompany={followCompany}
              onFollowCompanyChange={setFollowCompany}
              onEditStep={setStep}
            />
          )}

          {step === 4 && <EasyApplySuccessStep job={job} submittedRecord={submittedRecord} />}
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 flex-shrink-0">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => {
                  setValidationError('');
                  setStep(1);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Review
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Submit Application
              </button>
            </>
          )}

          {step === 4 && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto px-6 py-2 rounded-xl bg-[#020617] hover:bg-[#091528] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
