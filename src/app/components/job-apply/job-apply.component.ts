import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from 'src/app/services/job.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.css'],
})
export class JobApplyComponent implements OnInit {
  applicationForm: FormGroup;
  job: any; // Store the job details
  jobId: any;
  showConfirmationModal: boolean = false;

  constructor(private jobService: JobService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      grade: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      school: ['', Validators.required],
      resume: [null] // To handle resume file input
    });
}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (!this.jobId) {
      this.jobId = localStorage.getItem('id');
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("get applicant: " + user);
      this.applicationForm.patchValue({
        email: user.email || ''
      });
    } else {
      this.router.navigate(['/login']);
    }

    this.getJobDetails(this.jobId);
  }

  getJobDetails(id: string): void {
    this.jobService.getJobById(id).subscribe((data) => {
      this.job = data;
      console.log("Retrieved job details: ", this.job);

      // Populate the form with job details
      this.applicationForm.patchValue({
        jobTitle: this.job.title,
        employer: this.job.employer,
        location: this.job.location,
        salary: this.job.salary,
        jobType: this.job.type,
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Store or process the file as needed
    }
  }

  openConfirmation() {
    this.showConfirmationModal = true;
  }

  confirmApplication() {
    const applicantData = this.applicationForm.value;
    applicantData.jobId = this.job.id;

    this.showConfirmationModal = false;

    this.jobService.saveApplication(applicantData).subscribe(
      (response) => {
        console.log("Application saved:", response);
        alert("Your application has been submitted successfully!");
        this.router.navigate(['/job-list']);
      },
      (error) => {
        console.error("Error saving application:", error);
      }
    );
  }

  cancelApplication() {
    this.showConfirmationModal = false;
  }
}
