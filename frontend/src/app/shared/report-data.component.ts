import { Injectable } from '@angular/core';
import { UserEntry } from './user-entry.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';
import { environment } from '../../environments/environment';
import { ReviewEntry } from './review-entry.model';
import { ReportEntry } from './report-entry.model';

import { ToastService } from '../shared/toast.service';

@Injectable({
  providedIn: 'root'
})

export class ReportDataService {

  reportEntry: ReportEntry[];
  reportSubject = new Subject<ReportEntry[]>();

  userEntry: UserEntry | null;
  userSubject = new Subject<UserEntry>();

  reviewEntry: ReviewEntry | null;
  reviewSubject = new Subject<ReviewEntry>();

  totalReports: number = 0;
  totalPages: number = 0;

  /**
  /reports
  **GET / → Get all reports  
  GET /review/:reviewId → Get all reports on a review
  GET /user/:userReportId → Get all reports on a user   
  POST / → Add a new report     
  POST /:type/:id/dismiss → Dismiss a report     
  POST /review/:id/remove → Remove a review
  POST /user/:id/ban → Ban a user 
   */

  constructor(private http: HttpClient, private toast:ToastService) { }

  private baseUrl = environment.apiEndpoint;

  get() {

    this.reviewEntry = null;
    this.userEntry = null;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ reports: ReportEntry[] }>(`${this.baseUrl}reports`, { headers })
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.reportSubject.next(this.reportEntry);
      })
  }

  getReview(reviewId: string | number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ reports: ReportEntry[], review: ReviewEntry }>(`${this.baseUrl}reports/review/${reviewId}`, { headers })
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.reviewEntry = jsonData.review;
        this.reportSubject.next(this.reportEntry);
      })
  }


  getUser(userReportId: string | number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ reports: ReportEntry[], user: UserEntry }>(`${this.baseUrl}reports/user/${userReportId}`, { headers })
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.userEntry = jsonData.user;
        this.reportSubject.next(this.reportEntry);
      })
  }


  report(reportEntry: ReportEntry){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);
    this.http.post<{ message: string }>(`${this.baseUrl}reports`, reportEntry, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
      this.toast.show(jsonData.message,"info");
    })
  }


  dismiss(reportEntry: ReportEntry): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}reports/${reportEntry.target_type}/${reportEntry.target_id}/dismiss`, {}, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }


  banUser(id: string | number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}reports/user/${id}/ban`, {}, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }

  removeReview(id: string | number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}reports/review/${id}/remove`, {}, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }




}
