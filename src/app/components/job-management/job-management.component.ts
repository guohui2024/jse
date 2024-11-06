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
      (      response: any) => {
        console.log('Job status updated:', response);
         // Show the confirmation message on successful save
         this.showConfirmationMessage("Job status updated successfully!");

        // Optionally, hide the message after a few seconds
        setTimeout(() => {
          this.confirmationMessage = null;
        }, 3000); // Hide after 3 seconds
      },
      error => {
        console.error("Error updating job status:", error);
      }
    );
  }

   // Method to show confirmation message
   private showConfirmationMessage(message: string) {
    this.confirmationMessage = message;
  }
}
