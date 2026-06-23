export interface Job {
  id: string;
  user_id: string;
  title: string;
  company_name: string;
  description: string;
  requirements?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  location?: string;
  job_type?: string;
  status: string;
  created_at: string;
}

export interface JobDetail extends Job {
  required_experience?: any;
  education_requirements?: string[];
  salary_range?: any;
  job_url?: string;
  application_deadline?: string;
}

export interface CreateJob {
  title: string;
  company_name: string;
  description: string;
  requirements?: string;
  location?: string;
  job_type?: string;
  remote_option?: string;
  job_url?: string;
}