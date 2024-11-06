import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Job } from '../models/job';
import { Application } from '../models/Application';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobUrl = 'http://localhost:3000/jobs';
  private applicationUrl = 'http://localhost:3000/applications';
  private employersUrl = 'http://localhost:3000/employers';

  constructor(private http: HttpClient) {}

  private id: number | null = null;

  // Method to set the id
  setid(id: number) {
    this.id = id;
  }

  // Method to get the id
  getid(): number | null {
    return this.id;
  }

  // Method to clear the id
  clearid() {
    this.id = null;
  }

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.jobUrl);
  }

  getApprovedJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.jobUrl).pipe(
      map(jobs => jobs.filter(job => job.status === 'approved'))
    );
  }

  getValidJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.jobUrl).pipe(
      map(jobs => jobs.filter(job => job.status !== 'deleted'))
    );
  }

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobUrl}/${id}`);
  }

  // Method to post a new job application
  saveApplication(applicationData: Application): Observable<Application> {
    return this.http.post<Application>(`${this.applicationUrl}`, applicationData);
  }

  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.jobUrl);
  }

  updateJob(id: number, jobStatus: any): Observable<any> {
    return this.http.put(`${this.jobUrl}/${id}`, jobStatus);
  }

  getEmployers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.employersUrl}`);
  }

  saveJob(jobData: any): Observable<any> {
    return this.http.post<any>(`${this.jobUrl}`, jobData);
  }
}
