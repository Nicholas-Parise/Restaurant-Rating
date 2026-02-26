import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { Subscription, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthDataService } from '../shared/auth-data.component';

import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";

import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { UserCardComponent } from '../user-card/user-card.component';

import { ListEntry } from '../shared/list-entry.model';
import { ListDataService } from '../shared/list-data.component';
import { ListCardComponent } from '../list-card/list-card.component';

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
    private listDataService:ListDataService
  ) { }

  searchMode: 'restaurants' | 'users' | 'lists' = 'restaurants';

  restaurantEntry: RestaurantEntry[] = [];
  restaurantSubscription = new Subscription();

  userEntry: UserEntry[] = [];
  userSubscription = new Subscription();

  listEntry: ListEntry[] = [];
  listSubscription = new Subscription();

  private searchQuerySubject = new Subject<string>();
  private searchRadiusSubject = new Subject<number>();
  private searchPageSubject = new Subject<number>();
  private combinedSearchSub = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;
  searchQuery = '';
  nearbyEnabled = false;
  lat: Number | null = null;
  lng: Number | null = null;
  searchRadius = 10;

  LoggedIn:boolean;

  ngOnInit(): void {

    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry => {
      //console.log(restaurantEntry)
      this.restaurantEntry = restaurantEntry;
      this.maxPages = this.restaurantDataService.totalPages;
      console.log(this.maxPages);
    });


    this.userSubscription = this.userDataService.userSubject.subscribe(userEntry => {
      //console.log(restaurantEntry)
      this.userEntry = userEntry;
      this.maxPages = this.userDataService.totalPages;
      console.log(this.maxPages);
    });

    this.listSubscription = this.listDataService.listSubject.subscribe(listEntry => {
      this.listEntry = listEntry;
      this.maxPages = this.listDataService.totalPages;
    });


    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.LoggedIn = true;
      } else {
        this.LoggedIn = false;
      }
    });


    this.combinedSearchSub = combineLatest([
      this.searchQuerySubject.pipe(
        debounceTime(300)
        // ,distinctUntilChanged()
      ),
      this.searchRadiusSubject.pipe(
        debounceTime(300)
        // ,distinctUntilChanged()
      ),
      this.searchPageSubject.pipe(
        debounceTime(300)
        // ,distinctUntilChanged()
      )
    ]).subscribe(([query, radius, page]) => {
      
      if(this.searchMode == 'restaurants'){
        this.restaurantDataService.GetSearch(query, this.lat, this.lng, radius, page);
      }else if(this.searchMode == 'users'){
        this.userDataService.GetSearch(query, page);
      }else{
        this.listDataService.GetSearch(query, page, 10);
      }

      this.updateQueryParams();
    });

    this.activatedRoute.queryParams.subscribe(params => {

      this.searchQuery = params['search'] || '';
      this.searchMode = params['mode'] || 'restaurants';
      this.currentPage = +params['page'] || 1;
      this.nearbyEnabled = params['nearby'] === 'true';
      this.maxPages = this.currentPage +1;
    })


      this.onSearchChange(false);

      if(this.nearbyEnabled){
        this.onToggleNearby(true,false);
      }

      this.onRadiusChange(false);
      this.onPageChange();
  }

  ngOnDestroy(): void {
    this.restaurantSubscription.unsubscribe();
    this.combinedSearchSub.unsubscribe();
    this.searchPageSubject.unsubscribe();
  }


  onSearchChange(resetPage: boolean = true) {
    //if (this.searchQuery.length < 2) return;
    this.searchQuerySubject.next(this.searchQuery);
    if (resetPage) {
      this.currentPage = 1;
      this.onPageChange();
    }
  }

  onRadiusChange(resetPage: boolean = true): void {
    this.searchRadiusSubject.next(this.searchRadius);
    if (resetPage) {
      this.currentPage = 1;
      this.onPageChange();
    }
  }

  onPageChange(): void {
    this.searchPageSubject.next(this.currentPage);
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
      this.lng = null
    }

    if(resetPage){
      this.currentPage = 1;
      this.onRadiusChange();
    }
  }

  updateQueryParams(): void{
    this.router.navigate(
        [], 
        {
          relativeTo: this.activatedRoute,
          queryParams: { search: this.searchQuery, 
            mode: this.searchMode,
             page: this.currentPage,
            nearby: this.nearbyEnabled }, 
          queryParamsHandling: 'merge',
        }
      );
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



}
