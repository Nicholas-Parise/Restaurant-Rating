import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../../_shared/auth-data.component';
import { ReviewEntry } from '../../_shared/review-entry.model';
import { ReviewDataService } from '../../_shared/review-data.component';
import { DiaryCardComponent } from '../../diary-card/diary-card.component';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-diary',
  imports: [DiaryCardComponent],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css',
  standalone: true
})
export class DiaryComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private reviewDataService: ReviewDataService,
    private authDataService: AuthDataService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document) { }

  diaryEntries: ReviewEntry[];

  diarySubscription = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  username: string | null;
  LoggedIn: boolean = true;

  showEdit: boolean = false;


  ngOnInit(): void {

    this.diarySubscription = this.reviewDataService.userReviewSubject.subscribe(reviewEntry => {
      this.diaryEntries = reviewEntry;
      this.maxPages = this.reviewDataService.totalUserPages;
    });


    this.route.paramMap.subscribe(params => {

      this.username = params.get('username');

      if (this.username) {
        this.setSEO(this.username);
        this.reviewDataService.getUserReviews(this.username, 0, 10);
      } 
   
      this.showEditLogic();
   
    })
  }


  showEditLogic(): void {
    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn && this.username == this.authDataService.getUsername()) {
        this.showEdit = true;
      }
    });
  }


  loadReviews(): void {
    if (this.username) {
      this.reviewDataService.getUserReviews(this.username, this.currentPage, this.pageSize);
    }
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

  
  setSEO(username: string) {
  
    const url = `https://deglazd.com/user/${username}/diary`;
  
    const description =
      `${username}'s Diary. See all the places they've been and the rating they all got, on Deglazd.`;
  
    // title
    this.title.setTitle(
      `${username}'s Diary | Deglazd`
    );
  
    // description
    this.meta.updateTag({
      name: 'description',
      content: description
    });
  
    // OpenGraph
    this.meta.updateTag({
      property: 'og:title',
      content: `${username}'s Diary | Deglazd`
    });
  
    this.meta.updateTag({
      property: 'og:description',
      content: description
    });
  
    this.meta.updateTag({
      property: 'og:url',
      content: url
    });
  
    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });
  /*
    if (user.picture) {
      this.meta.updateTag({
        property: 'og:image',
        content: user.picture
      });
    }
  */

    // canonical
    let link: HTMLLinkElement =
      this.document.querySelector("link[rel='canonical']") ||
      this.document.createElement('link');
  
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
  
    this.document.head.appendChild(link);
  }

}
