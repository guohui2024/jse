// user-role-assignment.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-role-assignment',
  templateUrl: './user-role-assignment.component.html',
  styleUrls: ['./user-role-assignment.component.css']
})
export class UserRoleAssignmentComponent implements OnInit {
  users: any[] = []; // Array to hold user data
  confirmationMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Fetch users from the user service
    this.userService.getUsers().subscribe((data: any) => {
      this.users = data;
    });
  }

  saveUserRole(user: any): void {
    // Update user role through the user service
    this.userService.updateUserRole(user.id, user.role).subscribe(
      (response: any) => {
        console.log('User role updated:', response);
        this.showConfirmationMessage(`Role updated for ${user.name} to ${user.role}`);

        // Hide confirmation message after 3 seconds
        setTimeout(() => {
          this.confirmationMessage = null;
        }, 3000);
      },
      (      error: any) => {
        console.error("Error updating user role:", error);
      }
    );
  }

  private showConfirmationMessage(message: string): void {
    this.confirmationMessage = message;
  }
}
