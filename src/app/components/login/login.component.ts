import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorFlag: boolean = false;

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
    password: ['', Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    private jobService: JobService
  ) { }

  get username() {
    return this.loginForm.controls['username'];
  }
  get password() { 
    return this.loginForm.controls['password']; 
  }

  loginUser() {
    const { username, password } = this.loginForm.value;
    this.authService.getUserByUsername(username as string).subscribe(
      response => {
        // Check if a user was found and the password matches
        if (response.length > 0 && response[0].password === password) {
          const user = response[0]; // Get the user object
  
          // Save the user object to local storage
          localStorage.setItem('user', JSON.stringify(user));
  
          // Navigate based on the user's role and jobService id
          if (user.role === 'employer') {
            this.router.navigate(['/jobposting']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/jobmanagement']);
          } else {
            this.router.navigate(['/']); // or any other page for other roles
          }
        } else {
          this.errorFlag = true; // Set error flag if login failed
        }
      },
      error => {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    );
  }
  
}
