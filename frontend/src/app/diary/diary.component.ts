import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../shared/auth-data.component';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { DiaryCardComponent } from '../diary-card/diary-card.component';


@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, DiaryCardComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private reviewDataService: ReviewDataService,
    private authDataService: AuthDataService) { }

  diaryEntries: ReviewEntry[];

  diarySubscription = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  username: string | null;
  LoggedIn: boolean = true;


  ngOnInit(): void {

    this.diarySubscription = this.reviewDataService.userReviewSubject.subscribe(reviewEntry => {
      console.log(reviewEntry);
      this.diaryEntries = reviewEntry;
      this.maxPages = this.reviewDataService.totalUserPages;
    });


    this.route.paramMap.subscribe(params => {

      this.username = params.get('username');

      if (this.username) {
        this.reviewDataService.getUserReviews(this.username, 0, 10);
      } else {

        this.authDataService.getIsLoggedIn().then(isLoggedIn => {
          if (isLoggedIn) {
            this.LoggedIn = true;
            this.username = this.authDataService.getUsername();
            this.reviewDataService.getUserReviews(this.username, 0, 10);
          } else {
            this.LoggedIn = false;
          }
        });
      }
    })
  }


  loadReviews(): void {
    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.reviewDataService.getUserReviews(this.authDataService.getUsername(), this.currentPage, this.pageSize);
      }
    });
  }

  onNextPage(): void {
    this.currentPage++;
    this.loadReviews();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReviews();
    }
  }


}
