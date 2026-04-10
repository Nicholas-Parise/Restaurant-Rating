import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

import { AuthDataService } from '../../shared/auth-data.component';
import { ReportDataService } from '../../shared/report-data.component';

import { ReportEntry } from '../../shared/report-entry.model';
import { ReviewEntry } from '../../shared/review-entry.model';
import { UserEntry } from '../../shared/user-entry.model';

import { ReportCardComponent } from '../../report-card/report-card.component';
import { ReportCaseCardComponent } from '../../report-case-card/report-case-card.component';
import { ReviewCardComponent } from '../../review-card/review-card.component';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, RouterLink, ReportCaseCardComponent, ReportCardComponent,ReviewCardComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
   standalone: true
})
export class ReportsComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authDataService: AuthDataService,
    private reportDataService: ReportDataService
  ) { }
  LoggedIn: boolean = false;

  private reportSubscription = new Subscription();
  reports: ReportEntry[];

  reviews: ReviewEntry | null;
  users: UserEntry | null;

  target_type: string | null;
  target_id: string | number | null;

  ngOnDestroy(): void {
    this.reportSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.reportSubscription = this.reportDataService.reportSubject.subscribe(reports => {
      this.reports = reports;
      this.reviews = this.reportDataService.reviewEntry;
      this.users = this.reportDataService.userEntry;
    });


    this.route.paramMap.subscribe(params => {
      this.target_type = params.get('target_type');
      this.target_id = params.get('target_id');

      this.authDataService.getIsLoggedIn().then(isLoggedIn => {

        this.LoggedIn = isLoggedIn;

        if (isLoggedIn && this.authDataService.getIsMod()) {
          if (this.target_type == "user" && this.target_id) {
            this.reportDataService.getUser(this.target_id);
          } else if (this.target_type == "review" && this.target_id) {
            this.reportDataService.getReview(this.target_id);
          } else {
            this.reportDataService.get();
          }
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }


dismiss(report:ReportEntry):void{
  this.reportDataService.dismiss(report);
  this.router.navigate(['/reports']);
}


ban(users: UserEntry):void{
  this.reportDataService.banUser(users.id);
  this.router.navigate(['/reports']);
}


remove(review:ReviewEntry):void{
  this.reportDataService.removeReview(review.id);
  this.router.navigate(['/reports']);
}









}
