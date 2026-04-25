import { Component, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthDataService } from '../../_shared/auth-data.component';

import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';

import { TagEntry } from '../../_shared/tag-entry.model';
import { TagCardComponent } from "../../tag-card/tag-card.component";

import { ReviewDataService } from '../../_shared/review-data.component';
import { ReviewEntry } from '../../_shared/review-entry.model';
import { ReviewCardComponent } from "../../review-card/review-card.component";

import { ReviewFormComponent } from '../../review-form/review-form.component';
import { RatingChartComponent } from '../../rating-chart/rating-chart.component';

import { ListDataService } from '../../_shared/list-data.component';
import { ListEntry } from '../../_shared/list-entry.model';

import { RestaurantMapComponent } from '../../restaurant-map/restaurant-map.component';

import { UtilService } from '../../_shared/util.service';

@Component({
  selector: 'app-restaurant',
  imports: [TagCardComponent, CommonModule, ReviewCardComponent, ReviewFormComponent, RatingChartComponent, RestaurantMapComponent],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
  standalone: true
})

export class RestaurantComponent implements OnInit {

  @ViewChild(ReviewFormComponent) reviewFormComponent: ReviewFormComponent;

  util = inject(UtilService)

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  restaurantEntry: RestaurantEntry;
  mapLink: string = '';

  bookmarkEntry: RestaurantEntry[];
  bookmarkSubscription = new Subscription();
  bookmarked: boolean = false;

  tagEntry: TagEntry[]

  reviewEntry: ReviewEntry[]
  reviewSubscription = new Subscription();

  userReviewEntry: ReviewEntry[]
  userReviewSubscription = new Subscription();

  userListSubscription = new Subscription();
  userList: ListEntry[];

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  constructor(private router: Router,
    private restaurantDataService: RestaurantDataService,
    private reviewDataService: ReviewDataService,
    private route: ActivatedRoute,
    private authDataService: AuthDataService,
    private listDataService: ListDataService) { }


  ngOnDestroy(): void {
    this.reviewSubscription.unsubscribe();
    this.userReviewSubscription.unsubscribe();
    this.bookmarkSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.reviewSubscription = this.reviewDataService.reviewSubject.subscribe(reviewEntry => {
      this.reviewEntry = reviewEntry;
      this.maxPages = this.reviewDataService.totalPages;
    });

    this.userReviewSubscription = this.reviewDataService.userReviewSubject.subscribe(userReviewEntry => {
      this.userReviewEntry = userReviewEntry;
      this.maxPages = this.reviewDataService.totalUserPages;
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


    const data = this.route.snapshot.data['restaurantData'];
    if (!data || !data.restaurant) {
      this.router.navigate(['/']);
      return;
    }

    this.restaurantEntry = data.restaurant;
    this.reviewEntry = data.reviews;

    if (!this.restaurantEntry.pictures) {
      this.restaurantEntry.pictures = this.util.getPlaceholderImage(this.restaurantEntry.type);
    }
    this.mapLink = this.getMapsLink();

    const correctSlug = `${this.restaurantEntry.slug}-${this.restaurantEntry.id}`;
    const currentSlug = this.route.snapshot.params['slug'];

    if (currentSlug !== correctSlug) {
    this.router.navigate(['/restaurant', correctSlug], { replaceUrl: true });
      return;
    }

    if (this.isBrowser) {
      this.loadUserContent();
    }

  }

  showReviewForm(): void {
    this.reviewFormComponent.showForm();
  }

  loadReviews(): void {
    this.reviewDataService.getRestauranReviews(this.restaurantEntry.id, this.currentPage, this.pageSize);
  }


  loadUserContent(): void {
    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.reviewDataService.getRestaurantUserReviews(this.restaurantEntry.id, this.authDataService.getUsername(), this.currentPage, this.pageSize);
        this.restaurantDataService.GetBookmarkResturaunts(this.restaurantEntry.id);
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
    target.src = this.util.getPlaceholderImage(this.restaurantEntry.type);
  }

  getMapsLink(): string {
    const coords = encodeURIComponent(`${this.restaurantEntry.lat},${this.restaurantEntry.lon}`);

    const address: string = (this.restaurantEntry.housenumber || this.restaurantEntry.name) + " " + this.restaurantEntry?.addr + " " + this.restaurantEntry?.city + " " + this.restaurantEntry?.province + " " + this.restaurantEntry?.country;

    console.log(address);

    const encodedAddress = encodeURIComponent(address);
    const encodedName = encodeURIComponent(this.restaurantEntry.name)
    if (this.isBrowser) {
      if (/iPhone|iPad|Mac/.test(navigator.userAgent)) {
        return `https://maps.apple.com/?ll=${coords}&q=${encodedAddress}`;
      }
    }
    //return `https://www.google.com/maps/search/?api=1&query=${coords}%20(${encodedAddress})`;
    return `https://www.google.com/maps/search/?api=1&query=${encodedName}%2C${encodedAddress}`;
  }

}
