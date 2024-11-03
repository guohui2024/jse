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
  applicant = {
    id: '',
    jobId:'',
    userId:'',
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    resume: null as File | null  // Define resume property to store the file
  };
  
  applicationForm: FormGroup;
  user: any; //store applicant details
  job: any; // Store the job details
  jobId:any;

  constructor(private jobService: JobService, private router: Router, private fb: FormBuilder,
    private modalService: NgbModal, private route: ActivatedRoute) {
         this.applicationForm = this.fb.group({
                              name: ['', Validators.required],
                              email: ['', [Validators.required, Validators.email]],
                              phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
                              school: ['', Validators.required],
                              grade: ['', Validators.required]
                          });                          
  }

  ngOnInit(): void {
    // Retrieve id from route parameters
    this.jobId = this.jobService.getid();
    if(this.jobId==null) this.jobId=localStorage.getItem("id");
    // Proceed with the job application process
    this.initializeJobApplicationForm();
    //this.id = this.route.snapshot.paramMap.get('id');
    console.log("in job apply page, id is " + this.jobId);

    // Check if the user is logged in by looking for a user object in session storage
     // Retrieve user data from localStorage
     const storedUser = localStorage.getItem('user');
     if (storedUser) {
       const user = JSON.parse(storedUser);
       console.log("Retrieved user data:", user);

       // Populate form fields with user data if available
       this.applicationForm.patchValue({
         name: user.name || '',
         email: user.email || '',
         phone: user.phone || '',
         school: user.school || ''
       });
     }
    
    if (!storedUser) {
      // If no user, redirect to login page
      this.router.navigate(['/login']);
    } 
  }

  // Initialize the job application form
  initializeJobApplicationForm() {
    // Additional logic for initializing the form
    this.job = this.getJobDetails(this.jobId);
    this.user = localStorage.getItem('user'); 
  }  

  getJobDetails(id: string): void {
    this.jobService.getJobById(id).subscribe((data) => {
      this.job = data; // Populate the job details
      console.log("get job detail: ", this.job); // Log the original object

      // Convert the job object to a JSON string
      const jobJson = JSON.stringify(this.job);
      console.log("Job as JSON: ", jobJson); // Log the JSON representation
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.applicant.resume = file; // Store the file object
    }
  }
  
  onSubmit() {
    var applicantData = this.applicationForm.value;
    applicantData.jobId=this.job.id;
    applicantData.userId=this.user.id;
    const jobTitle = this.job.title; // Get the job title
  
    // Create the modal instance
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      size: 'lg', // Optional: specify size ('sm', 'lg', etc.)
      backdrop: 'static' // Prevent closing when clicking outside
    });
    modalRef.componentInstance.applicantData = applicantData; // Pass applicant data
    modalRef.componentInstance.jobTitle = jobTitle; // Pass job title
  
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          // Proceed with form submission or saving
          this.saveApplication(applicantData); // Call your save method
        }
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
      }
    );
  }

  saveApplication(applicantData: any) {
    // Your logic to save the applicant data
    this.jobService.saveApplication(applicantData).subscribe(
      (response) => {
        console.log('Application submitted successfully:', response);
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  }
}
