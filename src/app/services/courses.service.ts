import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Course } from '../models/course';
import { catchError, map } from 'rxjs/operators';

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

  saveGPA(gpaObject:any){
    console.log("Save GPA");
    return this.http.post<any>('${this.baseUrl}', gpaObject)
  }
}