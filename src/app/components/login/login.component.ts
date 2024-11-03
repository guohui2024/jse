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
        if (response.length > 0 && response[0].password === password) {
          // Save user to local storage
          localStorage.setItem('user', JSON.stringify(response));

          // Retrieve id from JobService
          const id = this.jobService.getid();
          console.log("get id from jobService: " + id);

          if( id != null ) {
            console.log('to jobapply page: ');
            this.router.navigate(['/jobapply']);
          }else{
            console.log('to joblist page');
            this.router.navigate(['/joblist']);
          }
          
          // In your login method, after a successful login:
          if (response[0].role === 'employer') {
            this.router.navigate(['/job-posting']);
          } else {
            this.router.navigate(['/home']); // or any other page for other roles
          }

        } else {
          this.errorFlag = true;
        }
      },
      error => {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }

    )
  }
}
