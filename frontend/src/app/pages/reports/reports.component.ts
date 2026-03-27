import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataService } from '../../shared/auth-data.component';

import { ReportDataService } from '../../shared/report-data.component';
import { ReportEntry } from '../../shared/report-entry.model';
import { Subscription } from 'rxjs';
import { ReviewEntry } from '../../shared/review-entry.model';
import { UserEntry } from '../../shared/user-entry.model';

@Component({
  selector: 'app-reports',
  imports: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authDataService: AuthDataService,
    private reportDataService: ReportDataService
  ) { }
  LoggedIn: boolean = false;

  private reportSubscription = new Subscription();
  private reports: ReportEntry[];

  private reviews: ReviewEntry | null;
  private users: UserEntry | null;

  target_type: string | null;
  target_id: string | number | null;

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
}
