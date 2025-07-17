import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { TagDataService } from '../shared/tag-data.component';
import { TagEntry } from '../shared/tag-entry.model';
import { TagCardComponent } from "../tag-card/tag-card.component";
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from "../review-card/review-card.component";
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { AuthDataService } from '../shared/auth-data.component';
import { Subscription } from 'rxjs';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [TagCardComponent, CommonModule, ReviewCardComponent, ReviewFormComponent],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})

export class RestaurantComponent implements OnInit {

  @ViewChild(ReviewFormComponent) reviewFormComponent: ReviewFormComponent;

  restaurantEntry: any;
  restaurantSubscription = new Subscription();

  bookmarkEntry: RestaurantEntry[];
  bookmarkSubscription = new Subscription();
  bookmarked:boolean = false;

  tagEntry: TagEntry[]
  tagSubscription = new Subscription();

  reviewEntry: ReviewEntry[]
  reviewSubscription = new Subscription();

  userReviewEntry: ReviewEntry[]
  userReviewSubscription = new Subscription();

  restaurantId: number;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  constructor(private router: Router,
    private restaurantDataService: RestaurantDataService,
    private tagDataService: TagDataService,
    private reviewDataService: ReviewDataService,
    private route: ActivatedRoute,
    private authDataService: AuthDataService) { }


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
      console.log(restaurantEntry)
      this.restaurantEntry = restaurantEntry;
    });
  
    this.bookmarkSubscription = this.restaurantDataService.bookmarkSubject.subscribe(bookmarkEntry =>{
      this.bookmarkEntry = bookmarkEntry;
      if(this.restaurantDataService.totalBookmarks > 0){
        this.bookmarked = true;
      }
    })

    this.route.params.subscribe(params => {

      console.log(this.route.snapshot.params)
      this.restaurantId = params['id'];
      console.log('test: ', this.restaurantId);

      if (this.restaurantId == null) {
        console.log('empty');
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
      }
    });
  }


  getSingleReview(): ReviewEntry|null{
    if(this.userReviewEntry){
      if(this.userReviewEntry.length > 0){
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




}
