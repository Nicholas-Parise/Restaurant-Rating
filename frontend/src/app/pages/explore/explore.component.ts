import { inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { Subscription, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthDataService } from '../../_shared/auth-data.component';

import { RestaurantEntry } from '../../_shared/restaurant-entry.model';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantCardComponent } from "../../restaurant-card/restaurant-card.component";

import { UserEntry } from '../../_shared/user-entry.model';
import { UserDataService } from '../../_shared/user-data.component';
import { UserCardComponent } from '../../user-card/user-card.component';

import { ListEntry } from '../../_shared/list-entry.model';
import { ListDataService } from '../../_shared/list-data.component';
import { ListCardComponent } from '../../list-card/list-card.component';
import { isPlatformBrowser } from '@angular/common';

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

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  searchMode: 'restaurants' | 'users' | 'lists' = 'restaurants';

  restaurantEntry: RestaurantEntry[] = [];
  restaurantSubscription = new Subscription();

  userEntry: UserEntry[] = [];
  userSubscription = new Subscription();

  listEntry: ListEntry[] = [];
  listSubscription = new Subscription();

  private searchDebounce?: any;

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

    if (this.nearbyEnabled) {
      this.onToggleNearby(true, false);
    }

    this.performSearch();

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.LoggedIn = true;
      } else {
        this.LoggedIn = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.restaurantSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.listSubscription.unsubscribe();
  }

  performSearch() {
    if (this.searchMode === 'restaurants') {
      this.restaurantDataService.getSearch(
        this.searchQuery,
        this.lat,
        this.lng,
        this.searchRadius,
        this.currentPage,
        12
      );
    } else if (this.searchMode === 'users') {
      this.userDataService.GetSearch(
        this.searchQuery,
        this.currentPage,
        12
      );
    } else {
      this.listDataService.GetSearch(
        this.searchQuery,
        this.currentPage,
        12
      );
    }
    this.updateQueryParams();
  }


  onSearchChange(resetPage: boolean = true) {
    if (resetPage) {
      this.currentPage = 1;
    }

    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(() => {
      this.performSearch();
    }, 300);
  }


  onRadiusChange(resetPage: boolean = true): void {
    if (resetPage) {
      this.currentPage = 1;
      this.performSearch();
    }
  }


  onToggleNearby(enabled: boolean, resetPage: boolean = true): void {

    this.nearbyEnabled = enabled;

    if (this.nearbyEnabled && this.isBrowser) {
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
      this.performSearch();
    }
  }

  updateQueryParams(): void {
    this.router.navigate([], {
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

  onNextPage(): void {
    this.currentPage++;
    this.onSearchChange(false); 
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onSearchChange(false); 
    }
  }

  openReportModal(user: UserEntry) {
    this.selectedUser = user;
  }

}
