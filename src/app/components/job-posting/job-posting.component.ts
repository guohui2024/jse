import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component'; // Adjust the path
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css'],
})
export class JobPostingComponent implements OnInit {
  jobPostingForm: FormGroup;
  employers: any[] = []; // To hold employers from db.json
  jobLevels = ['Beginner', 'Junior', 'Senior']; // Job type options
  jobTypes = ['Full time', 'Part time'];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private modalService: NgbModal
  ) {
    this.jobPostingForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
      level: ['', Validators.required],
      type: ['', Validators.required],
      employer: ['', Validators.required],
      location: ['', Validators.required],
      status: ['New'], // Default status
    });
  }

  ngOnInit(): void {
    this.getEmployers();
  }

  getEmployers(): void {
    this.jobService.getEmployers().subscribe((data: any) => {
      this.employers = data; // Store employers from db.json
    });
  }

  
  saveJobPosting(): void {
    console.log("save job post");
    if (this.jobPostingForm.valid) {
      const job = this.jobPostingForm.value;
      this.jobService.saveJob(job).subscribe({
        next: () => {
          this.openConfirmationModal(); // Open modal on success
          this.jobPostingForm.reset(); // Reset form after submission
        },
        error: (err) => {
          console.error('Error saving job posting', err);
          // Optionally, handle error feedback to the user
        }
      });
    }
  }

  openConfirmationModal(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message = 'Job posting saved successfully!';
  }
}
