import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: any[] = []; // Array to hold job data

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe((data: any) => {
      this.jobs = data;
    });
  }

  updateJobStatus(job: any): void {
    this.jobService.updateJob(job.id, { status: job.status }).subscribe(
      (      response: any) => {
        console.log('Job status updated:', response);
      },
      (      error: any) => {
        console.error('Error updating job status:', error);
      }
    );
  }
}
