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
      return true; // Allow access
    }

    // If not admin, redirect to another page (e.g., home)
    this.router.navigate(['/jobmanagement']);
    return false; // Deny access
  }
}
