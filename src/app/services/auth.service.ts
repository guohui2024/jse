import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUser() {
    throw new Error('Method not implemented.');
  }

  private baseUrl = 'http://localhost:3000';

  // private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  registerUser(userDetails: User) {
    return this.http.post(`${this.baseUrl}/users`, userDetails);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?username=${username}`);
  }

  // login() {
  //   localStorage.setItem('user', 'someUserData');
  //   this.isLoggedInSubject.next(true);
  // }

  // logout() {
  //   localStorage.removeItem('user');
  //   this.isLoggedInSubject.next(false);
  // }

  // checkLoginStatus() {
  //   const user = localStorage.getItem('user');
  //   this.isLoggedInSubject.next(!!user);
  // }

}
