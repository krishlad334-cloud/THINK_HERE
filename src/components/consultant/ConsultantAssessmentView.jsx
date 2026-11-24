import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Logo from '../common/Logo';
import {
  CheckCircle2,
  XCircle,
  Award,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Check,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export const PASSING_THRESHOLD = 10; // Exactly 10 right answers out of 15 required to pass into consultant side

export const CONSULTANT_QUESTIONS = [
  {
    id: 1,
    category: 'Problem Diagnosis & SLA',
    competency: 'Rapid Triage',
    question: 'A client posts an urgent challenge about sudden server downtime during a live product launch. According to OverThink platform standards, what is your initial responsibility?',
    options: [
      { id: 'A', text: 'Analyze system symptoms, isolate root-cause bottlenecks, and deliver an actionable triage checklist within the 24-hour SLA.' },
      { id: 'B', text: 'Advise the client to cancel their marketing campaign and rebuild everything from scratch.' },
      { id: 'C', text: 'Wait 48 hours to observe whether server traffic stabilizes on its own before responding.' },
      { id: 'D', text: 'Demand the client give you master root SSH credentials to take over their private production servers.' }
    ],
    correctAnswer: 'A',
    explanation: 'OverThink consultants commit to rapid root-cause diagnosis within 24 hours while respecting client privacy and boundaries.'
  },
  {
    id: 2,
    category: 'Client Confidentiality & Data Ethics',
    competency: 'IP Protection',
    question: 'During a consultation session, a client uploads a proprietary financial model containing customer PII. How must you handle these documents?',
    options: [
      { id: 'A', text: 'Export the file to your personal public drive to showcase in your consulting portfolio.' },
      { id: 'B', text: 'Treat all files as strictly confidential under OverThink NDA, never export external copies, and guide the client on redacting PII.' },
      { id: 'C', text: 'Share the financial model in an open developer forum to crowdsource recommendations.' },
      { id: 'D', text: 'Ask the client to email the unencrypted database to your personal Gmail account.' }
    ],
    correctAnswer: 'B',
    explanation: 'Confidentiality is paramount. All client materials must remain encrypted within OverThink consultation rooms.'
  },
  {
    id: 3,
    category: 'Root-Cause Analysis vs Generic Advice',
    competency: 'Analytical Rigor',
    question: 'A founder asks: "Should we double our ad spend or redesign our landing page?" What distinguishes verified human consultation from generic AI advice?',
    options: [
      { id: 'A', text: 'Quoting general marketing platitudes commonly found on public blog listicles.' },
      { id: 'B', text: 'Diagnosing specific conversion funnel drop-offs, CAC, and unit economics before prescribing a tailored, measurable roadmap.' },
      { id: 'C', text: 'Recommending a coin flip because early-stage marketing is purely unpredictable.' },
      { id: 'D', text: 'Promising guaranteed 10x ROI within 7 days without inspecting historical conversion data.' }
    ],
    correctAnswer: 'B',
    explanation: 'Human experts evaluate the client’s unique business context and data instead of offering one-size-fits-all generic tips.'
  },
  {
    id: 4,
    category: 'Solution Structuring & Milestones',
    competency: 'Action Planning',
    question: 'What is the standard structure for an OverThink Solution Blueprint delivered to a client?',
    options: [
      { id: 'A', text: 'A single informal chat message saying "Keep testing and stay positive."' },
      { id: 'B', text: 'A 3-to-5 phase actionable roadmap with clear milestones, measurable KPIs, estimated timelines, and recommended tools.' },
      { id: 'C', text: 'A 100-page purely theoretical thesis with no practical implementation steps.' },
      { id: 'D', text: 'A generic sales brochure requiring off-platform monthly retainer payments.' }
    ],
    correctAnswer: 'B',
    explanation: 'Structured, milestone-based roadmaps empower clients to take direct action and track progress from 0% to 100%.'
  },
  {
    id: 5,
    category: 'Platform Compliance & Ethics',
    competency: 'Platform Integrity',
    question: 'A client suggests transferring funds directly via personal bank transfer or WhatsApp to bypass the platform. What is your correct response?',
    options: [
      { id: 'A', text: 'Agree immediately and send your personal routing number in private chat.' },
      { id: 'B', text: 'Politely inform the client that all communication and transactions must stay on OverThink to protect both parties under escrow and dispute guarantees.' },
      { id: 'C', text: 'Suggest sending untraceable cryptocurrency instead.' },
      { id: 'D', text: 'Block the client without explanation and abandon the consultation room.' }
    ],
    correctAnswer: 'B',
    explanation: 'Staying on-platform guarantees escrow protection, NDA enforcement, and mediation support for both parties.'
  },
  {
    id: 6,
    category: 'Handling Ambiguous Inquiries',
    competency: 'Clarification',
    question: 'A client submits an open thought: "My app is slow. How do I fix it?" without specifying their tech stack. What is your optimal first response?',
    options: [
      { id: 'A', text: 'Reject the inquiry and criticize the client for lack of preparation.' },
      { id: 'B', text: 'Ask targeted diagnostic questions regarding their architecture, database query response times, hosting tier, and user concurrency.' },
      { id: 'C', text: 'Immediately advise them to rewrite the entire backend in a new trending language.' },
      { id: 'D', text: 'Mark the consultation as resolved without asking questions.' }
    ],
    correctAnswer: 'B',
    explanation: 'Effective consultants ask clarifying diagnostic questions to define problem parameters before proposing solutions.'
  },
  {
    id: 7,
    category: 'Scope & Feasibility Management',
    competency: 'Expectation Setting',
    question: 'A client with a limited $500 budget requests a proprietary generative AI video model built in 2 weeks. How should you advise them?',
    options: [
      { id: 'A', text: 'Accept the project and falsely guarantee completion within 2 weeks.' },
      { id: 'B', text: 'Provide an honest feasibility assessment, explain GPU cost realities, and propose an MVP utilizing existing pre-trained APIs within budget.' },
      { id: 'C', text: 'Tell the client their ambition is foolish and discourage them from building anything.' },
      { id: 'D', text: 'Secretly subcontract the work overseas without informing the client.' }
    ],
    correctAnswer: 'B',
    explanation: 'Professional consultants guide clients toward feasible MVP architectures that match their real-world budget.'
  },
  {
    id: 8,
    category: 'Call Room & Screen Share Protocol',
    competency: 'Consultation Delivery',
    question: 'During a live video/audio consultation in the OverThink Call Room, what is the best practice for screen sharing?',
    options: [
      { id: 'A', text: 'Keep the camera off and browse personal social media during the call.' },
      { id: 'B', text: 'Prepare diagnostic visual aids/code beforehand, share only the relevant application window, and conclude with agreed next steps.' },
      { id: 'C', text: 'Share your entire desktop with private personal emails and chat windows visible.' },
      { id: 'D', text: 'Extend the call indefinitely past the scheduled time without asking the client.' }
    ],
    correctAnswer: 'B',
    explanation: 'Structured, distraction-free screen sharing respects client time and maximizes clarity.'
  },
  {
    id: 9,
    category: 'Delivering Critical Strategic Feedback',
    competency: 'Objective Guidance',
    question: 'A client’s business model shows a severe flaw: customer acquisition cost (CAC) is 4x their projected lifetime value (LTV). How should you communicate this?',
    options: [
      { id: 'A', text: 'Conceal the flaw to avoid disappointing the client.' },
      { id: 'B', text: 'Present the unit economics data objectively, explain runway depletion risk, and brainstorm pricing or organic retention strategies.' },
      { id: 'C', text: 'Publicly post the client’s unit economics as a negative case study.' },
      { id: 'D', text: 'Tell the client they should quit entrepreneurship entirely.' }
    ],
    correctAnswer: 'B',
    explanation: 'Objective, data-driven honesty protects founders from financial loss while providing strategic paths to profitability.'
  },
  {
    id: 10,
    category: 'Conflict & Perspective Alignment',
    competency: 'Dispute Prevention',
    question: 'A client strongly disagrees with your technical recommendation during a milestone review. How should you proceed?',
    options: [
      { id: 'A', text: 'Argue aggressively until the client yields to your authority.' },
      { id: 'B', text: 'Listen to their reservations, re-evaluate their operational constraints, explore alternative trade-offs together, or request OverThink moderation.' },
      { id: 'C', text: 'Delete all prior consultation chat logs and leave the consultation room.' },
      { id: 'D', text: 'Spam the client with angry notifications.' }
    ],
    correctAnswer: 'B',
    explanation: 'Consulting is a collaborative partnership; exploring trade-offs and leveraging platform moderation maintains mutual respect.'
  },
  {
    id: 11,
    category: 'Actionable Deliverables',
    competency: 'Execution Value',
    question: 'Which of the following constitutes an exemplary consultation deliverable on OverThink?',
    options: [
      { id: 'A', text: '"Just hire 10 full-time engineers and see what happens."' },
      { id: 'B', text: 'A prioritized step-by-step implementation guide with risk mitigation steps, tool suggestions, and verifiable milestone benchmarks.' },
      { id: 'C', text: 'An unedited copy-paste of a generic chatbot prompt that ignores the client’s legacy codebase.' },
      { id: 'D', text: 'A solitary link to a generic online documentation page.' }
    ],
    correctAnswer: 'B',
    explanation: 'Clients value clarity, accountability, and step-by-step roadmaps they can immediately execute.'
  },
  {
    id: 12,
    category: 'Time Management & Responsiveness',
    competency: 'SLA Commitment',
    question: 'When you accept an OverThink submission, within what timeframe are you expected to initiate active consultation?',
    options: [
      { id: 'A', text: 'Within 24 hours, upholding the platform’s core 24-hour guarantee and consultant rating.' },
      { id: 'B', text: 'Within 2 to 3 weeks whenever your personal schedule permits.' },
      { id: 'C', text: 'Only after the client sends repeated reminder messages.' },
      { id: 'D', text: 'Never, because accepted thoughts have no service level expectations.' }
    ],
    correctAnswer: 'A',
    explanation: 'The 24-Hour Guarantee is OverThink’s flagship promise. Punctuality is essential for verified status.'
  },
  {
    id: 13,
    category: 'Intellectual Honesty & Plagiarism',
    competency: 'Ethics & Originality',
    question: 'May a consultant copy and reuse solution proposals submitted by other specialists on previous thoughts?',
    options: [
      { id: 'A', text: 'Yes, copy-pasting existing solutions saves time and effort.' },
      { id: 'B', text: 'No. All blueprints and consultation advice must be original, bespoke to the client’s situation, and created by you.' },
      { id: 'C', text: 'Yes, as long as you change a few words in the introduction.' },
      { id: 'D', text: 'Yes, provided the original consultant does not find out.' }
    ],
    correctAnswer: 'B',
    explanation: 'Bespoke expertise and original analysis are the foundation of client trust on OverThink.'
  },
  {
    id: 14,
    category: 'Post-Consultation Wrap-Up',
    competency: 'Client Success',
    question: 'When a consultation milestone is completed, what is the professional follow-up protocol?',
    options: [
      { id: 'A', text: 'Demand an immediate external Google review before releasing deliverables.' },
      { id: 'B', text: 'Provide a concise summary, confirm the client has no unanswered blockers, and invite them to leave a verified review on-platform.' },
      { id: 'C', text: 'Immediately terminate communication without verifying if the solution worked.' },
      { id: 'D', text: 'Issue an unannounced invoice for unexpected ancillary consulting fees.' }
    ],
    correctAnswer: 'B',
    explanation: 'A clean debrief ensures the client feels supported and reinforces your verified reputation score.'
  },
  {
    id: 15,
    category: 'Emergency Escalation & Security',
    competency: 'Critical Response',
    question: 'If a client reports an active cybersecurity credential leak or breach, what is your immediate recommendation?',
    options: [
      { id: 'A', text: 'Publicize the vulnerability on social media for personal publicity.' },
      { id: 'B', text: 'Advise immediate revocation of active tokens/keys, credential rotation, firewall isolation, and maintain strict confidentiality.' },
      { id: 'C', text: 'Tell the client to wait until the following week’s scheduled consultation.' },
      { id: 'D', text: 'Disregard the report as outside the consulting scope.' }
    ],
    correctAnswer: 'B',
    explanation: 'Critical security situations require immediate damage containment and absolute confidentiality.'
  }
];

export default function ConsultantAssessmentView({ onComplete, isStandalone = true }) {
  const { currentUser, updateUserProfile, showToast } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const totalQuestions = CONSULTANT_QUESTIONS.length;
  const currentQ = CONSULTANT_QUESTIONS[currentIndex];

  const handleSelectOption = (optionId) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSubmitTest = () => {
    let correctCount = 0;
    CONSULTANT_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    setShowReviewModal(false);

    const hasPassed = correctCount >= PASSING_THRESHOLD;

    if (currentUser?.id) {
      updateUserProfile(currentUser.id, {
        assessmentPassed: hasPassed,
        isVerified: hasPassed,
        assessmentScore: `${correctCount}/${totalQuestions}`,
        assessmentScoreNum: correctCount,
        assessmentCompletedAt: new Date().toISOString()
      });
    }

    if (hasPassed) {
      showToast(
        'Assessment Passed!',
        `Congratulations! You answered ${correctCount}/${totalQuestions} correctly (Required: 10). Verified Consultant status unlocked!`,
        'success'
      );
    } else {
      showToast(
        'Qualification Incomplete',
        `You answered ${correctCount}/${totalQuestions} correctly. At least 10 right answers are required to unlock the Consultant portal.`,
        'error'
      );
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setScore(0);
  };

  const isPassed = isSubmitted && score >= PASSING_THRESHOLD;
  const passPercentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className={`w-full text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-950 ${
      isStandalone ? 'min-h-screen min-h-[100dvh] bg-[#f8fafc]' : 'pb-16'
    }`}>
      {/* =================================================================== */}
      {/* 1. TOP RESPONSIVE HEADER BAR (STANDALONE POST-REGISTRATION MODE)    */}
      {/* =================================================================== */}
      {isStandalone ? (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-16 px-4 sm:px-8 lg:px-12 w-full flex items-center justify-between gap-4">
          {/* Left: Logo & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="sm" showTagline={false} />
            <div className="hidden sm:block h-5 w-px bg-slate-200 mx-0.5" />
            <span className="hidden sm:inline text-xs font-bold text-slate-800 truncate">
              Consultant Skills & Qualification
            </span>
          </div>

          {/* Right: Mandatory Exam Tag at the end of the navbar */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 shadow-2xs">
              Mandatory Exam
            </span>
          </div>
        </header>
      ) : (
        /* Top Banner Card for In-App Dashboard Tab */
        <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-2">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#ecfeff] text-[#020617] flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-[#0891b2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Mandatory Consultant Qualification Exam
                  </h1>
                  {currentUser?.assessmentPassed ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      Qualified & Passed
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                      Mandatory (Score ≥ 10/15)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  15 scenario questions on 24-hour SLA triage, NDA confidentiality, and diagnostic consulting.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 bg-[#ecfeff] rounded-xl border border-[#0891b2]/30 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 block">Pass Criteria</span>
                <span className="text-sm font-black text-[#020617]">10 / 15 Right</span>
              </div>
              <div className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Progress</span>
                <span className="text-sm font-black text-slate-900">{answeredCount}/{totalQuestions}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. MAIN ASSESSMENT CANVAS - VERTICALLY CENTERED & BALANCED          */}
      {/* =================================================================== */}
      <main className="flex-1 w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex flex-col justify-center">
        {!isSubmitted ? (
          /* ================================================================= */
          /* QUESTION IN PROGRESS SCREEN: SINGLE UNIFIED SEAMLESS CARD         */
          /* ================================================================= */
          <div className="w-full my-auto animate-in fade-in duration-300">
            <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
              {/* Card Top Animated Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0891b2] to-[#22d3ee] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Card Header: Meta Strip */}
              <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-[#020617] text-white text-xs font-black shadow-2xs">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-bold text-cyan-900 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200/80">
                    {currentQ.category}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200/80 flex items-center gap-1">
                  <span className="text-slate-400 font-normal hidden sm:inline">Answered: </span>
                  <span className="text-[#0891b2] font-black">{answeredCount}</span>
                  <span className="text-slate-400">/{totalQuestions}</span>
                </div>
              </div>

              {/* Card Body: Question Prompt & 4 Options */}
              <div className="p-5 sm:p-7 lg:p-8 space-y-5 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug tracking-tight">
                  {currentQ.question}
                </h2>

                {/* 4 Interactive Option Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-150 cursor-pointer flex items-center gap-3.5 group select-none ${
                          isSelected
                            ? 'border-[#0891b2] bg-[#ecfeff]/80 shadow-xs ring-4 ring-[#0891b2]/10 scale-[1.002]'
                            : 'border-slate-200/80 bg-white hover:border-[#0891b2]/40 hover:bg-slate-50/70 shadow-2xs'
                        }`}
                      >
                        {/* Option Letter Indicator */}
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 transition-all ${
                            isSelected
                              ? 'bg-[#0891b2] text-white shadow-md shadow-[#0891b2]/25'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-[#ecfeff] group-hover:text-[#0891b2]'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : opt.id}
                        </div>

                        {/* Option Text */}
                        <p className={`text-xs sm:text-sm leading-relaxed font-medium transition-colors ${
                          isSelected ? 'text-slate-950 font-bold' : 'text-slate-700 group-hover:text-slate-900'
                        }`}>
                          {opt.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Seamless Integrated Navigation Controls */}
              <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-3">
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500" />
                  <span>Previous</span>
                </button>

                {/* Center Question / Requirement Status */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <span className="hidden sm:inline text-slate-400">Question</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#020617] text-white text-xs font-black">
                    {currentIndex + 1}
                  </span>
                  <span className="text-slate-400">of {totalQuestions}</span>
                  <span className="hidden md:inline text-slate-300">•</span>
                  <span className="hidden md:inline text-[#0891b2] font-semibold">10+ right to pass</span>
                </div>

                {/* Next / Submit Button */}
                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0891b2] to-[#0e7490] hover:from-[#06b6d4] hover:to-[#0891b2] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-cyan-900/15 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-900/20 cursor-pointer transition-all active:scale-95"
                  >
                    <span>Submit Exam</span>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* RESULTS & SCORECARD SCREEN                                         */
          /* ================================================================= */
          <div className="w-full space-y-6 animate-in zoom-in-95 duration-400">
            {/* Header Triumph Card */}
            <div className={`p-6 sm:p-10 rounded-3xl border-2 text-center space-y-5 shadow-xl ${
              isPassed
                ? 'bg-gradient-to-b from-[#ecfeff] to-white border-[#22d3ee]'
                : 'bg-gradient-to-b from-rose-50 to-white border-rose-300'
            }`}>
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform animate-bounce">
                {isPassed ? (
                  <div className="w-full h-full rounded-3xl bg-[#0891b2] text-white flex items-center justify-center shadow-cyan-500/30">
                    <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-rose-500/30">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                )}
              </div>

              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {isPassed ? 'Official Verified Consultant Qualification' : 'Qualification Threshold Not Met'}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  {isPassed ? 'Congratulations, You Passed!' : 'Exam Incomplete — Minimum 10 Correct Answers Required'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
                  {isPassed
                    ? `You scored ${score} of 15 questions correctly (Required: 10/15). You have met the qualification standards and are now authorized to enter the Consultant Workspace!`
                    : `You scored ${score} of 15 questions correctly. At least 10 correct answers are strictly required to access client briefs and consultations. Please review the answers below and retake the exam.`}
                </p>
              </div>

              {/* Score Display Stat Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className={`text-2xl sm:text-3xl font-black font-mono ${isPassed ? 'text-[#0891b2]' : 'text-rose-600'}`}>
                    {score}/{totalQuestions}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Your Score</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className={`text-2xl sm:text-3xl font-black font-mono ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isPassed ? 'Qualified' : `${PASSING_THRESHOLD - score} Needed`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{isPassed ? 'Status' : 'To Pass'}</div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
                    10/15
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Minimum Required</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {isPassed ? (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-[#020617] hover:bg-[#091528] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#020617]/25 cursor-pointer transition-all transform active:scale-98"
                  >
                    <span>Enter Consultant Workspace</span>
                    <ArrowRight className="w-4 h-4 text-[#22d3ee]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Assessment (Try Again)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="w-full bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#0891b2]" />
                  <span>Exam Question Breakdown & Explanations</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold">
                  Review all {totalQuestions} questions
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {CONSULTANT_QUESTIONS.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;
                  const chosenOpt = q.options.find(o => o.id === userAnswer);
                  const correctOpt = q.options.find(o => o.id === q.correctAnswer);

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {q.category}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2.5 leading-snug">
                        {q.question}
                      </h4>

                      <div className="mt-3 space-y-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-slate-500 w-24 flex-shrink-0">Your Answer:</span>
                          <span className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {chosenOpt ? `(${chosenOpt.id}) ${chosenOpt.text}` : 'No answer selected'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-emerald-700 w-24 flex-shrink-0">Correct Answer:</span>
                            <span className="font-semibold text-emerald-800">
                              ({correctOpt.id}) {correctOpt.text}
                            </span>
                          </div>
                        )}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 mt-2 leading-relaxed">
                          <strong>Standard:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* 3. CONFIRMATION MODAL BEFORE FINAL SUBMISSION                        */}
      {/* =================================================================== */}
      {showReviewModal && (
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
                onClick={() => setShowReviewModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Back to Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="w-full py-2.5 rounded-xl bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold text-xs shadow-md cursor-pointer transition-all"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {isStandalone && (
        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 w-full">
          OverThink Verified Consultant Certification • 24-Hour Human Guidance Standards
        </footer>
      )}
    </div>
  );
}
