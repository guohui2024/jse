import { Component, Input, OnInit } from '@angular/core';
import { User } from './models/user';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
 // title = 'angular-primeng-app';

  
  @Input()
  public title: string = "JOB SEARCHING ENGINE";
  @Input()
  public isUserLoggedIn: boolean = false;

  user: any; //store applicant details

  constructor(private router: Router, private userService:UserService){ 
    //console.log('test!');
    
  }

  currentRole: string="user";

  ngOnInit(): void {
    
    // Retrieve the user's role from localStorage or any other auth service
   const storedUser = localStorage.getItem('user');
   if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('Current user is ' + user);
      this.currentRole = user.role; // Default to 'user'
      console.log('Current user role is ' + this.currentRole);
   }
  }

  isUserRole(role: string): boolean {
    return this.currentRole === role;
  }

  onLogin(){    
    console.log('Login page');
    this.router.navigate(['login']);
  }

  logout() {
    this.userService.logout();
  }
}
