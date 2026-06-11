export interface JobPosting {
  id: string;
  title: string;
  location: string;
  department: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  postedAt: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  appliedAt: string;
  status: 'NEW' | 'REVIEW' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
}

export interface InterviewSchedule {
  id: string;
  candidateId: string;
  scheduledAt: string;
  interviewer: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}
