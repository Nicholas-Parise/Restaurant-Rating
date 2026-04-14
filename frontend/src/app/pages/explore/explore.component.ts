import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { Subscription, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthDataService } from '../../shared/auth-data.component';

import { RestaurantEntry } from '../../shared/restaurant-entry.model';
import { RestaurantDataService } from '../../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../../restaurant-card/restaurant-card.component";

import { UserEntry } from '../../shared/user-entry.model';
import { UserDataService } from '../../shared/user-data.component';
import { UserCardComponent } from '../../user-card/user-card.component';

import { ListEntry } from '../../shared/list-entry.model';
import { ListDataService } from '../../shared/list-data.component';
import { ListCardComponent } from '../../list-card/list-card.component';

@Component({
  selector: 'app-explore',
  imports: [FormsModule, RestaurantCardComponent, UserCardComponent, ListCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css',
  standalone: true
})
export class ExploreComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authDataService: AuthDataService,
    private restaurantDataService: RestaurantDataService,
    private userDataService: UserDataService,
    private listDataService: ListDataService
  ) { }

  searchMode: 'restaurants' | 'users' | 'lists' = 'restaurants';

  restaurantEntry: RestaurantEntry[] = [];
  restaurantSubscription = new Subscription();

  userEntry: UserEntry[] = [];
  userSubscription = new Subscription();

  listEntry: ListEntry[] = [];
  listSubscription = new Subscription();

  private searchTrigger$ = new Subject<{
    query: string;
    page: number;
    radius: number;
    lat: number | null;
    lng: number | null;
    searchMode: string;
  }>();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;
  searchQuery = '';
  nearbyEnabled = false;
  lat: number | null = null;
  lng: number | null = null;
  searchRadius = 10;
  bounce_time = 0;

  selectedUser: UserEntry | null = null;

  LoggedIn: boolean;

  ngOnInit(): void {

    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry => {
      this.restaurantEntry = restaurantEntry;
      this.maxPages = this.restaurantDataService.totalPages;
      console.log(this.maxPages);
    });


    this.userSubscription = this.userDataService.userSearchSubject.subscribe(userSearchEntry => {
      this.userEntry = userSearchEntry;
      this.maxPages = this.userDataService.totalPages;
      console.log(this.maxPages);
    });

    this.listSubscription = this.listDataService.listSubject.subscribe(listEntry => {
      this.listEntry = listEntry;
      this.maxPages = this.listDataService.totalPages;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.searchMode = params['mode'] || 'restaurants';
      this.currentPage = +params['page'] || 1;
      this.nearbyEnabled = params['nearby'] === 'true';
      this.maxPages = this.currentPage + 1;
    })


    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.LoggedIn = true;
      } else {
        this.LoggedIn = false;
      }
    });


    this.searchTrigger$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) =>
          a.query === b.query &&
          a.page === b.page &&
          a.radius === b.radius &&
          a.lat === b.lat &&
          a.lng === b.lng &&
          a.searchMode === b.searchMode
        )
      )
      .subscribe(({ query, page, radius, lat, lng }) => {
        if (this.searchMode === 'restaurants') {
          this.restaurantDataService.getSearch(query, lat, lng, radius, page);
        } else if (this.searchMode === 'users') {
          this.userDataService.GetSearch(query, page);
        } else {
          this.listDataService.GetSearch(query, page, 10);
        }
        this.updateQueryParams();
      });

    this.onSearchChange(false);

    if (this.nearbyEnabled) {
      this.onToggleNearby(true, false);
    }

    this.onRadiusChange(false);
    this.onPageChange();
  }

  ngOnDestroy(): void {
    this.restaurantSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
    this.searchTrigger$.complete();
  }


  onSearchChange(resetPage: boolean = true) {
    if (resetPage) {
      this.currentPage = 1;
      this.triggerSearch();
    }
  }

  onRadiusChange(resetPage: boolean = true): void {
    if (resetPage) {
      this.currentPage = 1;
      this.triggerSearch();
    }
  }

  onPageChange(): void {
    this.triggerSearch();
  }


  onToggleNearby(enabled: boolean, resetPage: boolean = true): void {

    this.nearbyEnabled = enabled;

    if (this.nearbyEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      }
    } else {
      this.lat = null;
      this.lng = null;
    }

    if (resetPage) {
      this.currentPage = 1;
      this.triggerSearch();
    }
  }

  updateQueryParams(): void {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          search: this.searchQuery,
          mode: this.searchMode,
          page: this.currentPage,
          nearby: this.nearbyEnabled
        },
        queryParamsHandling: 'merge',
      }
    );
  }


  triggerSearch() {
    this.searchTrigger$.next({
      query: this.searchQuery,
      page: this.currentPage,
      radius: this.searchRadius,
      lat: this.lat,
      lng: this.lng,
      searchMode: this.searchMode
    });
  }


  onNextPage(): void {
    this.currentPage++;
    this.onPageChange();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onPageChange();
    }
  }

  openReportModal(user: UserEntry) {
    this.selectedUser = user;
  }

}
