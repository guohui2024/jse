export interface Job {
    id: number;
    title: string;
    employer: string;
    salary: string;
    description: string;
    employerIcon: string;
    jobLevel: string;
    location:string;
    jobType: string; // e.g., "Full-Time" or "Part-Time"
    status:string;
}