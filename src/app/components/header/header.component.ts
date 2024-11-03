import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isLoggedIn: boolean = false;

  constructor(private router: Router, private changeDetector: ChangeDetectorRef){ 
    this.checkLoginStatus();
  }

  ngOnInit(): void{ 
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('user') !== null;
  }

  login(): void {
    localStorage.setItem('user', 'loggedInUser');
    this.isLoggedIn = true;
    this.changeDetector.detectChanges(); // Update view immediately
  }

  logOut() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
