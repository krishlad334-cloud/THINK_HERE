export const SKILL_TAXONOMY = [
  { label: 'HTML & CSS', aliases: ['html', 'html5', 'css', 'css3', 'scss', 'sass', 'tailwind', 'tailwindcss', 'bootstrap'], industry: 'IT & Software' },
  { label: 'JavaScript / TypeScript', aliases: ['javascript', 'js', 'typescript', 'ts', 'node.js', 'nodejs', 'express', 'express.js'], industry: 'IT & Software' },
  { label: 'React / Next.js', aliases: ['react', 'reactjs', 'react.js', 'next.js', 'nextjs', 'redux', 'vite'], industry: 'IT & Software' },
  { label: 'Python', aliases: ['python', 'fastapi', 'django', 'flask', 'pandas', 'numpy'], industry: 'IT & Software' },
  { label: 'Java / C++ / C#', aliases: ['java', 'spring boot', 'c++', 'c#', '.net', 'php', 'laravel', 'oop'], industry: 'IT & Software' },
  { label: 'Databases & SQL', aliases: ['postgresql', 'postgres', 'sql', 'mysql', 'mongodb', 'firebase', 'supabase', 'redis'], industry: 'IT & Software' },
  { label: 'Git & Version Control', aliases: ['git', 'github', 'gitlab', 'bitbucket'], industry: 'IT & Software' },
  { label: 'AWS / Cloud & DevOps', aliases: ['aws', 'amazon web services', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ci/cd', 'linux'], industry: 'IT & Software' },
  { label: 'REST APIs & Architecture', aliases: ['rest api', 'restful', 'api', 'graphql', 'microservices', 'full-stack', 'fullstack', 'web development'], industry: 'IT & Software' },
  { label: 'AI & Data Science', aliases: ['machine learning', 'deep learning', 'data science', 'data analysis', 'power bi', 'tableau', 'nlp', 'llm'], industry: 'IT & Software' },
  { label: 'Cybersecurity', aliases: ['cybersecurity', 'network security', 'iam', 'infosec', 'penetration testing', 'siem'], industry: 'IT & Software' },

  { label: 'Patient Care', aliases: ['patient care', 'bedside care', 'clinical care', 'acute care', 'icu', 'medical'], industry: 'Healthcare' },
  { label: 'Clinical Triage & Nursing', aliases: ['triage', 'clinical operations', 'nursing', 'registered nurse'], industry: 'Healthcare' },
  { label: 'HIPAA & Clinical Compliance', aliases: ['hipaa', 'joint commission', 'patient privacy', 'clinical safety'], industry: 'Healthcare' },
  { label: 'EHR Systems', aliases: ['ehr', 'electronic health record', 'epic', 'cerner', 'hl7', 'fhir', 'emr'], industry: 'Healthcare' },
  { label: 'Care Coordination', aliases: ['care coordination', 'staff scheduling', 'clinical informatics', 'hospital operations'], industry: 'Healthcare' },

  { label: 'Curriculum & Teaching', aliases: ['curriculum', 'lesson plan', 'pedagogy', 'teaching', 'classroom', 'tutoring'], industry: 'Education' },
  { label: 'Instructional Design', aliases: ['instructional design', 'course authoring', 'e-learning', 'faculty'], industry: 'Education' },
  { label: 'LMS Administration', aliases: ['canvas', 'blackboard', 'moodle', 'lms', 'google classroom'], industry: 'Education' },
  { label: 'Student Assessment', aliases: ['rubric', 'academic advising', 'student counseling', 'edtech'], industry: 'Education' },

  { label: 'Financial Modeling', aliases: ['financial modeling', 'dcf', 'valuation', 'fp&a', 'forecasting'], industry: 'Finance' },
  { label: 'Budgeting & Variance', aliases: ['budgeting', 'variance analysis', 'p&l', 'financial reporting', 'accounting'], industry: 'Finance' },
  { label: 'GAAP & Auditing', aliases: ['gaap', 'ifrs', 'auditing', 'internal controls', 'sox', 'tally'], industry: 'Finance' },
  { label: 'Tax & ERP Finance', aliases: ['tax compliance', 'tax preparation', 'corporate tax', 'quickbooks', 'netsuite', 'gst'], industry: 'Finance' },
  { label: 'Excel & Analytics', aliases: ['excel', 'ms excel', 'vba', 'pivot tables', 'spreadsheet'], industry: 'Finance' },

  { label: 'AutoCAD / Civil Engineering', aliases: ['autocad', 'civil 3d', 'site grading', 'surveying'], industry: 'Engineering' },
  { label: 'Structural Analysis', aliases: ['structural analysis', 'building codes', 'bridge design', 'staad'], industry: 'Engineering' },
  { label: 'SolidWorks & Mechanical CAD', aliases: ['solidworks', 'cad', 'cam', 'mechanical design', 'finite element', 'catia', 'ansys'], industry: 'Engineering' },
  { label: 'Electrical & Automation PLC', aliases: ['plc', 'scada', 'robotics', 'industrial automation', 'thermodynamics', 'embedded'], industry: 'Engineering' },

  { label: 'Consultative & B2B Sales', aliases: ['b2b sales', 'consultative selling', 'cold outreach', 'prospecting', 'lead generation', 'sales'], industry: 'Sales' },
  { label: 'CRM & Pipeline Management', aliases: ['salesforce', 'hubspot', 'pipeline management', 'quota', 'zoho crm'], industry: 'Sales' },
  { label: 'Territory & Account Growth', aliases: ['territory growth', 'account management', 'upselling'], industry: 'Sales' },

  { label: 'SEO / SEM & Paid Media', aliases: ['seo', 'sem', 'google ads', 'paid acquisition', 'ppc', 'meta ads', 'social media'], industry: 'Marketing' },
  { label: 'Content & GTM Marketing', aliases: ['go-to-market', 'gtm', 'content strategy', 'copywriting', 'brand marketing', 'digital marketing'], industry: 'Marketing' },
  { label: 'Marketing Analytics', aliases: ['google analytics', 'ga4', 'a/b testing', 'lifecycle', 'demand generation', 'email marketing'], industry: 'Marketing' },

  { label: 'Public Policy & Governance', aliases: ['public policy', 'legislation', 'civic', 'urban planning', 'zoning', 'municipal'], industry: 'Government' },
  { label: 'Grant Management & GIS', aliases: ['grant writing', 'grant management', 'federal grant', 'gis', 'public administration'], industry: 'Government' },

  { label: 'Executive & Office Administration', aliases: ['executive assistant', 'office management', 'administrative', 'scheduling', 'sop', 'ms office', 'document control'], industry: 'Administration' },
  { label: 'Project & Vendor Coordination', aliases: ['project coordination', 'office operations', 'records'], industry: 'Administration' },

  { label: 'HR & Talent Acquisition', aliases: ['human resources', 'talent acquisition', 'onboarding', 'hris', 'payroll', 'recruiting', 'employee relations'], industry: 'Human Resources' },
  { label: 'Compensation & Performance Mgmt', aliases: ['salary benchmarking', 'performance management', 'workday', 'benefits'], industry: 'Human Resources' },

  { label: 'Figma & UI/UX Design', aliases: ['figma', 'ui/ux', 'design system', 'wireframing', 'wcag', 'user research', 'photoshop', 'illustrator', 'canva'], industry: 'Design & Creative' },

  { label: 'Legal & Regulatory Compliance', aliases: ['contract negotiation', 'gdpr', 'ccpa', 'legal research', 'paralegal', 'ediscovery', 'aml', 'kyc', 'patent'], industry: 'Legal & Compliance' },

  { label: 'Supply Chain & Logistics', aliases: ['supply chain', 'freight', 'inventory planning', 'sap erp', 'customs', 'logistics', 'warehouse', 'wms', '3pl'], industry: 'Supply Chain & Logistics' },

  { label: 'Banking & Credit Underwriting', aliases: ['commercial lending', 'underwriting', 'mortgage', 'actuarial', 'claims', 'banking', 'fraud risk'], industry: 'Banking & Insurance' },

  { label: 'Lean & Manufacturing QA', aliases: ['lean manufacturing', 'six sigma', 'kaizen', 'iso 9001', 'cnc', 'haccp', 'oee', 'osha'], industry: 'Manufacturing & Quality' },

  { label: 'Construction & Real Estate', aliases: ['procore', 'revit', 'bim', 'bluebeam', 'construction estimation', 'lease administration', 'argus'], industry: 'Construction & Real Estate' },

  { label: 'Hospitality & Event Ops', aliases: ['hotel operations', 'revpar', 'opera pms', 'concierge', 'culinary', 'event logistics'], industry: 'Hospitality & Tourism' },

  { label: 'Retail & E-Commerce Ops', aliases: ['shopify', 'merchandising', 'amazon seller', 'assortment planning', 'zendesk', 'ecommerce'], industry: 'Retail & E-Commerce' },

  { label: 'Media, Journalism & Docs', aliases: ['journalism', 'podcast', 'premiere pro', 'davinci resolve', 'technical writing', 'openapi', 'broadcast'], industry: 'Media & Communications' },

  { label: 'Pharma & Biotech R&D', aliases: ['fda', 'gmp', 'cgmp', 'gcp', 'clinical trials', 'pharmacology', 'hplc', 'chromatography', 'meddra', 'bioinformatics'], industry: 'Pharma & Biotechnology' },

  { label: 'Cross-Sector Operations', aliases: ['agronomy', 'esg', 'bess', 'aviation', 'strategy consulting', 'customer success', 'telecommunications'], industry: 'Other Sectors' },
];

export const QUALIFICATION_PATTERNS = [
  { label: 'Ph.D. / Doctorate', regex: /\b(ph\.?d|doctorate)\b/i },
  { label: 'J.D. / Law Degree (LLB / LLM)', regex: /\b(j\.?d\.?\b|llb|llm|bar admission)\b/i },
  { label: 'MBA (Business Administration)', regex: /\bmba\b/i },
  { label: 'MCA (Master of Computer Applications)', regex: /\b(mca|master of computer applications)\b/i },
  { label: 'MPA / MPP (Public Policy)', regex: /\b(mpa|mpp|master of public)\b/i },
  { label: 'M.Ed. (Master of Education)', regex: /\b(m\.?ed|master of education)\b/i },
  { label: 'Master Degree (M.S. / M.Tech / M.Sc / M.Com)', regex: /\b(m\.?s\.?\b|m\.?sc|m\.?tech|m\.?com|master of|master's)\b/i },
  { label: 'BCA (Bachelor of Computer Applications)', regex: /\b(bca|bachelor of computer applications)\b/i },
  { label: 'B.Tech / B.E. (Engineering / Tech)', regex: /\b(b\.?tech|b\.?e\.?\b|bachelor of engineering|bachelor of technology)\b/i },
  { label: 'B.Com / BBA / B.A. / B.Sc', regex: /\b(b\.?com|bba|b\.?sc|b\.?a\.?\b|b\.?s\.?\b|b\.?ed|b\.?f\.?a|bachelor)\b/i },
  { label: 'Registered Nurse / Healthcare (RN / BSN / MBBS)', regex: /\b(rn\b|registered nurse|bsn|msn|acls|bls|mbbs)\b/i },
  { label: 'Pharmacy & Clinical (PharmD / B.Pharm / RAC)', regex: /\b(pharmd|b\.?pharm|pharmacist|rac certified)\b/i },
  { label: 'CPA / CA (Chartered Accountant)', regex: /\b(cpa|chartered accountant)\b/i },
  { label: 'CFA / CPCU / ASA Finance & Insurance', regex: /\b(cfa|cpcu|asa|frm)\b/i },
  { label: 'PE / LEED Engineering License', regex: /\b(p\.?e\.?\b|professional engineer|leed)\b/i },
  { label: 'PMP / Agile / Scrum Certification', regex: /\b(pmp|scrum|agile certified)\b/i },
  { label: 'SHRM-CP / PHR Certification', regex: /\b(shrm|phr|sphr)\b/i },
  { label: 'AWS / Cloud / Google Certification', regex: /\b(aws certified|google cloud certified|azure certified)\b/i },
  { label: 'Six Sigma / OSHA Certification', regex: /\b(six sigma|osha|iso 9001)\b/i },
  { label: 'Technical / Vocational Diploma', regex: /\bdiploma\b/i },
];

export const INTEREST_SIGNALS = [
  { label: 'Software, Web & Cloud Engineering', aliases: ['software', 'web development', 'frontend', 'backend', 'full-stack', 'cloud', 'devops', 'react', 'python', 'javascript', 'ai'], industry: 'IT & Software' },
  { label: 'Healthcare Management & Patient Outcomes', aliases: ['patient', 'hospital', 'clinical', 'nursing', 'health equity', 'healthcare'], industry: 'Healthcare' },
  { label: 'Education & Curriculum Innovation', aliases: ['curriculum', 'students', 'teaching', 'academic', 'learning', 'university', 'education'], industry: 'Education' },
  { label: 'Financial Strategy & Accounting', aliases: ['finance', 'financial', 'accounting', 'audit', 'tax', 'investment', 'forecasting'], industry: 'Finance' },
  { label: 'Civil, Structural & Industrial Engineering', aliases: ['structural', 'mechanical', 'electrical', 'infrastructure', 'cad', 'robotics'], industry: 'Engineering' },
  { label: 'B2B Revenue & Account Leadership', aliases: ['revenue', 'quota', 'enterprise sales', 'territory', 'pipeline', 'business development'], industry: 'Sales' },
  { label: 'Digital Marketing & Brand Growth', aliases: ['marketing', 'brand', 'gtm', 'campaign', 'seo', 'copywriting', 'social media'], industry: 'Marketing' },
  { label: 'Public Policy & Civic Governance', aliases: ['public policy', 'municipal', 'government', 'civic', 'grant', 'zoning'], industry: 'Government' },
  { label: 'Office & Business Administration', aliases: ['administration', 'office operations', 'executive support', 'document control'], industry: 'Administration' },
  { label: 'Human Resources & Talent Development', aliases: ['human resources', 'talent acquisition', 'onboarding', 'hris', 'people analytics'], industry: 'Human Resources' },
  { label: 'UI/UX & Creative Visual Design', aliases: ['figma', 'ui/ux', 'design systems', 'graphic design', 'visual identity'], industry: 'Design & Creative' },
  { label: 'Legal, Privacy & Regulatory Governance', aliases: ['legal', 'privacy', 'gdpr', 'contracts', 'paralegal', 'compliance'], industry: 'Legal & Compliance' },
  { label: 'Global Supply Chain & Freight Logistics', aliases: ['supply chain', 'logistics', 'freight', 'warehouse', 'inventory', 'procurement'], industry: 'Supply Chain & Logistics' },
  { label: 'Banking, Lending & Risk Underwriting', aliases: ['banking', 'lending', 'underwriting', 'insurance', 'actuarial', 'claims'], industry: 'Banking & Insurance' },
  { label: 'Manufacturing & Industrial Quality', aliases: ['manufacturing', 'production', 'kaizen', 'lean', 'six sigma', 'cnc', 'quality assurance'], industry: 'Manufacturing & Quality' },
  { label: 'Construction & Commercial Real Estate', aliases: ['construction', 'real estate', 'bim', 'architecture', 'estimating', 'property'], industry: 'Construction & Real Estate' },
  { label: 'Hospitality, Events & Travel Experience', aliases: ['hospitality', 'hotel', 'tourism', 'culinary', 'events', 'concierge'], industry: 'Hospitality & Tourism' },
  { label: 'Retail Merchandising & E-Commerce', aliases: ['retail', 'ecommerce', 'e-commerce', 'shopify', 'merchandising', 'marketplace'], industry: 'Retail & E-Commerce' },
  { label: 'Journalism, Media & Technical Publishing', aliases: ['journalism', 'media', 'podcast', 'video', 'technical writing', 'publishing'], industry: 'Media & Communications' },
  { label: 'Biotech, Clinical Trials & Pharma R&D', aliases: ['pharma', 'biotech', 'clinical trials', 'fda', 'gmp', 'genomics'], industry: 'Pharma & Biotechnology' },
  { label: 'Clean Energy, Agronomy & Advisory', aliases: ['esg', 'agronomy', 'clean energy', 'aviation', 'strategy', 'non-profit'], industry: 'Other Sectors' },
];

export const SAMPLE_RESUMES = [
  {
    id: 'healthcare-rn',
    label: 'Clinical Nurse Manager (Healthcare)',
    fileName: 'Maya_Patel_RN_BSN_Resume.txt',
    text: `Maya Patel, RN, BSN
6+ years of clinical nursing and hospital operations leadership experience.
Education: Bachelor of Science in Nursing (BSN), Registered Nurse (RN), BLS & ACLS Certified.
Skills: Patient Care, Clinical Triage, Epic EHR Systems, HIPAA Compliance, Staff Scheduling, Care Coordination, Quality Reporting.
Experience:
- Nurse Operations Lead (2021 - Present): Managed 28-bed surgical recovery unit and improved triage response by 32%.
- Staff Registered Nurse (2018 - 2021): Delivered acute inpatient patient care and EHR clinical documentation.
Interests: Healthcare management, improving patient outcomes, and hospital workflow efficiency.`,
  },
  {
    id: 'finance-fpa',
    label: 'Senior Financial Analyst (Finance)',
    fileName: 'Daniel_Brooks_CFA_Resume.txt',
    text: `Daniel Brooks, MBA, CFA
5 years of corporate finance, budgeting, and GAAP financial reporting experience.
Qualifications: MBA in Finance, CFA Charterholder, CPA candidate, B.S. Accounting.
Skills: Financial Modeling, Budget Forecasting, Variance Analysis, GAAP Reporting, Excel VBA, Risk Management, Auditing.
Interests: Capital markets, corporate strategy, financial planning and audit excellence.`,
  },
  {
    id: 'engineering-civil',
    label: 'Civil Project Engineer (Engineering)',
    fileName: 'Liam_Keller_PE_Resume.txt',
    text: `Liam Keller, P.E.
4+ years leading municipal infrastructure, bridge design, and site grading engineering projects.
Education: B.S. Civil Engineering, Licensed Professional Engineer (P.E.), LEED AP.
Skills: AutoCAD Civil 3D, Structural Analysis, Site Grading, Building Codes, Project Estimation.
Interests: Sustainable infrastructure, transit engineering, and public construction management.`,
  },
  {
    id: 'tech-fullstack',
    label: 'Full-Stack Developer (IT & Software)',
    fileName: 'Alex_Morgan_Tech_Resume.txt',
    text: `Alex Morgan
4 years building scalable web products with HTML, CSS, Tailwind, JavaScript, React, Node.js, Python, PostgreSQL, and AWS.
Education: B.S. Computer Science, AWS Certified Solutions Architect.
Skills: HTML, CSS, Tailwind, JavaScript, React, Node.js, Python, FastAPI, PostgreSQL, Git, GitHub, Docker, REST APIs.
Interests: Software architecture, full-stack web engineering, and developer productivity.`,
  },
  {
    id: 'gov-policy',
    label: 'Urban Policy Specialist (Government)',
    fileName: 'Sophia_Reyes_MPA_Resume.txt',
    text: `Sophia Reyes, MPA
3+ years in municipal public policy research, federal grants, and urban zoning compliance.
Qualifications: Master of Public Administration (MPA), B.A. Political Science, Certified Grants Management Specialist.
Skills: Public Policy Analysis, Grant Management, Regulatory Compliance, GIS Mapping, Stakeholder Engagement, Budget Oversight.
Interests: Civic innovation, public infrastructure policy, and community governance.`,
  },
];
