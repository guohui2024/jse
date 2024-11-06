import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'src/app/services/job.service';
import { Job } from 'src/app/models/job';

@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css'],
})
export class JobPostingComponent implements OnInit {
  jobPostingForm: FormGroup;
  employers: any[] = []; // To hold employers from db.json
  jobLevels = ['Beginner', 'Junior', 'Senior'];
  jobTypes = ['Full time', 'Part time'];

  job: Partial<Job> = {
    title: '',
    description: '',
    jobLevel: '',
    salary: '',
    employer: '',
    logo: '',
    location: '',
    jobType: '',
    status: ''
  };

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
      status: ['New'],
    });
  }

  ngOnInit(): void {
    this.getEmployers();
  }

  getEmployers(): void {
    this.jobService.getEmployers().subscribe((data: any) => {
      this.employers = data;
    });
  }

  showConfirmationModal: boolean = false;

  openConfirmation() {
    this.showConfirmationModal = true;
  }

  confirmPost() {
    // Map form values to job object
    this.job = {
      title: this.jobPostingForm.get('title')?.value,
      description: this.jobPostingForm.get('description')?.value,
      salary: this.jobPostingForm.get('salary')?.value,
      jobLevel: this.jobPostingForm.get('level')?.value,
      jobType: this.jobPostingForm.get('type')?.value,
      employer: this.jobPostingForm.get('employer')?.value,
      location: this.jobPostingForm.get('location')?.value,
      status: this.jobPostingForm.get('status')?.value
    };

    console.log("Job to post:", this.job); // Debugging log

    this.showConfirmationModal = false;

    this.jobService.saveJob(this.job)
      .subscribe(
        response => {
          console.log("Job posting saved:", response);
          alert("The job posting has been submitted successfully!");
        },
        error => {
          console.error("Error saving job posting:", error);
        }
      );
  }

  cancelPost() {
    this.showConfirmationModal = false;
  }
}
