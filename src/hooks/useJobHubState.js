import { useEffect, useMemo, useState } from 'react';
import { extractTextFromResumeFile } from '../utils/resumeParser';
import {
  analyzeResumeText,
  loadSavedResumeProfile,
  rankJobsByResume,
  saveResumeProfile,
} from '../utils/resumeAnalyzer';

export const JOBS_PER_PAGE = 10;

export function useJobHubState({
  jobs,
  applyJob,
  currentUser,
  showToast,
}) {
  const [isResumeSectionOpen, setIsResumeSectionOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedNotification, setAppliedNotification] = useState(null);
  const [activeApplyJobId, setActiveApplyJobId] = useState(null);

  const currentUserId = currentUser?.id || null;
  const [resumeState, setResumeState] = useState(() => ({
    userId: currentUserId,
    profile: loadSavedResumeProfile(currentUserId),
  }));

  const resumeProfile =
    resumeState.userId === currentUserId
      ? resumeState.profile
      : loadSavedResumeProfile(currentUserId);

  useEffect(() => {
    if (!appliedNotification) return undefined;
    const timeout = setTimeout(() => setAppliedNotification(null), 4000);
    return () => clearTimeout(timeout);
  }, [appliedNotification]);

  const setProfileForCurrentUser = (profile) => {
    setResumeState({ userId: currentUserId, profile });
    saveResumeProfile(currentUserId, profile);
  };

  const handleAnalyzeRawText = (text, meta) => {
    const profile = analyzeResumeText(text, meta);
    setProfileForCurrentUser(profile);
    showToast(
      'Resume Analyzed',
      `Detected ${profile.skills.length} skills & matched roles in ${profile.primaryIndustry}.`,
      'success'
    );
    return profile;
  };

  const handleUploadFile = async (file) => {
    try {
      const parsed = await extractTextFromResumeFile(file);
      return handleAnalyzeRawText(parsed.text, {
        fileName: file.name,
        fileSizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        warning: parsed.warning,
      });
    } catch {
      showToast('Scan Failed', 'Could not read that file. Try PDF, DOCX, or TXT.', 'error');
      return null;
    }
  };

  const handleSelectSample = (sample) => {
    return handleAnalyzeRawText(sample.text, {
      fileName: sample.fileName,
      fileSizeLabel: `${Math.max(1, Math.round(sample.text.length / 1024))} KB`,
      warning: '',
    });
  };

  const handleClearResume = () => {
    setProfileForCurrentUser(null);
    if (selectedType === 'Recommended') {
      setSelectedType('All');
    }
    showToast('Resume Removed', 'Showing all multi-industry opportunities.', 'info');
  };

  const handleCloseAndResetResume = () => {
    setProfileForCurrentUser(null);
    if (selectedType === 'Recommended') {
      setSelectedType('All');
    }
    setCurrentPage(1);
    setIsResumeSectionOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedIndustry('All Industries');
    setSelectedType('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const rankedJobs = useMemo(
    () => rankJobsByResume(jobs, resumeProfile),
    [jobs, resumeProfile]
  );

  const recommendedJobs = useMemo(
    () => rankedJobs.filter((job) => job.isRecommended),
    [rankedJobs]
  );

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return rankedJobs.filter((job) => {
      if (selectedIndustry !== 'All Industries' && job.industry !== selectedIndustry) {
        return false;
      }

      if (selectedType === 'Recommended' && !job.isRecommended) return false;
      if (selectedType === 'Remote' && !job.location.toLowerCase().includes('remote')) return false;
      if (selectedType === 'Hybrid' && !job.location.toLowerCase().includes('hybrid')) return false;
      if (selectedType === 'Full-time' && !job.type.toLowerCase().includes('full-time')) return false;
      if (selectedType === 'Saved' && !job.isSaved) return false;
      if (selectedType === 'Applied' && !job.isApplied) return false;

      if (!query) return true;

      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        Boolean(job.industry?.toLowerCase().includes(query)) ||
        (job.skills || []).some((skill) => skill.toLowerCase().includes(query)) ||
        (job.qualifications || []).some((qual) => qual.toLowerCase().includes(query))
      );
    });
  }, [rankedJobs, selectedIndustry, selectedType, searchQuery]);

  const activeApplyJob = useMemo(
    () => rankedJobs.find((job) => job.id === activeApplyJobId) || null,
    [rankedJobs, activeApplyJobId]
  );

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * JOBS_PER_PAGE;
  const visibleJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  const handleConfirmApply = (jobId, applicationDetails) => {
    const targetJob = rankedJobs.find((item) => item.id === jobId);
    applyJob(jobId, applicationDetails);
    if (targetJob) {
      setAppliedNotification(
        `Application successfully submitted to ${targetJob.company} via ${applicationDetails.resumeLabel}!`
      );
    }
  };

  return {
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
  };
}
