export interface Job {
    id: number;
    title: string;
    employer: string;
    salary: string;
    description: string;
    logo: string;
    jobLevel: string;
    location:string;
    jobType: string; // e.g., "Full-Time" or "Part-Time"
    status:string;
}