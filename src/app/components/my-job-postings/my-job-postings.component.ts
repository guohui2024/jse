import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-my-job-postings',
  templateUrl: './my-job-postings.component.html',
  styleUrls: ['./my-job-postings.component.css']
})
export class MyJobPostingsComponent implements OnInit {
  jobPostings: any[] = []; // Array to store employer's jobs
  employerId: string = ''; // Assuming employer is identified by an ID

  constructor(private jobService: JobService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEmployerJobs();
  }

  loadEmployerJobs(): void {
    // Get employer ID from auth service
    const employer:any = localStorage.getItem('user');
    console.log("employer id is " + employer.id);
    if (employer) {
      this.employerId = employer.id;
      
      // Fetch all jobs and filter by employer ID
      this.jobService.getJobs().subscribe((jobs: any[]) => {
        this.jobPostings = jobs.filter(job => job.employerId === this.employerId);
      });
      console.log('My job posting: ' + this.jobPostings);
    }
  }

  deleteJob(jobId: number): void {
    this.jobService.deleteJob(jobId).subscribe(() => {
      this.jobPostings = this.jobPostings.filter(job => job.id !== jobId);
    });
  }
}
