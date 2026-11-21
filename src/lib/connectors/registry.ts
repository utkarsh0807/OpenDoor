import { SourcePlatformInfo, ConnectorStatus, OpportunityChangeLog } from '../types';

export interface DiscoveredOpportunityDraft {
  title: string;
  sourcePlatformId: string;
  category: 'hackathon' | 'scholarship' | 'internship' | 'competition' | 'workshop';
  officialSourceUrl: string;
  registrationDeadline: string;
  eventStartDate: string;
  eventEndDate: string;
  mode: 'online' | 'offline' | 'hybrid';
  eventCity?: string;
  eventState?: string;
  eventVenue?: string;
  prizesOrBenefits: string;
}

export const PLATFORM_REGISTRY: SourcePlatformInfo[] = [
  // 1-7 Hackathon & Competitive Coding Platforms
  {
    id: 'devfolio',
    name: 'Devfolio',
    category: 'hackathons',
    status: 'active',
    website: 'https://devfolio.co',
    description: "India's largest community hackathon platform powering collegiate and national hackathons.",
    discoveryMethod: 'Public GraphQL Discovery API & Webhook',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 24
  },
  {
    id: 'unstop',
    name: 'Unstop (Dare2Compete)',
    category: 'hackathons',
    status: 'active',
    website: 'https://unstop.com',
    description: 'Premier Indian platform for college competitions, case studies, quizzes, and hackathons.',
    discoveryMethod: 'Public Competitions Feed & RSS Ingestion',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 42
  },
  {
    id: 'sih',
    name: 'Smart India Hackathon (SIH)',
    category: 'hackathons',
    status: 'active',
    website: 'https://sih.gov.in',
    description: "MoE's flagship nationwide innovation challenge for central ministries and industry problems.",
    discoveryMethod: 'Official Portal Bulletin Watcher',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 12
  },
  {
    id: 'devpost',
    name: 'Devpost',
    category: 'hackathons',
    status: 'active',
    website: 'https://devpost.com',
    description: 'Global developer hackathon discovery hub hosting student & enterprise virtual events.',
    discoveryMethod: 'Public Hackathon Directory Indexer',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 18
  },
  {
    id: 'mlh',
    name: 'Major League Hacking (MLH)',
    category: 'hackathons',
    status: 'active',
    website: 'https://mlh.io',
    description: 'Official student hackathon league hosting Member hackathons & Global Hack Week.',
    discoveryMethod: 'MLH Official Season Calendar Parser',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 15
  },
  {
    id: 'hackerearth',
    name: 'HackerEarth',
    category: 'hackathons',
    status: 'partial',
    website: 'https://hackerearth.com/challenges',
    description: 'Competitive coding challenges, hackathons, and corporate developer hiring contests.',
    discoveryMethod: 'Public Challenges Ingestion Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 8
  },
  {
    id: 'kaggle',
    name: 'Kaggle Competitions',
    category: 'hackathons',
    status: 'active',
    website: 'https://kaggle.com/competitions',
    description: 'Global data science, machine learning, and AI research competitions with cash prizes.',
    discoveryMethod: 'Official Kaggle Community API',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 10
  },

  // 8-17 Government & Corporate Scholarship Portals
  {
    id: 'nsp',
    name: 'National Scholarship Portal (NSP)',
    category: 'scholarships',
    status: 'active',
    website: 'https://scholarships.gov.in',
    description: 'Central Government of India unified portal for Central Sector and Ministry scholarships.',
    discoveryMethod: 'Official Schemes Bulletin Parser',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 19
  },
  {
    id: 'mahadbt',
    name: 'MahaDBT (Aaple Sarkar DBT)',
    category: 'scholarships',
    status: 'active',
    website: 'https://mahadbt.maharashtra.gov.in',
    description: 'Maharashtra Government direct benefit transfer portal for post-matric and EBC tuition waivers.',
    discoveryMethod: 'State Department Gazette Watcher',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 14
  },
  {
    id: 'aicte-pragati',
    name: 'AICTE Pragati & Saksham',
    category: 'scholarships',
    status: 'active',
    website: 'https://aicte-india.org/schemes/students-development-schemes',
    description: 'AICTE scholarships for female engineering students (Pragati) and differently-abled students (Saksham).',
    discoveryMethod: 'AICTE Student Development Schemes Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 4
  },
  {
    id: 'buddy4study',
    name: 'Buddy4Study',
    category: 'scholarships',
    status: 'partial',
    website: 'https://buddy4study.com',
    description: "India's largest scholarship aggregation and corporate CSR matching platform.",
    discoveryMethod: 'Corporate CSR Listing Monitor',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 22
  },
  {
    id: 'vidyasaarathi',
    name: 'Vidyasaarathi (NSDL e-Gov)',
    category: 'scholarships',
    status: 'partial',
    website: 'https://vidyasaarathi.co.in',
    description: 'NSDL technology portal connecting corporate CSR foundations with deserving students.',
    discoveryMethod: 'Public CSR Scholarship Schemes Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 11
  },
  {
    id: 'reliance-foundation',
    name: 'Reliance Foundation Scholarships',
    category: 'scholarships',
    status: 'active',
    website: 'https://scholarships.reliancefoundation.org',
    description: 'Undergraduate and postgraduate scholarships for first-year degree students across India.',
    discoveryMethod: 'Foundation Annual Program Ingest',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 2
  },
  {
    id: 'tata-trusts',
    name: 'Tata Trusts Scholarships',
    category: 'scholarships',
    status: 'partial',
    website: 'https://tatatrusts.org',
    description: 'Merit-cum-means assistance for medical, engineering, and higher education studies.',
    discoveryMethod: 'Trusts Education Grants Bulletin',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 3
  },
  {
    id: 'hdfc-badhte-kadam',
    name: 'HDFC Badhte Kadam',
    category: 'scholarships',
    status: 'active',
    website: 'https://hdfcbank.com',
    description: 'HDFC Parivartan crisis and merit scholarship for school and college students.',
    discoveryMethod: 'Parivartan CSR Education Initiative Ingest',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 2
  },
  {
    id: 'adobe-wit',
    name: 'Adobe India Women-in-Technology',
    category: 'scholarships',
    status: 'active',
    website: 'https://research.adobe.com/scholarship',
    description: 'Prestigious fellowship and scholarship for female computer science & engineering undergraduates.',
    discoveryMethod: 'Adobe Research Global Indexer',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },
  {
    id: 'google-generation',
    name: 'Google Generation Scholarship (APAC)',
    category: 'scholarships',
    status: 'active',
    website: 'https://buildyourfuture.withgoogle.com/scholarships',
    description: 'Google scholarship for women pursuing computer science and technology degrees in Asia-Pacific.',
    discoveryMethod: 'Google Build Your Future Program API',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },

  // 18-22 Internships & Open Source Programs
  {
    id: 'internshala',
    name: 'Internshala',
    category: 'internships',
    status: 'active',
    website: 'https://internshala.com',
    description: "India's premier college internship and training portal offering remote and in-office roles.",
    discoveryMethod: 'Verified Student Internship Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 35
  },
  {
    id: 'aicte-internship',
    name: 'AICTE Internship Portal',
    category: 'internships',
    status: 'active',
    website: 'https://internship.aicte-india.org',
    description: 'Government of India internship portal for ministry, smart city, and urban local body internships.',
    discoveryMethod: 'AICTE MoE National Ingestion Bridge',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 28
  },
  {
    id: 'gsoc',
    name: 'Google Summer of Code (GSoC)',
    category: 'internships',
    status: 'active',
    website: 'https://summerofcode.withgoogle.com',
    description: 'Global remote mentorship program bringing student developers into open source software development.',
    discoveryMethod: 'GSoC Open Program Archive API',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },
  {
    id: 'lfx',
    name: 'Linux Foundation Mentorship (LFX)',
    category: 'internships',
    status: 'active',
    website: 'https://mentorship.lfx.linuxfoundation.org',
    description: 'Remote paid engineering mentorships on Linux kernel, Kubernetes, Cloud Native, and Hyperledger.',
    discoveryMethod: 'LFX Mentorship Public Portal Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 6
  },
  {
    id: 'outreachy',
    name: 'Outreachy',
    category: 'internships',
    status: 'active',
    website: 'https://outreachy.org',
    description: 'Diversity-focused paid open-source internships for underrepresented groups in tech.',
    discoveryMethod: 'Outreachy Program Calendar Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 2
  },

  // 23-26 Student Ambassador & Leadership Programs
  {
    id: 'mlsa',
    name: 'Microsoft Learn Student Ambassadors',
    category: 'academic',
    status: 'active',
    website: 'https://studentambassadors.windows.com',
    description: 'Global community of on-campus student leaders building technical skills and hosting workshops.',
    discoveryMethod: 'Microsoft Student Developer Hub Feed',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },
  {
    id: 'github-campus-expert',
    name: 'GitHub Campus Expert',
    category: 'academic',
    status: 'active',
    website: 'https://githubcampus.expert',
    description: 'Program training students to build tech communities, master Git, and lead campus events.',
    discoveryMethod: 'GitHub Education Public Program Monitor',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },
  {
    id: 'postman-student',
    name: 'Postman Student Leader',
    category: 'academic',
    status: 'active',
    website: 'https://postman.com/student-program',
    description: 'Certification and campus leadership program teaching API development and testing to students.',
    discoveryMethod: 'Postman Education Hub Connector',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },
  {
    id: 'aws-community-builder',
    name: 'AWS Community Builder',
    category: 'academic',
    status: 'partial',
    website: 'https://aws.amazon.com/developer/community/community-builders',
    description: 'Amazon Web Services technical mentorship, cloud credits, and certification support for students.',
    discoveryMethod: 'AWS Developer Relations Application Watcher',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 1
  },

  // 27-30 Flagship IIT & BITS College Tech Fests
  {
    id: 'iitb-techfest',
    name: 'IIT Bombay Techfest',
    category: 'hackathons',
    status: 'active',
    website: 'https://techfest.org',
    description: "Asia's largest science and technology festival hosting international competitions and robotics.",
    discoveryMethod: 'Techfest Official Competitions Ingestion',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 12
  },
  {
    id: 'iitkgp-kshitij',
    name: 'IIT Kharagpur Kshitij',
    category: 'hackathons',
    status: 'active',
    website: 'https://ktj.in',
    description: 'Annual techno-management fest hosting national coding, automation, and aerospace challenges.',
    discoveryMethod: 'Kshitij Event Portal Ingest',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 9
  },
  {
    id: 'iitm-shaastra',
    name: 'IIT Madras Shaastra',
    category: 'hackathons',
    status: 'active',
    website: 'https://shaastra.org',
    description: 'ISO-certified annual student tech festival hosting national hackathons and research symposiums.',
    discoveryMethod: 'Shaastra Technical Events Registry',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 11
  },
  {
    id: 'bits-techfests',
    name: 'BITS Pilani (Quark / Waves / APOGEE)',
    category: 'hackathons',
    status: 'active',
    website: 'https://bits-apogee.org',
    description: 'Technical fest competitions across Pilani, Goa, and Hyderabad campuses of BITS.',
    discoveryMethod: 'BITS Student Union Fest Feeds',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 8
  },

  // 31-32 Freelance & Student Project Platforms
  {
    id: 'freelancer-student',
    name: 'Freelancer / Upwork Student Track',
    category: 'freelance',
    status: 'manual_only',
    website: 'https://freelancer.com',
    description: 'Student-friendly freelance gigs, frontend projects, and micro-contracts vetted for safety.',
    discoveryMethod: 'Curated ChanceDeck Freelance Auditor',
    requiresAuth: true,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 7
  },
  {
    id: 'github-octernships',
    name: 'GitHub Octernships',
    category: 'internships',
    status: 'active',
    website: 'https://education.github.com/students/octernships',
    description: 'Paid industry internships partnering with top global tech startups via GitHub Classroom.',
    discoveryMethod: 'GitHub Education Classroom Webhook',
    requiresAuth: false,
    lastChecked: new Date().toISOString(),
    itemsDiscoveredCount: 5
  }
];

// Ingest Scan Simulator & Discrepancy Change Detector
export function runConnectorScan(platformId: string) {
  const platform = PLATFORM_REGISTRY.find(p => p.id === platformId);
  if (!platform) {
    throw new Error(`Platform connector not found: ${platformId}`);
  }

  platform.lastChecked = new Date().toISOString();
  platform.itemsDiscoveredCount += Math.floor(Math.random() * 3) + 1;

  return {
    platformId: platform.id,
    platformName: platform.name,
    status: 'success',
    newItemsFound: Math.floor(Math.random() * 3) + 1,
    lastChecked: platform.lastChecked,
    discrepanciesDetected: 0
  };
}
