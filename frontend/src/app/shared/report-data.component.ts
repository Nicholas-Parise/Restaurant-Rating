import { Injectable } from '@angular/core';
import { UserEntry } from './user-entry.model';
import { Subject } from 'rxjs';
import { ReviewEntry } from './review-entry.model';
import { ReportEntry } from './report-entry.model';

import { ToastService } from '../shared/toast.service';
import { ApiService } from './api.service';


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

  constructor(private api: ApiService,private toast: ToastService) {}


  get() {
    this.reviewEntry = null;
    this.userEntry = null;

    this.api.get<{ reports: ReportEntry[] }>(`reports`)
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.reportSubject.next(this.reportEntry);
      })
  }

  getReview(reviewId: string | number) {
    this.api.get<{ reports: ReportEntry[], review: ReviewEntry }>(`reports/review/${reviewId}`)
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.reviewEntry = jsonData.review;
        this.reportSubject.next(this.reportEntry);
      })
  }


  getUser(userReportId: string | number) {
    this.api.get<{ reports: ReportEntry[], user: UserEntry }>(`reports/user/${userReportId}`)
      .subscribe((jsonData) => {
        this.reportEntry = jsonData.reports;
        this.userEntry = jsonData.user;
        this.reportSubject.next(this.reportEntry);
      })
  }


  report(reportEntry: ReportEntry){
    this.api.post<{ message: string }>(`reports`, reportEntry).subscribe((jsonData) => {
      console.log(jsonData.message);
      this.toast.show(jsonData.message,"info");
    })
  }


  dismiss(reportEntry: ReportEntry): void {
    this.api.post<{ message: string }>(`reports/${reportEntry.target_type}/${reportEntry.target_id}/dismiss`, {}).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }


  banUser(id: string | number): void {
    this.api.post<{ message: string }>(`reports/user/${id}/ban`, {}).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }

  removeReview(id: string | number): void {
    this.api.post<{ message: string }>(`reports/review/${id}/remove`, {}).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
  }

}
