
import { University, Requirement, DeadlineItem, Document, PostGradInfo } from "../types";

// Mock Universities
export const universities: University[] = [
  {
    id: "1",
    name: "Stanford University",
    programName: "MS Computer Science",
    url: "https://cs.stanford.edu/academics/masters",
    status: "researching",
    tag: "reach",
    applicationFee: 125,
    location: "Stanford, CA",
    deadline: "2025-12-01",
    notes: "Focus on AI and ML specialization",
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "2",
    name: "University of California, Berkeley",
    programName: "MS Computer Science",
    url: "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng",
    status: "researching",
    tag: "reach",
    applicationFee: 140,
    location: "Berkeley, CA",
    deadline: "2025-12-15",
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "3",
    name: "Georgia Institute of Technology",
    programName: "MS Computer Science",
    url: "https://www.cc.gatech.edu/degree-programs/master-science-computer-science",
    status: "researching",
    tag: "target",
    applicationFee: 85,
    location: "Atlanta, GA",
    deadline: "2026-01-15",
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "4",
    name: "University of Texas at Austin",
    programName: "MS Computer Science",
    url: "https://www.cs.utexas.edu/graduate/masters-program",
    status: "researching",
    tag: "target",
    applicationFee: 90,
    location: "Austin, TX",
    deadline: "2025-12-10",
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "5",
    name: "Arizona State University",
    programName: "MS Computer Science",
    url: "https://engineering.asu.edu/programs/masters/computer-science-ms",
    status: "researching",
    tag: "safety",
    applicationFee: 70,
    location: "Tempe, AZ",
    deadline: "2026-02-01",
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  }
];

// Mock Requirements
export const requirements: Requirement[] = [
  {
    id: "1",
    universityId: "1",
    gre: {
      required: true,
      verbal: 160,
      quant: 165,
      writing: 4.5
    },
    toefl: {
      required: true,
      score: 100,
      expiryMonths: 24
    },
    gpa: {
      minimum: 3.5,
      preferred: 3.7
    },
    background: {
      csRequired: true,
      researchExperience: "preferred",
      workExperience: "not-required"
    },
    notes: "Strong recommendation letters from CS professors highly valued."
  },
  {
    id: "2",
    universityId: "2",
    gre: {
      required: true,
      quant: 163,
    },
    toefl: {
      required: true,
      score: 90,
      expiryMonths: 18
    },
    gpa: {
      minimum: 3.0,
      preferred: 3.5
    },
    background: {
      csRequired: true,
      researchExperience: "preferred",
      workExperience: "preferred"
    }
  },
  {
    id: "3",
    universityId: "3",
    gre: {
      required: false,
    },
    toefl: {
      required: true,
      score: 90,
      expiryMonths: 24
    },
    gpa: {
      minimum: 3.0,
    },
    background: {
      csRequired: false,
      researchExperience: "not-required",
      workExperience: "preferred"
    }
  },
  {
    id: "4",
    universityId: "4",
    gre: {
      required: true,
      quant: 160,
    },
    toefl: {
      required: true,
      score: 90,
    },
    gpa: {
      minimum: 3.0,
      preferred: 3.5
    },
    background: {
      csRequired: true,
      researchExperience: "not-required",
      workExperience: "preferred"
    }
  },
  {
    id: "5",
    universityId: "5",
    gre: {
      required: false,
    },
    toefl: {
      required: true,
      score: 80,
      expiryMonths: 24
    },
    gpa: {
      minimum: 3.0,
    },
    background: {
      csRequired: false,
      researchExperience: "not-required",
      workExperience: "not-required"
    }
  }
];

// Mock Deadlines
export const deadlines: DeadlineItem[] = [
  {
    id: "1",
    universityId: "1",
    title: "Application Submission",
    date: "2025-12-01",
    type: "application",
    completed: false
  },
  {
    id: "2",
    universityId: "1",
    title: "Recommendation Letters Due",
    date: "2025-12-01",
    type: "recommendation",
    completed: false
  },
  {
    id: "3",
    universityId: "2",
    title: "Application Submission",
    date: "2025-12-15",
    type: "application",
    completed: false
  },
  {
    id: "4",
    universityId: "2",
    title: "Transcript Submission",
    date: "2025-12-15",
    type: "document",
    completed: false
  },
  {
    id: "5",
    universityId: "3",
    title: "Application Submission",
    date: "2026-01-15",
    type: "application",
    completed: false
  },
  {
    id: "6",
    universityId: "3",
    title: "Recommendation Letters Due",
    date: "2026-01-15",
    type: "recommendation",
    completed: false
  },
  {
    id: "7",
    universityId: "4",
    title: "Application Submission",
    date: "2025-12-10",
    type: "application",
    completed: false
  },
  {
    id: "8",
    universityId: "5",
    title: "Application Submission",
    date: "2026-02-01",
    type: "application",
    completed: false
  },
  {
    id: "9",
    universityId: "5",
    title: "TOEFL Score Submission",
    date: "2026-02-01",
    type: "document",
    completed: false
  },
];

// Mock Documents
export const documents: Document[] = [
  {
    id: "1",
    name: "Statement of Purpose - General",
    type: "sop",
    content: "This is my general statement of purpose that highlights my background in computer science...",
    version: 1,
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "2",
    name: "Resume - Technical",
    type: "cv",
    content: "RESUME\n\nEDUCATION\n- Bachelor of Science in Computer Science\n\nEXPERIENCE\n- Software Engineering Intern...",
    version: 2,
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "3",
    name: "Stanford SOP",
    type: "sop",
    universityId: "1",
    content: "Statement of Purpose for Stanford University...",
    version: 1,
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  },
  {
    id: "4",
    name: "Letter of Recommendation - Prof. Johnson",
    type: "recommendation",
    fileUrl: "/sample-recommendation.pdf",
    version: 1,
    createdAt: "2024-04-25",
    updatedAt: "2024-04-25"
  }
];

// Mock Post-Graduation Info
export const postGradInfo: PostGradInfo[] = [
  {
    id: "1",
    universityId: "1",
    optEligible: true,
    stemDesignated: true,
    h1bSponsorship: true,
    averageSalary: 120000,
    topEmployers: ["Google", "Apple", "Facebook", "Microsoft", "Amazon"],
    jobPlacementRate: 95,
    notes: "Strong Silicon Valley connections with numerous tech giants recruiting directly from the program."
  },
  {
    id: "2",
    universityId: "2",
    optEligible: true,
    stemDesignated: true,
    h1bSponsorship: true,
    averageSalary: 115000,
    topEmployers: ["Apple", "Google", "Intel", "Facebook", "Nvidia"],
    jobPlacementRate: 92,
    notes: "Bay Area location provides excellent networking opportunities."
  },
  {
    id: "3",
    universityId: "3",
    optEligible: true,
    stemDesignated: true,
    h1bSponsorship: true,
    averageSalary: 100000,
    topEmployers: ["Microsoft", "IBM", "NCR", "Accenture", "Delta"],
    jobPlacementRate: 90
  },
  {
    id: "4",
    universityId: "4",
    optEligible: true,
    stemDesignated: true,
    h1bSponsorship: true,
    averageSalary: 105000,
    topEmployers: ["Dell", "IBM", "AMD", "Apple", "Amazon"],
    jobPlacementRate: 88
  },
  {
    id: "5",
    universityId: "5",
    optEligible: true,
    stemDesignated: true,
    h1bSponsorship: false,
    averageSalary: 90000,
    topEmployers: ["Intel", "Amazon", "Microsoft", "GoDaddy", "State Farm"],
    jobPlacementRate: 85
  }
];
