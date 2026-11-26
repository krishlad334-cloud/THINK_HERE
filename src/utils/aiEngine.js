export function analyzeThought(title = '', description = '', attachments = []) {
  const fullText = `${title} ${description}`.toLowerCase();

  let category = 'General & Real-World';
  let matchedSkills = ['Problem Solving', 'Strategic Thinking'];
  let urgency = 'Standard';

  if (fullText.includes('job') || fullText.includes('interview') || fullText.includes('resume') || fullText.includes('career') || fullText.includes('hiring') || fullText.includes('developer') || fullText.includes('salary')) {
    category = 'Career & Jobs';
    matchedSkills = ['Resume Optimization', 'Technical Interview Prep', 'LinkedIn Branding', 'Career Transition'];
  } else if (fullText.includes('startup') || fullText.includes('business') || fullText.includes('revenue') || fullText.includes('investor') || fullText.includes('pitch') || fullText.includes('founder')) {
    category = 'Business & Startups';
    matchedSkills = ['Pitch Deck Review', 'GTM Strategy', 'Unit Economics', 'Product-Market Fit'];
  } else if (fullText.includes('marketing') || fullText.includes('sales') || fullText.includes('ad') || fullText.includes('seo') || fullText.includes('social media') || fullText.includes('leads')) {
    category = 'Marketing & Growth';
    matchedSkills = ['Performance Marketing', 'Organic Growth', 'Funnel Optimization', 'B2B Outbound'];
  } else if (fullText.includes('code') || fullText.includes('python') || fullText.includes('react') || fullText.includes('database') || fullText.includes('bug') || fullText.includes('architecture') || fullText.includes('cloud') || fullText.includes('api')) {
    category = 'Technology & IT';
    matchedSkills = ['System Architecture', 'Full-Stack Development', 'Cloud DevOps', 'Database Tuning'];
  } else if (fullText.includes('product') || fullText.includes('ui') || fullText.includes('ux') || fullText.includes('design') || fullText.includes('feature') || fullText.includes('hardware')) {
    category = 'Product & Innovation';
    matchedSkills = ['Product Design (UX/UI)', 'Feature Prioritization', 'User Research', 'Hardware Prototyping'];
  } else if (fullText.includes('learn') || fullText.includes('course') || fullText.includes('study') || fullText.includes('college') || fullText.includes('exam')) {
    category = 'Education & Learning';
    matchedSkills = ['Curriculum Design', 'Skill Roadmapping', 'Certification Mentorship'];
  }

  if (fullText.includes('urgent') || fullText.includes('immediately') || fullText.includes('asap') || fullText.includes('deadline tomorrow')) {
    urgency = 'High (Urgent)';
  }

  const coreProblem = title.length > 0 ? title : description.slice(0, 90) + '...';

  const defaultTags = [category.split(' ')[0], 'OverThink-Verified', urgency];
  if (attachments && attachments.length > 0) {
    defaultTags.push(`${attachments.length} Attachment(s)`);
  }

  return {
    category,
    matchedSkills,
    urgency,
    coreProblem,
    tags: defaultTags,
    aiAnalyzedAt: new Date().toISOString()
  };
}

export function generateAISolution(thought) {
  const { title, category } = thought;
  const timestamp = new Date().toISOString();

  let actionPlan = [];
  let tools = [];
  let executiveSummary = '';

  if (category === 'Career & Jobs') {
    executiveSummary = `Based on our AI analysis of your query regarding "${title}", the primary hurdle is likely portfolio signaling and ATS misalignment rather than core competence.`;
    actionPlan = [
      {
        step: 1,
        title: 'Revamp ATS Compatibility & Targeted Keywords',
        details: 'Audit your resume with modern ATS scanners. Match 80%+ of keywords from specific job descriptions in your projects section.'
      },
      {
        step: 2,
        title: 'Deploy 2 High-Visibility Production Proofs',
        details: 'Build or highlight two live, deployed projects solving non-trivial business challenges rather than tutorial clones.'
      },
      {
        step: 3,
        title: 'Targeted Referral Sourcing',
        details: 'Reach out to Engineering Leads and Senior Consultants with a 3-bullet value proposition instead of cold application portals.'
      },
      {
        step: 4,
        title: 'Mock Interview Feedback Loop',
        details: 'Practice system design and behavioral STAR methodology with human mentors on OverThink.'
      }
    ];
    tools = ['Overleaf / LaTeX CV', 'Jobscan ATS Analyzer', 'GitHub Live Demos', 'LinkedIn Boolean Search'];
  } else if (category === 'Business & Startups' || category === 'Marketing & Growth') {
    executiveSummary = `Your business proposition "${title}" has distinct potential. The immediate priority must be aggressive validation and low-CAC acquisition experiments before heavy capital expenditure.`;
    actionPlan = [
      {
        step: 1,
        title: 'Problem-Solution Validation Interviews',
        details: 'Interview 20 prospective target users within your niche. Confirm that the pain point is top 3 in their daily priorities.'
      },
      {
        step: 2,
        title: 'Concierge MVP or Interactive Prototype',
        details: 'Deliver the core value manually or via a streamlined landing page to pre-sell before building full software/hardware.'
      },
      {
        step: 3,
        title: 'Organic Distribution Channel Test',
        details: 'Publish 3 in-depth case studies or product teardowns across LinkedIn & X highlighting the problem you solve.'
      },
      {
        step: 4,
        title: 'Unit Economics Blueprint',
        details: 'Define your LTV to CAC ratio target (aim for >3:1) and payback period under 6 months.'
      }
    ];
    tools = ['Typeform Discovery', 'Carrd / Webflow Landing Page', 'Stripe Pre-orders', 'Linear Product Tracking'];
  } else {
    executiveSummary = `Analysis completed for "${title}". We have identified key leverage points to unblock your current hurdle efficiently.`;
    actionPlan = [
      {
        step: 1,
        title: 'Root Cause Deconstruction',
        details: 'Isolate the core bottleneck into measurable inputs and external dependencies.'
      },
      {
        step: 2,
        title: 'Rapid Experimentation Sprint',
        details: 'Implement an agile 48-hour prototype testing the riskiest assumption first.'
      },
      {
        step: 3,
        title: 'Benchmark Against Industry Standards',
        details: 'Cross-reference verified patterns used by top practitioners in this domain.'
      },
      {
        step: 4,
        title: 'Consultant Deep-Dive Consultation',
        details: 'Schedule a 1-on-1 video deep dive with an assigned OverThink specialist.'
      }
    ];
    tools = ['Notion Strategy Board', 'Miro Architecture Canvas', 'OverThink Video Room'];
  }

  return {
    id: 'ai-sol-' + Date.now(),
    isAIGenerated: true,
    author: {
      name: 'OverThink Intelligence AI',
      role: 'Automated 24h Fallback Engine (OverThink AI v4)',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      badge: 'Certified AI Engine'
    },
    createdAt: timestamp,
    executiveSummary,
    actionPlan,
    recommendedTools: tools,
    nextStepsPrompt: 'A verified human consultant can review this AI solution, customize the roadmap, and schedule a 1-on-1 consultation session with you.',
    disclaimer: 'This solution was automatically generated by the OverThink 24-Hour Fallback Guarantee Engine because no human consultant accepted the submission within 24 hours.'
  };
}
