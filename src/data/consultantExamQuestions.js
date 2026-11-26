export const PASSING_THRESHOLD = 10;

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
