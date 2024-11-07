import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-employer',
  templateUrl: './add-employer.component.html',
  styleUrls: ['./add-employer.component.css']
})
export class AddEmployerComponent implements OnInit {
  employer = {
    name: '',
    location: '',
    logo: ''
  };
  logoPreview: string | null = null; // For logo preview before upload
  employers: any[] = []; // To hold list of employers from db.json

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployers(); // Fetch employers when the component loads
  }

  // Load employers from db.json
  loadEmployers(): void {
    this.http.get<any[]>('http://localhost:3000/employers').subscribe((data) => {
      this.employers = data;
    });
  }

  // Handle logo file input change
  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.employer.logo = file.name; // Save the file name
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result; // Display the logo preview
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  onSubmit(): void {
    if (this.employer.name && this.employer.location && this.employer.logo) {
      // Save the new employer data to db.json
      this.http.post('http://localhost:3000/employers', this.employer).subscribe(
        () => {
          this.loadEmployers(); // Reload the employers list
          this.resetForm(); // Reset the form fields
        },
        (error) => {
          console.error('Error adding employer:', error);
        }
      );
    } else {
      alert('All fields are required!');
    }
  }

  // Reset the form after submission
  resetForm(): void {
    this.employer = { name: '', location: '', logo: '' };
    this.logoPreview = null;
  }

  // Delete an employer
  deleteEmployer(id: number): void {
    this.http.delete(`http://localhost:3000/employers/${id}`).subscribe(
      () => {
        this.loadEmployers(); // Reload the employers list after deletion
      },
      (error) => {
        console.error('Error deleting employer:', error);
      }
    );
  }
}
