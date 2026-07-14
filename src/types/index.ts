export type HackathonMode = 'online' | 'offline' | 'hybrid';
export type HackathonStatus = 'open' | 'closed' | 'draft';
export type HackathonDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'url'
  | 'portfolio'
  | 'github'
  | 'linkedin'
  | 'resume'
  | 'file-multiple'
  | 'single-select'
  | 'multi-select'
  | 'boolean';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  order: number;
}

export interface FormSchema {
  id?: string;
  hackathonId: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface Hackathon {
  id?: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  organizer: string;
  registrationDeadline: string;
  hackathonDate: string;
  location: string;
  mode: HackathonMode;
  prizePool: string;
  teamSize: string;
  difficulty: HackathonDifficulty;
  tags: string[];
  shortDescription: string;
  timeline: string;
  rules: string;
  requirements: string;
  techStack: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  additionalNotes: string;
  status: HackathonStatus;
  applicationDeadline: string;
  lookingFor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id?: string;
  hackathonId: string;
  hackathonName: string;
  data: Record<string, unknown>;
  resumeUrl?: string;
  fileUrls?: Record<string, string>;
  status: ApplicationStatus;
  adminNotes: string;
  submittedAt: string;
  updatedAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
}

export interface DashboardStats {
  totalHackathons: number;
  openHackathons: number;
  closedHackathons: number;
  totalApplications: number;
}
