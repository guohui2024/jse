import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  //private baseUrl = 'http://localhost:3000';
  private baseUrl = 'http://192.168.1.52:3000';

  // private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  registerUser(userDetails: User) {
    return this.http.post(`${this.baseUrl}/users`, userDetails);
  }

  getUserByUsername(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?username=${username}`);
  }

}
