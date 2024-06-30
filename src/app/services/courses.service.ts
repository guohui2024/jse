import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { Course } from '../models/course';

import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { UserGpa } from '../models/UserGpa';
import { SavedCourses } from '../models/savedCourses';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private baseUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {  }

  errorHandler(error: HttpErrorResponse): Observable<never> {
    if( error.error instanceof ErrorEvent ){
      console.error("An error occured !", error.error.message);
    }else{
      console.error('Backend returned code ${error.status}, ' + ' body was : $(error.error)');
    }
    return throwError(error.error)
  }

  getCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(`${this.baseUrl}/courses`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  getSavedCourses(username:string): Observable<Course[]>{
    //console.log("Get saved Course list : ", username);
    return this.http.get<Course[]>(`${this.baseUrl}/savedCourses?username=${username}`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  getUserGpa(username:string): Observable<UserGpa[]>{
    return this.http.get<UserGpa[]>(`${this.baseUrl}/userGpa?username=${username}`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  saveGpa(userGpa: UserGpa): Observable<UserGpa> {
    //const existingGpa = this.getUserGpaByUsername(userGpa.username);
    return this.getUserGpaByUsername(userGpa.username).pipe(
      switchMap(existingGpa => {
        if (existingGpa) {
          userGpa.id = existingGpa.id;
          console.log("existing usergpa.id", existingGpa.id);
          return this.updateUserGpa(userGpa);
        } else {
          console.log("No existing usergpa.id");
          return this.addUserGpa(userGpa);
        }
      })
    );
  }

  getUserGpaByUsername(username: String): Observable<UserGpa | null> {
    return this.http.get<UserGpa[]>(`${this.baseUrl}/userGpa?username=${username}`).pipe(
      map(userGpas => userGpas.length > 0 ? userGpas[0] : null),
      catchError(() => of(null))
    );
  }

  addUserGpa(userGpa: UserGpa): Observable<UserGpa> {
    return this.http.post<UserGpa>(`${this.baseUrl}/userGpa`, userGpa);
  }

  updateUserGpa(userGpa: UserGpa): Observable<UserGpa> {
    //console.log('Update user gpa: ', userGpa.id);
    const url = `${this.baseUrl}/userGpa/${userGpa.id}`;
    return this.http.put<UserGpa>(url, userGpa);
  }
  saveSelectedCourses(courses:SavedCourses[], username:string): Observable<SavedCourses[]>{ 
    return this.deleteSavedCourses(username).pipe(
      concatMap(() => {
        console.log('All records deleted successfully.');
        console.log('Ready to save courses:', courses);
        
        const createObservables = courses.map(course =>
          this.http.post<SavedCourses>(`${this.baseUrl}/savedCourses`, course)
        );
        
        console.log('Saving all courses...');
        return forkJoin(createObservables);
      }),
      catchError(err => {
        console.error('Error deleting records:', err);
        // Handle error appropriately or rethrow
        return of([]); // Return an empty array or handle error as needed
      })
    );
  }
    
  saveSelectedCourses_deprecated(courses:SavedCourses[], username:string): Observable<SavedCourses[]>{  
    this.deleteSavedCourses(username).subscribe({
      next: () => console.log('All records deleted successfully.'),
      error: err => console.error('Error deleting records:', err)
    });
    console.log("ready to save courses: " , courses)
    const createObservables = courses.map(course =>
      this.http.post<SavedCourses>(`${this.baseUrl}/savedCourses`, course)
    );
    console.log("All courses are saved ")
    return forkJoin(createObservables);
  }
  
  deleteSavedCourses(username:string){
    console.log('delete saved courses for user: ', username);

    return this.getSavedCoursesByUsername(username).pipe(
      switchMap(savedCourses => {
        if (savedCourses.length > 0) {
          // Create an array of delete observables
          const deleteObservables = savedCourses.map(course => 
            this.http.delete<void>(`${this.baseUrl}/savedCourses/${course.id}`)
          );
          // Use forkJoin to run all delete operations in parallel
          return forkJoin(deleteObservables);
        } else {
          // If no courses found, return an empty array of observables
          return of([]);
        }
      }), 
      catchError(err => {
        console.error('Error fetching or deleting records:', err);
        return of([]);
      })
    );
  }

  getSavedCoursesByUsername(username: string): Observable<SavedCourses[]> {
    return this.http.get<SavedCourses[]>(`${this.baseUrl}/savedCourses?username=${username}`);
  }
}