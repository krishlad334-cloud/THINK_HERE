export const INITIAL_USERS = {
  client: {
    id: 'user-client-1',
    name: 'Alex Morgan',
    role: 'client',
    email: 'alex.morgan@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Startup Founder & Tech Innovator',
    bio: 'Passionate about building scalable digital products and exploring modern AI solutions. Always looking for expert consultation.',
    location: 'San Francisco, CA',
    joinedDate: 'Jan 2026',
    savedSolutionsCount: 5,
    activeThoughtsCount: 3,
    badges: ['Verified Client', 'Early Pioneer']
  },
  consultant: {
    id: 'user-cons-1',
    name: 'Dr. Elena Vance',
    role: 'consultant',
    email: 'elena.vance@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Principal Product & Cloud Solutions Architect | ex-Stripe & AWS Advisor',
    rating: 4.98,
    reviewsCount: 142,
    hourlyRate: 150,
    responseTime: '< 2 hours',
    completedConsultations: 89,
    earningsTotal: 34500,
    isVerified: true,
    verificationStatus: 'approved',
    location: 'Seattle, WA (Remote)',
    bio: '14+ years designing high-throughput distributed systems and scaling early-stage B2B products from 0 to $20M ARR. Passionate about mentoring founders and unblocking technical bottlenecks.',
    skills: ['System Architecture', 'AWS / Cloud Native', 'PostgreSQL Tuning', 'Go-To-Market', 'Product Strategy', 'Microservices', 'Engineering Leadership'],
    services: [
      { id: 'srv-1', title: 'Deep Architectural Review & Bottleneck Audit', price: 300, duration: '90 min Video + Detailed Report' },
      { id: 'srv-2', title: 'Tech Stack & Cloud Scalability Strategy', price: 180, duration: '60 min Consultation' },
      { id: 'srv-3', title: 'Monthly Fractional CTO & Advisory Retainer', price: 2500, duration: '4 Weekly Sprints' }
    ],
    experience: [
      { id: 'exp-1', company: 'Global Cloud Systems', role: 'Chief Technical Advisor', period: '2023 - Present', description: 'Advising high-growth fintechs and SaaS startups on distributed scale.' },
      { id: 'exp-2', company: 'Stripe Engineering', role: 'Staff Systems Engineer', period: '2019 - 2023', description: 'Led data pipeline reliability and multi-region failover protocols.' },
      { id: 'exp-3', company: 'Amazon Web Services', role: 'Senior Solutions Architect', period: '2015 - 2019', description: 'Consulted Fortune 500 enterprises transitioning to cloud microservices.' }
    ],
    education: [
      { id: 'edu-1', school: 'Stanford University', degree: 'Ph.D. in Computer Systems', year: '2015' },
      { id: 'edu-2', school: 'UC Berkeley', degree: 'B.S. in Electrical Engineering & Computer Sciences', year: '2010' }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Professional',
      'Google Cloud Certified Fellow',
      'Certified Scrum Professional & Agile Mentor'
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'Fintech High-Frequency Ledger Scaling',
        description: 'Reduced sub-50ms latency across 12M daily transactions via distributed caching and partitioning.',
        link: 'https://github.com/overthink-case-studies/ledger',
        tag: 'Fintech / Systems'
      },
      {
        id: 'port-2',
        title: 'B2B HealthTech HIPAA Cloud Migration',
        description: 'Complete architecture redesign ensuring zero downtime and 100% HIPAA compliance.',
        link: 'https://healthtech.demo/architecture',
        tag: 'Cloud & Security'
      }
    ]
  },
  admin: {
    id: 'user-admin-1',
    name: 'OverThink Platform Operations & Compliance',
    role: 'admin',
    email: 'admin@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Platform Chief Moderator',
    permissions: ['all_access', 'verify_consultants', 'moderate_thoughts', 'audit_privacy', 'trigger_ai_fallback']
  }
};

export const MOCK_CONSULTANTS = [
  INITIAL_USERS.consultant,
  {
    id: 'user-cons-2',
    name: 'Marcus Sterling',
    role: 'consultant',
    email: 'marcus.sterling@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    title: 'Tech Career Strategist & Former Senior Recruiter @ Meta & Uber',
    rating: 4.95,
    reviewsCount: 218,
    hourlyRate: 110,
    responseTime: '< 1 hour',
    completedConsultations: 164,
    earningsTotal: 42000,
    isVerified: true,
    verificationStatus: 'approved',
    location: 'Austin, TX',
    bio: 'Guided 350+ engineers, product managers, and leaders to land top-tier $200k-$600k offers. Specializing in resume ATS overhaul, portfolio storytelling, and interview psychology.',
    skills: ['Career Transition', 'Resume ATS Overhaul', 'Executive Compensation', 'FAANG Interview Prep', 'LinkedIn Brand Optimization'],
    services: [
      { id: 'srv-m1', title: 'Complete Resume & LinkedIn Profile Transformation', price: 220, duration: 'Full Rewrite + 45m Call' },
      { id: 'srv-m2', title: 'Mock Technical & Behavioral Interview Intensive', price: 150, duration: '60 min High-Stakes Simulation' }
    ],
    experience: [
      { id: 'exp-m1', company: 'Meta', role: 'Lead Technical Talent Partner', period: '2020 - 2024' },
      { id: 'exp-m2', company: 'Uber', role: 'Senior Talent Acquisition', period: '2017 - 2020' }
    ],
    education: [
      { id: 'edu-m1', school: 'University of Texas at Austin', degree: 'B.A. in Organizational Psychology', year: '2014' }
    ],
    certifications: ['SHRM Senior Certified Professional', 'Certified Career Management Coach'],
    portfolio: [
      { id: 'port-m1', title: 'Senior Developer to Engineering Director Roadmap', tag: 'Career Success' }
    ]
  },
  {
    id: 'user-cons-3',
    name: 'Priya Sharma',
    role: 'consultant',
    email: 'priya.sharma@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    title: 'Startup Growth Lead & Fractional CMO | Exited Founder ($14M)',
    rating: 4.92,
    reviewsCount: 96,
    hourlyRate: 140,
    responseTime: '< 3 hours',
    completedConsultations: 71,
    earningsTotal: 28900,
    isVerified: true,
    verificationStatus: 'approved',
    location: 'New York, NY',
    bio: 'Specialist in bootstrapping product launches, zero-CAC viral growth loops, B2B outbound, and investor pitch deck positioning.',
    skills: ['Go-To-Market Strategy', 'Product Marketing', 'Viral Loops', 'B2B Sales Funnels', 'Pitch Deck Narrative'],
    services: [
      { id: 'srv-p1', title: 'Product Launch & GTM Blueprint', price: 280, duration: '90 min Strategy + 10-page Playbook' }
    ],
    experience: [
      { id: 'exp-p1', company: 'VentureScale Labs', role: 'Head of Growth', period: '2022 - Present' }
    ],
    education: [
      { id: 'edu-p1', school: 'Columbia Business School', degree: 'MBA in Venture Innovation', year: '2018' }
    ],
    certifications: ['Reforge Growth Series Graduate'],
    portfolio: [
      { id: 'port-p1', title: 'SaaS Zero to $1M ARR in 9 Months Playbook', tag: 'Growth Case Study' }
    ]
  },
  {
    id: 'user-cons-4',
    name: 'David Chen',
    role: 'consultant',
    email: 'david.chen@overthink.platform',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    title: 'Design Director & UI/UX Specialist | Red Dot Award Winner',
    rating: 4.97,
    reviewsCount: 110,
    hourlyRate: 125,
    responseTime: '< 2 hours',
    completedConsultations: 82,
    earningsTotal: 31000,
    isVerified: true,
    verificationStatus: 'approved',
    location: 'San Francisco, CA',
    bio: 'Transforming complex web and mobile workflows into elegant, intuitive digital experiences that convert users.',
    skills: ['UI/UX Design', 'Design Systems', 'Figma Mastery', 'Usability Auditing', 'Mobile App Prototyping'],
    services: [
      { id: 'srv-d1', title: 'Comprehensive UI/UX Product Teardown', price: 250, duration: 'Video Teardown + Figma File' }
    ],
    experience: [
      { id: 'exp-d1', company: 'Chen Design Studio', role: 'Principal Designer', period: '2019 - Present' }
    ],
    education: [
      { id: 'edu-d1', school: 'Rhode Island School of Design', degree: 'B.F.A. in Industrial & Interaction Design', year: '2016' }
    ],
    certifications: ['Nielsen Norman Group UX Master Certified'],
    portfolio: [
      { id: 'port-d1', title: 'Crypto Wallet UX Redesign (+64% Retention)', tag: 'Product Design' }
    ]
  }
];

export const INITIAL_THOUGHTS = [
  {
    id: 'thought-1',
    clientId: 'user-client-1',
    clientName: 'Alex Morgan',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Looking for a job in the IT industry, but not getting interview opportunities despite applying to 60+ roles.',
    description: 'I have 3 years of experience in Python and full-stack React development, but my applications seem to get lost in ATS screening. I am wondering if my resume layout is wrong or if I need more high-impact projects on GitHub.',
    category: 'Career & Jobs',
    urgency: 'High (Urgent)',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 24,
    status: 'in_consultation',
    assignedConsultantId: 'user-cons-2',
    assignedConsultantName: 'Marcus Sterling',
    assignedConsultantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    attachments: [
      { id: 'att-1', name: 'Software_Engineer_Resume_2026.pdf', type: 'document', size: '1.2 MB' }
    ],
    tags: ['Career & Jobs', 'Python Developer', 'ATS Optimization', 'Resume Review'],
    aiAnalysis: {
      coreProblem: 'ATS keyword mismatch and passive project impact statements.',
      suggestedSpecialists: ['Tech Recruiter', 'Career Strategist'],
      confidenceScore: '94%'
    },
    solutions: [
      {
        id: 'sol-h-1',
        isAIGenerated: false,
        author: {
          id: 'user-cons-2',
          name: 'Marcus Sterling',
          role: 'Tech Career Strategist & Former Senior Recruiter @ Meta',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
          badge: 'Verified Career Expert'
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        executiveSummary: 'I reviewed your resume PDF. The core issue is that 80% of your bullets state what you used (e.g. "Built REST API in Python") rather than business outcomes (e.g. "Reduced query latency by 45% and handled 100k daily requests"). Here is your targeted plan.',
        actionPlan: [
          { step: 1, title: 'Reframe Bullets with Google XYZ Formula', details: 'Accomplished [X] as measured by [Y] by doing [Z]. This bypasses ATS filters immediately.' },
          { step: 2, title: 'Pin 1 End-to-End Deployed Architecture on GitHub', details: 'Add live deployment URL, architecture diagram, and load-testing proof in README.' },
          { step: 3, title: 'Targeted Second-Degree Referral Strategy', details: 'Message engineering managers directly with a 30-second loom or 3-bullet pitch.' }
        ],
        recommendedTools: ['ResumeWorded', 'Jobscan ATS', 'Overleaf LaTeX Template'],
        nextStepsPrompt: 'I have started our direct chat room. Join me to review your rewritten resume section by section.'
      }
    ],
    isSaved: true
  },
  {
    id: 'thought-2',
    clientId: 'user-client-1',
    clientName: 'Alex Morgan',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Created a smart insulated water bottle with hydration tracking. How do I improve and market it to get genuine buyers?',
    description: 'We built a physical prototype with Bluetooth and LED reminders. We are stuck on whether to target athletes or office professionals, and how to create content that converts without spending thousands on Facebook ads.',
    category: 'Product & Innovation',
    urgency: 'Standard',
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 24,
    status: 'pending_human',
    assignedConsultantId: null,
    assignedConsultantName: null,
    attachments: [
      { id: 'att-2', name: 'SmartBottle_Prototype_V2.png', type: 'image', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80', size: '2.8 MB' }
    ],
    tags: ['Product & Innovation', 'Hardware MVP', 'Go-To-Market', 'Branding'],
    aiAnalysis: {
      coreProblem: 'Target demographic ambiguity and lack of organic distribution flywheel.',
      suggestedSpecialists: ['Product Marketing', 'Hardware Prototyping', 'E-commerce Growth'],
      confidenceScore: '91%'
    },
    solutions: [],
    isSaved: false
  },
  {
    id: 'thought-3',
    clientId: 'user-client-1',
    clientName: 'Alex Morgan',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Launching a B2B AI-driven local farm supply logistics platform. Need competitor analysis and pricing model.',
    description: 'Small farmers lose 30% of perishable produce before reaching regional retailers due to fragmented cold-storage trucking. We want to aggregate small truck fleets with a dynamic booking app.',
    category: 'Business & Startups',
    urgency: 'Standard',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 24,
    status: 'ai_fallback',
    assignedConsultantId: null,
    assignedConsultantName: null,
    attachments: [],
    tags: ['Business & Startups', 'Logistics AgTech', 'Unit Economics', '24h-AI-Fallback'],
    aiAnalysis: {
      coreProblem: 'Two-sided marketplace chicken-and-egg problem in supply aggregation.',
      suggestedSpecialists: ['AgTech Advisor', 'Supply Chain Consultant'],
      confidenceScore: '96%'
    },
    solutions: [
      {
        id: 'ai-sol-fallback-3',
        isAIGenerated: true,
        author: {
          name: 'OverThink Intelligence AI',
          role: 'Automated 24h Fallback Engine (OverThink AI v4)',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          badge: 'Certified AI Engine'
        },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        executiveSummary: 'This submission reached the 24-hour response deadline. OverThink AI has generated this actionable business blueprint. To overcome the cold-start problem, anchor demand first with 3 commercial wholesalers rather than recruiting hundreds of individual drivers.',
        actionPlan: [
          { step: 1, title: 'Single-Route Micro-Corridor Pilot', details: 'Limit your trial to one 50-mile agricultural corridor with high tomato/berry density. Guarantee truck capacity manually before software build.' },
          { step: 2, title: 'Take-Rate vs SaaS Hybrid Model', details: 'Charge a 8-10% take-rate on successful deliveries, or offer cold-chain telemetry tracking as a $49/month IoT subscription.' },
          { step: 3, title: 'Regulatory Compliance & Food Safety Check', details: 'Verify regional cold-chain transport regulations (FDA FSMA compliance) to shield liability.' },
          { step: 4, title: 'Human Consultant Review Recommendation', details: 'Schedule a session with an AgTech supply chain mentor on OverThink to stress-test your fuel-cost margins.' }
        ],
        recommendedTools: ['FreightWaves Freight Data', 'Mapbox Route Optimizer', 'Stripe Connect Multi-party Escrow'],
        nextStepsPrompt: 'Human consultants can still review this AI solution and provide custom operational guidance.',
        disclaimer: 'This solution was automatically generated by the OverThink 24-Hour Fallback Guarantee Engine because no human consultant accepted the submission within 24 hours.'
      }
    ],
    isSaved: true
  },
  {
    id: 'thought-4',
    clientId: 'user-client-1',
    clientName: 'Alex Morgan',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Optimizing PostgreSQL database for 10 million telemetry events with sub-50ms latency.',
    description: 'Our IoT telemetry table is locking under heavy write spikes. We are looking into timescaleDB, connection pooling with PgBouncer, and partition strategies.',
    category: 'Technology & IT',
    urgency: 'Standard',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    deadlineHours: 24,
    status: 'in_consultation',
    assignedConsultantId: 'user-cons-1',
    assignedConsultantName: 'Dr. Elena Vance',
    assignedConsultantAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    attachments: [
      { id: 'att-4', name: 'Database_Schema_Explain_Analyze.txt', type: 'document', size: '480 KB' }
    ],
    tags: ['Technology & IT', 'PostgreSQL', 'High Concurrency', 'Database Architecture'],
    aiAnalysis: {
      coreProblem: 'Table bloat and unindexed write contention during sequential ingest.',
      suggestedSpecialists: ['Cloud Architect', 'PostgreSQL DBA'],
      confidenceScore: '98%'
    },
    solutions: [
      {
        id: 'sol-h-4',
        isAIGenerated: false,
        author: {
          id: 'user-cons-1',
          name: 'Dr. Elena Vance',
          role: 'Principal Product & Cloud Solutions Architect',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
          badge: 'Verified Solutions Architect'
        },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        executiveSummary: 'I examined your EXPLAIN ANALYZE logs. The sequential scan on your timestamp index is choking during WAL flushes. You should implement declarative partitioning by range (daily or weekly chunks) and buffer ingest via Redis Streams before batching into Postgres.',
        actionPlan: [
          { step: 1, title: 'Range Partitioning by Time', details: 'Partition your events table into weekly partitions. Dropping older partitions will be instantaneous without VACUUM locks.' },
          { step: 2, title: 'Introduce Ingest In-Memory Buffer', details: 'Push raw pings to Redis Streams or Apache Kafka. Flush micro-batches of 1,000 rows into Postgres using COPY command.' },
          { step: 3, title: 'Tune WAL and Checkpoint Settings', details: 'Increase max_wal_size to 16GB and checkpoint_completion_target to 0.9 to smooth out disk I/O spikes.' }
        ],
        recommendedTools: ['PgBouncer', 'TimescaleDB Extension', 'pghero Performance Monitor'],
        nextStepsPrompt: 'Let us hop on our video call in the OverThink Consultation Room to live-tune your configuration.'
      }
    ],
    isSaved: true
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-t1-1',
    thoughtId: 'thought-1',
    senderId: 'user-client-1',
    senderName: 'Alex Morgan',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Hi Marcus! I have applied to 60+ roles with my Python and React background, but I am barely getting any interview callbacks. I attached my resume (Software_Engineer_Resume.pdf) — could you check if my ATS formatting or project descriptions are letting me down?',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    attachments: [{ name: 'Software_Engineer_Resume.pdf', size: '240 KB' }]
  },
  {
    id: 'msg-t1-2',
    thoughtId: 'thought-1',
    senderId: 'user-cons-2',
    senderName: 'Marcus Sterling',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    text: 'Hello Alex! I just reviewed your resume and GitHub profile. Your technical foundation is very strong, but your bullet points currently read like job duties rather than quantifiable business impact. Most modern ATS algorithms (and FAANG recruiters) rank resumes higher when they see clear numbers: e.g. "Reduced API p99 latency from 450ms to 85ms" or "Scaled Postgres read throughput by 3x".',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },
  {
    id: 'msg-t1-3',
    thoughtId: 'thought-1',
    senderId: 'user-client-1',
    senderName: 'Alex Morgan',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'That makes total sense! I actually built an in-memory distributed cache project with Redis and Python asyncio that handled 12k concurrent connections. Should I move that to the very top of my resume?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },
  {
    id: 'msg-t1-4',
    thoughtId: 'thought-1',
    senderId: 'user-cons-2',
    senderName: 'Marcus Sterling',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    text: '100% yes! That distributed cache is an instant interview-winner. I have prepared an ATS-optimized rewrite of your headline and top 3 experience sections. Whenever you are ready, click "Live Video Call" in the header and we can do a 15-minute live screen share to finalize it together!',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },

  {
    id: 'msg-t2-1',
    thoughtId: 'thought-2',
    senderId: 'user-client-1',
    senderName: 'Alex Morgan',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Hi Dr. Elena! We built a functional Bluetooth LE hardware prototype with hydration telemetry, but we are debating whether to sell direct-to-consumer or partner with corporate corporate wellness programs.',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    attachments: [{ name: 'Prototype_Telemetry_Spec.pdf', size: '1.2 MB' }]
  },
  {
    id: 'msg-t2-2',
    thoughtId: 'thought-2',
    senderId: 'user-cons-1',
    senderName: 'Dr. Elena Vance',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    text: 'Hello Alex! B2B corporate wellness is dramatically superior for early-stage cashflow. B2C consumer hardware CAC on Meta/Google is currently $65-$85 per unit, which destroys margins. Corporate employers, on the other hand, buy batches of 200-500 bottles and pay an annual $5/employee/mo software dashboard fee for company fitness challenges. Let us discuss this on video!',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },

  {
    id: 'msg-t3-1',
    thoughtId: 'thought-3',
    senderId: 'user-client-1',
    senderName: 'Alex Morgan',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'How should we solve the driver cold-start problem for regional vegetable growers? We have 14 farms interested but only 3 verified refrigerated trucks.',
    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },
  {
    id: 'msg-t3-2',
    thoughtId: 'thought-3',
    senderId: 'user-cons-3',
    senderName: 'Priya Sharma',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    text: 'Anchor demand with 2 large wholesale distributors first before signing smaller independent drivers. Guarantee truck capacity manually on a single 40-mile corridor. I have verified your AI fallback blueprint above.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },

  {
    id: 'msg-t4-1',
    thoughtId: 'thought-4',
    senderId: 'user-cons-1',
    senderName: 'Dr. Elena Vance',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    text: 'Hello Alex! I reviewed your database telemetry logs and submitted the initial architecture solution above. How is your current connection pooling configured?',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },
  {
    id: 'msg-t4-2',
    thoughtId: 'thought-4',
    senderId: 'user-client-1',
    senderName: 'Alex Morgan',
    senderRole: 'client',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Hi Dr. Elena! Thank you for the lightning-fast response. We currently have direct pool connections from our 12 Node.js worker containers, each holding up to 20 connections, which caps Postgres at around 240 active clients.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    attachments: []
  },
  {
    id: 'msg-t4-3',
    thoughtId: 'thought-4',
    senderId: 'user-cons-1',
    senderName: 'Dr. Elena Vance',
    senderRole: 'consultant',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    text: 'That explains the lock contention! 240 direct connections causes massive context-switching overhead in Postgres. Putting PgBouncer in transaction pooling mode will drop active connections to 15-20 while easily handling 20,000 requests/sec. Would you like to jump on a quick 15-minute consultation video call right here in OverThink to test this?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    attachments: []
  }
];

export { INITIAL_JOBS } from './jobsCatalog';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipientRole: 'client',
    title: 'New Consultant Response Received',
    message: 'Dr. Elena Vance provided an in-depth architecture solution for your PostgreSQL telemetry thought.',
    type: 'solution_received',
    linkThoughtId: 'thought-4',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'notif-2',
    recipientRole: 'client',
    title: '24-Hour AI Fallback Solution Generated',
    message: 'Your thought "B2B AI Farm Logistics" reached the 24-hr mark. OverThink AI has generated a complete step-by-step blueprint.',
    type: 'ai_fallback',
    linkThoughtId: 'thought-3',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'notif-3',
    recipientRole: 'consultant',
    title: 'New Incoming Thought Matched to Your Skills',
    message: 'Alex Morgan submitted "Looking for a job in IT industry". Matched your ATS & Career Coaching expertise.',
    type: 'thought_matched',
    linkThoughtId: 'thought-1',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false
  },
  {
    id: 'notif-4',
    recipientRole: 'admin',
    title: 'Platform Audit Alert',
    message: 'Contact Privacy Guard verified: In-platform message transmission is running 100% compliant with zero external leaks.',
    type: 'system_audit',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: true
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    type: 'PRIVACY_SHIELD',
    actor: 'System Guard',
    details: 'Monitored 14 active chat messages for email/phone number leakage. Zero off-platform contact violations detected.',
    severity: 'info',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'log-2',
    type: 'AI_FALLBACK_TRIGGER',
    actor: 'OverThink 24h Engine',
    details: 'Automatic fallback activated for Thought #thought-3 ("Farm Supply Logistics") after 24 hours of open review.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'log-3',
    type: 'CONSULTANT_VERIFIED',
    actor: 'Admin Moderation',
    details: 'Verified credentials, degrees, and portfolio for Dr. Elena Vance (Principal Solutions Architect).',
    severity: 'success',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'log-4',
    type: 'OWNERSHIP_CLAIMED',
    actor: 'Marcus Sterling',
    details: 'Consultant accepted ownership of Thought #thought-1 ("IT Job Opportunities"). Conflict check passed.',
    severity: 'info',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

export const TOPIC_SUGGESTIONS = [
  { label: 'Career & Job Opportunities', icon: 'Briefcase', prompt: 'I am a Python developer looking to get interview calls at top tech companies. How can I stand out?' },
  { label: 'Startup & Business Idea', icon: 'Lightbulb', prompt: 'I have a new B2B SaaS startup idea. How do I validate target customer pain points and build an MVP?' },
  { label: 'Product & Marketing Growth', icon: 'TrendingUp', prompt: 'I built an innovative product. How do I improve organic distribution without massive ad spend?' },
  { label: 'Technology & Cloud Architecture', icon: 'Cpu', prompt: 'How do I architect high-concurrency database queries with sub-50ms response times?' },
  { label: 'UI/UX & Creative Innovation', icon: 'Palette', prompt: 'Review my mobile application user journey to optimize onboarding retention.' },
  { label: 'Personal Growth & Strategy', icon: 'Target', prompt: 'How do I manage high-stress executive decision making and prevent burnout?' }
];
