import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/models/job';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = []; // All jobs
  filteredJobs: Job[] = []; // Jobs to display based on the search
  searchKeyword: string = ''; // To bind with the search input
  titleFilter: string = '';

  availableEmployers: string[] = [];
  availableJobLevels: string[] = [];
  availableLocations: string[] = [];
  availableJobTypes: string[] = [];

  selectedEmployers: { [key: string]: boolean } = {};
  selectedJobTypes: { [key: string]: boolean } = {};
  selectedJobLevels: { [key: string]: boolean } = {};
  selectedLocations: { [key: string]: boolean } = {};
  selectedSalaryRange: { min: number; max: number } = { min: 0, max: 100 }; // Example salary range selection
  salaryRange: number = 200000; // Set the default max value of the salary 

  employers: string[] = []; // Unique employers
  jobTypes: string[] = []; // Unique job types
  jobLevels: string[] = []; // Unique job levels
  locations: string[] = []; // Unique locations

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe((data: Job[]) => {
      this.jobs = data;
      console.log(this.jobs);
      this.filteredJobs = data; // Initialize filteredJobs with all jobs
      this.populateFilters(data);
      // Extract unique values for filters
    });
  }

  populateFilters(jobs: Job[]): void {
    // Populate filter options from jobs
    this.employers = [...new Set(jobs.map(job => job.employer))];
    this.jobTypes = [...new Set(jobs.map(job => job.jobType))];
    this.jobLevels = [...new Set(jobs.map(job => job.jobLevel))];
    this.locations = [...new Set(jobs.map(job => job.location))];

      // Extract unique employers for the filter
      this.availableEmployers = [...new Set(this.jobs.map(job => job.employer).filter(level => level != null && level.trim() !== ''))];
      this.availableLocations = [...new Set(this.jobs.map(job => job.location).filter(level => level != null && level.trim() !== ''))];
      this.availableJobLevels = [...new Set(this.jobs.map(job => job.jobLevel).filter(level => level != null && level.trim() !== ''))];
      this.availableJobTypes = [...new Set(this.jobs.map(job => job.jobType).filter(level => level != null && level.trim() !== ''))];

      // Initialize selectedEmployers with availableEmployers
      this.availableEmployers.forEach(employer => {
        this.selectedEmployers[employer] = false; // Initialize to unchecked
        console.log(employer);
      });
  }

  onApplyClick(id: number): void {
    this.jobService.setid(id);

    // Save id to session storage
    localStorage.setItem('id', id.toString());
    console.log("in apply button, id is " + id);

    // Check if the user is logged in by looking for a user object in session storage
    const user = localStorage.getItem('user');

    if (user) {
      // If user is logged in, navigate to job application page with id
      this.router.navigate(['/jobapply']);
    } else {
      // If no user, redirect to login page
      this.router.navigate(['/login']);
    }
  }

  filterJobs(): void {
    if (!this.searchKeyword) {
      this.filteredJobs = this.jobs; // Reset to all jobs if no keyword
      return;
    }
    
    const keyword = this.searchKeyword.toLowerCase();
    
    this.filteredJobs = this.jobs.filter(job => {
      return (
        job.title.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword) ||
        job.employer.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.jobType.toLowerCase().includes(keyword)
      );
    });
  }

  checkSalaryRange(salaryRange: string): boolean {
    const [min, max] = salaryRange.replace(/[^0-9-]/g, '').split('-').map(Number);
    return (this.selectedSalaryRange.min <= min && this.selectedSalaryRange.max >= max);
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      // Title filter
      const matchesTitle = job.title.toLowerCase().includes(this.titleFilter.toLowerCase());
  
      // Employer filter
      const matchesEmployer = this.isEmployerSelected(job.employer);
  
      // Location filter
      const matchesLocation = this.isLocationSelected(job.location);
  
      // Job type filter
      const matchesJobType = this.isJobTypeSelected(job.jobType);
  
      // Job level filter
      const matchesJobLevel = this.isJobLevelSelected(job.jobLevel);
  
      // Combine all conditions
      return matchesTitle && matchesEmployer && matchesLocation && matchesJobType && matchesJobLevel;
    });
  }  
  
  isEmployerSelected(employer: string): boolean {
    // Return true if the employer is selected, otherwise false
    return this.selectedEmployers[employer] || Object.values(this.selectedEmployers).every(value => !value);
  }

  // Check if a specific location is selected
  isLocationSelected(location: string): boolean {
    //return this.selectedLocations.length === 0 || this.selectedLocations.includes(location);
    return this.selectedLocations[location] || Object.values(this.selectedLocations).every(value => !value);
  }

  // Check if a specific job type is selected
  isJobTypeSelected(jobType: string): boolean {
    //return this.selectedJobTypes.length === 0 || this.selectedJobTypes.includes(jobType);
    return this.selectedJobTypes[jobType] || Object.values(this.selectedJobTypes).every(value => !value);
  }

  // Check if a specific job level is selected
  isJobLevelSelected(jobLevel: string): boolean {
    //return this.selectedJobLevels.length === 0 || this.selectedJobLevels.includes(jobLevel);
    return this.selectedJobLevels[jobLevel] || Object.values(this.selectedJobLevels).every(value => !value);
  }
  
  onEmployerChange(employer: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Update the selectedEmployers state
    this.selectedEmployers[employer] = isChecked;
  
    // Call the applyFilters method to update the displayed jobs
    this.applyFilters();
  }
  
  onLocationChange(location: string, event:Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Update the selectedLocations state
    this.selectedLocations[location] = isChecked;
  
    this.applyFilters(); // Call applyFilters to update the filtered jobs
  }
  
  onJobTypeChange(jobType: string, event:Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Update the selectedJobType state
    this.selectedJobTypes[jobType] = isChecked;
  
    this.applyFilters(); // Call applyFilters to update the filtered jobs
  }
  
  onJobLevelChange(jobLevel: string, event:Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    // Update the selectedLevelChange state
    this.selectedJobLevels[jobLevel] = isChecked;
    this.applyFilters(); // Call applyFilters to update the filtered jobs
  }
  
}
