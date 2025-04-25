
export type University = {
  id: string;
  name: string;
  programName: string;
  url: string;
  status: 'researching' | 'applied' | 'admitted' | 'rejected' | 'pending';
  tag: 'reach' | 'target' | 'safety';
  applicationFee: number;
  location: string;
  deadline: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Requirement = {
  id: string;
  universityId: string;
  gre?: {
    required: boolean;
    verbal?: number;
    quant?: number;
    writing?: number;
  };
  toefl?: {
    required: boolean;
    score?: number;
    expiryMonths?: number;
  };
  gpa?: {
    minimum?: number;
    preferred?: number;
  };
  background?: {
    csRequired: boolean;
    researchExperience: 'preferred' | 'required' | 'not-required';
    workExperience: 'preferred' | 'required' | 'not-required';
  };
  notes?: string;
};

export type DeadlineItem = {
  id: string;
  universityId: string;
  title: string;
  date: string;
  type: 'application' | 'document' | 'recommendation' | 'other';
  completed: boolean;
  notes?: string;
};

export type Document = {
  id: string;
  name: string;
  type: 'sop' | 'cv' | 'recommendation' | 'transcript' | 'other';
  universityId?: string;
  content?: string;
  fileUrl?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type PostGradInfo = {
  id: string;
  universityId: string;
  optEligible: boolean;
  stemDesignated: boolean;
  h1bSponsorship?: boolean;
  averageSalary?: number;
  topEmployers?: string[];
  jobPlacementRate?: number;
  notes?: string;
};

export type StatusCount = {
  [key: string]: number;
};
