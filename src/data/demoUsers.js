export const DEMO_USERS = [
  {
    id: 'client_001',
    name: 'Alex Morgan',
    role: 'client',
    title: 'Startup Founder & Client',
    bio: 'Passionate about building scalable digital products and exploring modern solutions. Always looking for expert consultation.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: 'alex.morgan@overthink.platform',
    mobile: '9876543210',
    password: 'password123',
    isVerified: true,
    label: 'Demo Client',
    location: 'San Francisco, CA',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'client_002',
    name: 'Sarah Jenkins',
    role: 'client',
    title: 'E-commerce & Brand Director',
    bio: 'Managing multichannel e-commerce operations. Seeking expert guidance on performance marketing and conversion optimization.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    email: 'sarah.jenkins@overthink.platform',
    mobile: '9876543213',
    password: 'password123',
    isVerified: true,
    label: 'Demo Client 2',
    location: 'New York, NY',
    createdAt: '2026-01-16T11:00:00.000Z'
  },
  {
    id: 'consultant_001',
    name: 'Dr. Elena Vance',
    role: 'consultant',
    title: 'Principal Product & Cloud Solutions Architect',
    bio: '14+ years designing high-throughput distributed systems and scaling early-stage B2B products.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    email: 'elena.vance@overthink.platform',
    mobile: '9876543211',
    password: 'password123',
    isVerified: true,
    assessmentPassed: true,
    assessmentScore: '15/15',
    label: 'Demo Consultant 1',
    hourlyRate: 150,
    rating: 4.98,
    reviewsCount: 142,
    responseTime: '< 2 hours',
    completedConsultations: 89,
    earningsTotal: 34500,
    location: 'Seattle, WA (Remote)',
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
        tag: 'Fintech / Systems'
      },
      {
        id: 'port-2',
        title: 'B2B HealthTech HIPAA Cloud Migration',
        description: 'Complete architecture redesign ensuring zero downtime and 100% HIPAA compliance.',
        tag: 'Cloud & Security'
      }
    ],
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'consultant_002',
    name: 'Marcus Sterling',
    role: 'consultant',
    title: 'Tech Career Strategist & Former Senior Recruiter',
    bio: 'Guided 350+ engineers, product managers, and leaders to land top-tier offers. Specializing in technical growth and roadmap execution.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    email: 'marcus.sterling@overthink.platform',
    mobile: '9876543212',
    password: 'password123',
    isVerified: true,
    assessmentPassed: true,
    assessmentScore: '15/15',
    label: 'Demo Consultant 2',
    hourlyRate: 110,
    rating: 4.95,
    reviewsCount: 218,
    responseTime: '< 1 hour',
    completedConsultations: 164,
    earningsTotal: 42000,
    location: 'Austin, TX',
    skills: ['Career Transition', 'Resume ATS Overhaul', 'Executive Compensation', 'FAANG Interview Prep', 'LinkedIn Brand Optimization'],
    services: [
      { id: 'srv-m1', title: 'Complete Resume & LinkedIn Profile Transformation', price: 220, duration: 'Full Rewrite + 45m Call' },
      { id: 'srv-m2', title: 'Mock Technical & Behavioral Interview Intensive', price: 150, duration: '60 min High-Stakes Simulation' }
    ],
    experience: [
      { id: 'exp-m1', company: 'Meta', role: 'Lead Technical Talent Partner', period: '2020 - 2024', description: 'Scaled senior and staff engineering hiring across core infra teams.' },
      { id: 'exp-m2', company: 'Uber', role: 'Senior Talent Acquisition', period: '2017 - 2020', description: 'Built technical recruiting playbooks for distributed backend teams.' }
    ],
    education: [
      { id: 'edu-m1', school: 'University of Texas at Austin', degree: 'B.A. in Organizational Psychology', year: '2014' }
    ],
    certifications: ['SHRM Senior Certified Professional', 'Certified Career Management Coach'],
    portfolio: [
      {
        id: 'port-m1',
        title: 'Senior Developer to Engineering Director Roadmap',
        description: 'Structured 90-day portfolio, interview narrative, and compensation negotiation strategy.',
        tag: 'Career Success'
      }
    ],
    createdAt: '2026-01-12T09:00:00.000Z'
  }
];
