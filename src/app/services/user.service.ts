import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, observable, throwError} from 'rxjs';
import { User } from '../models/user';
//import { AuthenticateService } from './authenticate.service';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUser: any;
  selectedUser: any;
  userID: any;
  message!: string;
  isDisplayed!: boolean;
  private userUrl = 'http://localhost:3000/users';

  private userSubject: BehaviorSubject<User|null>;
  public user: Observable<User | null>;

  constructor(private httpClient:HttpClient, private router: Router ) { 
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.httpClient.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
        }));
  }

  isLoggedIn() : boolean{ return !!localStorage.getItem('token'); }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['login']);
  }

  register(user: User) {
    return this.httpClient.post(`${environment.apiUrl}/users/register`, user);
  }


  // Function to get the current user's role from local storage
  getCurrentUserRole(): string | null {
    const user = localStorage.getItem('user'); // Retrieve user data from local storage
    if (user) {
      const userData = JSON.parse(user); // Parse user data
      console.log('user is ' + userData + '; role is ' + userData.role);
      return userData.role; // Return the user's role
    }
    return null; // Return null if no user data exists
  }

  getUserList() {
    return this.httpClient.get<User[]>(`${environment.apiUrl}/users`);
  }

  // Fetch users
  getUsers(): Observable<any> {
    return this.httpClient.get<any>(this.userUrl);
  }

  // Update user role
  updateUserRole(userId: number, role: string): Observable<any> {
    return this.httpClient.patch(`${this.userUrl}/${userId}`, { role });
  }

  update(id: number, params: any) {
    return this.httpClient.put(`${environment.apiUrl}/users/${id}`, params)
        .pipe(map(x => {
            // update stored user if the logged in user updated their own record
            if (id == this.userValue?.id) {
                // update local storage
                const user = { ...this.userValue, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                this.userSubject.next(user);
            }
            return x;
        }));
  }

  delete(id: number) {
    return this.httpClient.delete(`${environment.apiUrl}/users/${id}`)
        .pipe(map(x => {
            // auto logout if the logged in user deleted their own record
            if (id == this.userValue?.id) {
                this.logout();
            }
            return x;
        }));
  }
}
