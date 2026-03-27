import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../shared/auth-data.component';
import { UserFormComponent } from '../user-form/user-form.component';

import { ReportModalService } from '../shared/reportModal.service';

@Component({
    selector: 'app-user',
    imports: [RestaurantCardComponent, ReviewCardComponent, UserFormComponent],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    standalone: true
})
export class UserComponent {

  userEntry: any;
  userSubscription = new Subscription();

  restaurantSubscription = new Subscription();
  recentRestaurantEntry: RestaurantEntry[];

  favouriteSubscription = new Subscription();
  favRestaurantEntry: RestaurantEntry[];

  reviewEntry: ReviewEntry[];
  reviewSubscription = new Subscription();

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
    private reportModalService:ReportModalService,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnDestroy(): void {
    this.reviewSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.userSubscription = this.userDataService.userSubject.subscribe(userEntry => {
      console.log(userEntry);
      this.userEntry = userEntry;
      this.showEditLogic();
    });

    this.reviewSubscription = this.reviewDataService.userReviewSubject.subscribe(reviewEntry => {
      this.reviewEntry = reviewEntry;
      this.maxPages = this.reviewDataService.totalPages;
    });
    this.restaurantSubscription = this.restaurantDataService.recentSubject.subscribe(recentRestaurants => {
      this.recentRestaurantEntry = recentRestaurants;
    });

    this.favouriteSubscription = this.restaurantDataService.favouriteSubject.subscribe(favRestaurants => {
      this.favRestaurantEntry = favRestaurants;
    });

    // fetch data

    this.route.paramMap.subscribe(params => {

      this.username = params.get('username');

      if (this.username) {

        this.userDataService.GetUserById(this.username);
        this.restaurantDataService.GetFavouriteResturaunts(this.username);
        this.restaurantDataService.GetRecentResturaunts(this.username);
        this.reviewDataService.getUserReviews(this.username, 0, 10);
      } else {
        this.authDataService.getIsLoggedIn().then(isLoggedIn => {
          if (isLoggedIn) {
            this.userDataService.GetUser();
            this.restaurantDataService.GetFavouriteResturaunts(this.authDataService.getUsername());
            this.restaurantDataService.GetRecentResturaunts(this.authDataService.getUsername());
            this.reviewDataService.GetReviews(0, 10);
            this.LoggedIn = true;
          } else {
            this.LoggedIn = false;
          }
        });

      }
    })
  }


  goToSection(section: string) {
    if (this.username && this.username != this.authDataService.getUsername()) {
      this.router.navigate([`/user/${this.username}/${section}`]);
    } else {
      this.router.navigate([`/user/${section}`]);
    }
  }


  loadReviews(): void {

    if (this.username) {
      this.reviewDataService.getUserReviews(this.username, this.currentPage, this.pageSize);
    } else {
      this.reviewDataService.GetReviews(this.currentPage, this.pageSize);
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
