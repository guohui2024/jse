import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { Course } from '../models/course';

import { catchError, map, switchMap } from 'rxjs/operators';
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
    console.log("Get Course list")
    return this.http.get<Course[]>(`${this.baseUrl}/courses`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  getSavedCourses(username:string): Observable<Course[]>{
    console.log("Get saved Course list : ", username);
    return this.http.get<Course[]>(`${this.baseUrl}/savedCourses?username=${username}`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  getUserGpa(username:string): Observable<UserGpa[]>{
    console.log("Get gpa:" , username);
    return this.http.get<UserGpa[]>(`${this.baseUrl}/userGpa?username=${username}`).pipe(
      catchError(this.errorHandler),
      map((resp)=>resp)
    );
  }

  saveGpa(userGpa: UserGpa): Observable<UserGpa> {
    console.log("Save GPA");
    return this.getUserGpaByUsername(userGpa.username).pipe(
      switchMap(existingGpa => {
        if (existingGpa == null) {
          return this.updateUserGpa(userGpa);
        } else {
          return this.addUserGpa(userGpa);
        }
      })
    );
  }

  getUserGpaByUsername(username: String): Observable<UserGpa | null> {
    console.log("get user gpa: ", username);
    return this.http.get<UserGpa>(`${this.baseUrl}/userGpa?username=${username}`).pipe(
      map(resp => resp)
    );
  }

  addUserGpa(userGpa: UserGpa): Observable<UserGpa> {
    console.log("add user gpa: ", userGpa);
    return this.http.post<UserGpa>(`${this.baseUrl}/userGpa`, userGpa);
  }

  updateUserGpa(userGpa: UserGpa): Observable<UserGpa> {
    console.log('Update user gpa: ', userGpa.id);
    const url = `${this.baseUrl}/userGpa/${userGpa.id}`;
    return this.http.put<UserGpa>(url, userGpa);
  }

  saveSelectedCourses(courses:Course[], username:string):Observable<Course[]>{
    console.log("before save courses: " , courses);    
    const observables = courses.map(course => 
          this.getSavedCourseById(course.id).pipe(
            switchMap(existingCourse => {
              console.log('existingCourse: ', existingCourse);
              if (existingCourse.size>0) {
                return this.deleteSavedCource(course);
              } 
              course.username=username;
              return this.addCourse(course);
            })
          )
    );
    return forkJoin(observables) as Observable<Course[]>;
  }

  deleteSavedCource(course:Course){
    console.log('delete saved courses: ');
    return this.http.delete<any>(`${this.baseUrl}/savedCourses?id=${course.id}`).pipe(
      catchError(error => of(null)) // Return null if not found
    );
  }

  getSavedCourseById(id: string): Observable<any> {
    console.log('check saved courses: ',`${this.baseUrl}/savedCourses/${id}`);
    return this.http.get<any>(`${this.baseUrl}/savedCourses?id=${id}`).pipe(
      catchError(error => of(null)) // Return null if not found
    );
  }

  addCourse(course: Course) {
    console.log("add course: ", course,  " : " ,  '${this.baseUrl}/savedCourses/');
    return this.http.post(`${this.baseUrl}/savedCourses/`, course);
  }
}