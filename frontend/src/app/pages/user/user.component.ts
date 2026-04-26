import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import { UserEntry } from '../../_shared/user-entry.model';
import { UserDataService } from '../../_shared/user-data.component';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantCardComponent } from '../../restaurant-card/restaurant-card.component';
import { ReviewEntry } from '../../_shared/review-entry.model';
import { ReviewDataService } from '../../_shared/review-data.component';
import { ReviewCardComponent } from '../../review-card/review-card.component';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../../_shared/auth-data.component';
import { UserFormComponent } from '../../user-form/user-form.component';

import { ReportModalService } from '../../_shared/reportModal.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [RestaurantCardComponent, ReviewCardComponent, UserFormComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true
})
export class UserComponent {

  userEntry: UserEntry;
  userSubscription = new Subscription();

  recentRestaurantEntry: RestaurantEntry[];
  favRestaurantEntry: RestaurantEntry[];

  reviewEntry: ReviewEntry[];
  reviewSubscription = new Subscription();

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  username: string | null;
  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  showEdit: boolean = false;

  LoggedIn: boolean = true;

  constructor(
    private userDataService: UserDataService,
    private restaurantDataService: RestaurantDataService,
    private reviewDataService: ReviewDataService,
    private authDataService: AuthDataService,
    private reportModalService: ReportModalService,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnDestroy(): void {
    this.reviewSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.userSubscription = this.userDataService.userSubject.subscribe(userEntry => {
      this.userEntry = userEntry;
      this.showEditLogic();
    });

    this.reviewSubscription = this.reviewDataService.userReviewSubject.subscribe(reviewEntry => {
      this.reviewEntry = reviewEntry;
      this.maxPages = this.reviewDataService.totalPages;
    });

    // fetch data
    const data = this.route.snapshot.data['userData'];
    if (!data || !data.user) {
      this.router.navigate(['/']);
      return;
    }

    this.userEntry = data.user;
    this.favRestaurantEntry = data.favourite_restaurants;
    this.recentRestaurantEntry = data.recents;
    this.reviewEntry = data.reviews;
    this.maxPages = data.totalReviews / 10;

    this.username = this.userEntry.username;

    this.showEditLogic();

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.LoggedIn = true;
        this.userDataService.GetUser();
      } else {
        this.LoggedIn = false;
      }
    });

  }


  goToSection(section: string) {
    if (this.username) {
      this.router.navigate([`/user/${this.username}/${section}`]);
    }
  }


  loadReviews(): void {
    if (this.username) {
      this.reviewDataService.getUserReviews(this.username, this.currentPage, this.pageSize);
    }
  }


  showEditLogic(): void {
    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn && this.userEntry.username == this.authDataService.getUsername()) {
        this.showEdit = true;
      }
    });
  }


  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }

  reportUser() {
    this.reportModalService.open({
      type: 'user',
      data: this.userEntry
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
