import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component'; // Adjust the path
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
  jobLevels = ['Beginner', 'Junior', 'Senior']; // Job type options
  jobTypes = ['Full time', 'Part time'];

   // Use Partial<Job> to make all properties optional during initialization
  job: Partial<Job> = {
    title: '',
    description: '',
    jobLevel: '',
    salary: '',
    employer: '',
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
  
  showConfirmationModal: boolean = false;

  openConfirmation() {
    this.showConfirmationModal = true;
  }

  confirmPost() {
    console.log("before submit job: "+this.job);
    this.job.status='new';
    // Code to save or post the job
    this.showConfirmationModal = false;
    // Call the service to save the job data
    this.jobService.saveJob(this.job)
      .subscribe(response => {
        console.log("Job posting saved:", response);
        alert("The job posting has been submitted successfully!");
      }, error => {
        console.error("Error saving job posting:", error);
      });
    console.log("Job posted successfully!");
  }

  cancelPost() {
    this.showConfirmationModal = false;
  }
}
