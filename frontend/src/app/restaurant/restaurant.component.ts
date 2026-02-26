import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthDataService } from '../shared/auth-data.component';

import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';

import { TagDataService } from '../shared/tag-data.component';
import { TagEntry } from '../shared/tag-entry.model';
import { TagCardComponent } from "../tag-card/tag-card.component";

import { ReviewDataService } from '../shared/review-data.component';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewCardComponent } from "../review-card/review-card.component";

import { ReviewFormComponent } from '../review-form/review-form.component';
import { RatingChartComponent } from '../rating-chart/rating-chart.component';

import { ListDataService } from '../shared/list-data.component';
import { ListEntry } from '../shared/list-entry.model';

@Component({
    selector: 'app-restaurant',
    imports: [TagCardComponent, CommonModule, ReviewCardComponent, ReviewFormComponent, RatingChartComponent],
    templateUrl: './restaurant.component.html',
    styleUrl: './restaurant.component.css',
    standalone: true
})

export class RestaurantComponent implements OnInit {

  @ViewChild(ReviewFormComponent) reviewFormComponent: ReviewFormComponent;

  restaurantEntry: any;
  restaurantSubscription = new Subscription();

  bookmarkEntry: RestaurantEntry[];
  bookmarkSubscription = new Subscription();
  bookmarked: boolean = false;

  tagEntry: TagEntry[]
  tagSubscription = new Subscription();

  reviewEntry: ReviewEntry[]
  reviewSubscription = new Subscription();

  userReviewEntry: ReviewEntry[]
  userReviewSubscription = new Subscription();

  userListSubscription = new Subscription();
  userList: ListEntry[];

  restaurantId: number;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  constructor(private router: Router,
    private restaurantDataService: RestaurantDataService,
    private tagDataService: TagDataService,
    private reviewDataService: ReviewDataService,
    private route: ActivatedRoute,
    private authDataService: AuthDataService,
    private listDataService: ListDataService) { }


  ngOnDestroy(): void {
    this.reviewSubscription.unsubscribe();
    this.tagSubscription.unsubscribe();
    this.restaurantSubscription.unsubscribe();
    this.userReviewSubscription.unsubscribe();
    this.bookmarkSubscription.unsubscribe();
  }

  ngOnInit(): void {

    //this.reviewDataService.getRestauranReviews(this.restaurantId, this.currentPage, this.pageSize);
    //this.reviewDataService.GetReviews();

    this.reviewSubscription = this.reviewDataService.reviewSubject.subscribe(reviewEntry => {
      this.reviewEntry = reviewEntry;
      this.maxPages = this.reviewDataService.totalPages;
    });


    this.userReviewSubscription = this.reviewDataService.userReviewSubject.subscribe(userReviewEntry => {
      this.userReviewEntry = userReviewEntry;
      this.maxPages = this.reviewDataService.totalUserPages;
    });


    this.tagSubscription = this.tagDataService.tagSubject.subscribe(tagEntry => {
      this.tagEntry = tagEntry;
    });
    this.tagEntry = this.tagDataService.GetTags();


    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry => {
      //console.log(restaurantEntry)
      this.restaurantEntry = restaurantEntry;
      //console.log(this.restaurantEntry.score_histogram);
    });

    this.bookmarkSubscription = this.restaurantDataService.bookmarkSubject.subscribe(bookmarkEntry => {
      this.bookmarkEntry = bookmarkEntry;
      if (this.restaurantDataService.totalBookmarks > 0) {
        this.bookmarked = true;
      }
    })

    this.userListSubscription = this.listDataService.userListSubject.subscribe(userList => {
      this.userList = userList;
    });


    this.route.params.subscribe(params => {

      //console.log(this.route.snapshot.params)
      this.restaurantId = params['id'];
      //console.log('test: ', this.restaurantId);

      if (this.restaurantId == null) {
        //console.log('empty');
        this.router.navigate(['/']);
      } else {
        try {
          this.restaurantDataService.GetResturauntsById(this.restaurantId);
          this.loadReviews();

        } catch (e) {
          this.router.navigate(['/']);
          //this.restaurantDataService.GetResturaunts();
        }
      }
      //this.restaurantDataService.GetResturauntsById(this.id).subscribe( restaurantEntry => {
      //this.restaurantEntry = restaurantEntry
      //}

    })
  }


  showReviewForm(): void {
    this.reviewFormComponent.showForm();
  }


  loadReviews(): void {
    this.reviewDataService.getRestauranReviews(this.restaurantId, this.currentPage, this.pageSize);

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.reviewDataService.getRestaurantUserReviews(this.restaurantId, this.authDataService.getUsername(), this.currentPage, this.pageSize);
        this.restaurantDataService.GetBookmarkResturaunts(this.restaurantId);
        this.listDataService.getLists();
      }
    });
  }

  
  getSingleReview(): ReviewEntry | null {
    if (this.userReviewEntry) {
      if (this.userReviewEntry.length > 0) {
        return this.userReviewEntry[0];
      }
    }
    return null;
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

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-restaurant.png';
  }

  getMapsLink(): string {
    const coords = `${this.restaurantEntry.lat},${this.restaurantEntry.lon}`;
    
    const address : string = (this.restaurantEntry.housenumber || this.restaurantEntry.name) +" "+this.restaurantEntry?.addr +" "+ this.restaurantEntry?.city +" "+ this.restaurantEntry?.province +" "+ this.restaurantEntry?.country;
    
    console.log(address);

    const encodedAddress = encodeURIComponent(address);

    if (/iPhone|iPad|Mac/.test(navigator.userAgent)) {
      return `https://maps.apple.com/?ll=${coords}&q=${encodedAddress}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${coords}%20(${encodedAddress})`;
  }

}
