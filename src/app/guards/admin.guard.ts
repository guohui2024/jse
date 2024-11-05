import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if the user exists and has the admin role
    if (user && user.role === 'admin') {
      console.log("This is admin login: " + user.role);
      return true; // Allow access if user is admin
    }

    // If not admin, redirect to the home page
    this.router.navigate(['/']);
    return false; // Deny access
  }
}
