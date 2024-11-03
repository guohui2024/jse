

export interface Application {
  id: number;
  jobId: number;
  userId: number;
  applicantName: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  resume: File; // Assuming you're uploading a file
}
