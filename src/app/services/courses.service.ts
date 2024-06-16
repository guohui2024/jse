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
          //console.log("existing usergpa.id", existingGpa.id);
          return this.updateUserGpa(userGpa);
        } else {
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
    //console.log("add user gpa: ", userGpa);
    if (!userGpa.id) {
      throw new Error('UserGpa ID is required for update');
    }
    return this.http.post<UserGpa>(`${this.baseUrl}/userGpa`, userGpa);
  }

  updateUserGpa(userGpa: UserGpa): Observable<UserGpa> {
    //console.log('Update user gpa: ', userGpa.id);
    const url = `${this.baseUrl}/userGpa/${userGpa.id}`;
    return this.http.put<UserGpa>(url, userGpa);
  }

  saveSelectedCourses(courses:SavedCourses[], username:string):Observable<SavedCourses[]>{
    console.log("before save courses: " , courses);    
    const observables = courses.map(course => 
          this.getSavedCourseById(course.id).pipe(
            switchMap(existingCourse => {
              console.log('existingCourse: ', existingCourse, "; course: " , course, '; find course: ', existingCourse == null);
              if (existingCourse) {
                course.id = existingCourse.id;
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
    return this.http.delete<any>(`${this.baseUrl}/savedCourses/${course.id}`).pipe(
      catchError(error => of(null)) // Return null if not found
    );
  }

  getSavedCourseById(id: string): Observable<SavedCourses|null> {
    console.log('check saved course: ',`${this.baseUrl}/savedCourses/${id}`);
    return this.http.get<SavedCourses[]>(`${this.baseUrl}/savedCourses/${id}`).pipe(
      map(savedCourse => savedCourse.length > 0 ? savedCourse[0] : null),
      catchError(() => of(null))
    );
  }

  addCourse(course: Course) {
    console.log("add course: ", course,  " : " ,  '${this.baseUrl}/savedCourses/');
    return this.http.post(`${this.baseUrl}/savedCourses/`, course);
  }
}

function uuidv4(): string {
  throw new Error('Function not implemented.');
}
