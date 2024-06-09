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

  saveGpa(data: UserGpa){
    console.log("Save GPA");
    return this.http.put(`${this.baseUrl}/userGpa/${data.id}`, data);
  }

  getUserGpaByUsername(username: String): Observable<UserGpa> {
    return this.http.get<UserGpa>(`${this.baseUrl}/userGpa?username=${username}`).pipe(
      map(resp => resp)
    );
  }

  saveOrUpdateSelectedCourses(courses:Course[], username:string):Observable<Course[]>{
    console.log("before save: " , courses);
    const observables = courses.map(course => 
          this.getSavedCourseById(course.id).pipe(
            switchMap(existingCourse => {
              console.log('existingCourse: ', existingCourse);
              if (existingCourse) {
                return this.updateCourse(course);
              } else {
                return this.addCourse(course);
              }
            })
          )
        );
        return forkJoin(observables) as Observable<Course[]>;
  }

  getSavedCourseById(id: string): Observable<any> {
    console.log('check saved courses: ',`${this.baseUrl}/savedCourses/${id}`);
    return this.http.get<any>(`${this.baseUrl}/savedCourses/${id}`).pipe(
      catchError(error => of(null)) // Return null if not found
    );
  }

  updateCourse(course: Course) {
    console.log("update course: ", course);
    return this.http.put(`${this.baseUrl}/savedCourses/${course.id}`, course);
  }

  addCourse(course: Course) {
    console.log("add course: ", course,  " : " ,  '${this.baseUrl}/savedCourses/');
    return this.http.post(`${this.baseUrl}/savedCourses/`, course);
  }
}