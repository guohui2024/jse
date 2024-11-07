import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: any[] = []; // Array to hold job data
  confirmationMessage: string | null = null;
  showPopup: boolean = false; // New property for pop-up visibility

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getValidJobs().subscribe((data: any) => {
      this.jobs = data;
    });
  }

  updateJobStatus(job: any): void {
    this.jobService.updateJob(job.id, job).subscribe(
      response => {
        console.log('Job status updated:', response);
        this.showConfirmationPopup("Job status updated successfully!");
      },
      error => {
        console.error("Error updating job status:", error);
      }
    );
  }

  // Show confirmation pop-up with message
  private showConfirmationPopup(message: string) {
    this.confirmationMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false; // Hide after 3 seconds
    }, 3000);
  }
}
