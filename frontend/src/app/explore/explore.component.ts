import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [RestaurantCardComponent, UserCardComponent, CommonModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit{

  constructor(
    private restaurantDataService: RestaurantDataService,
    private userDataService:UserDataService
  ) { }

  searchMode: 'restaurants' | 'users' = 'restaurants';
  
  restaurantEntry: any[] = [];
  restaurantSubscription = new Subscription();

  userEntry: UserEntry[] = [];
  userSubscription = new Subscription();

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
      this.restaurantDataService.GetSearchResturaunts(query, this.lat, this.lng, radius, page);
      this.userDataService.GetSearch(query,page);
    });

    this.onSearchChange();
    this.onRadiusChange();
    this.onPageChange();
  }

  ngOnDestroy(): void {
    this.restaurantSubscription.unsubscribe();
    this.combinedSearchSub.unsubscribe();
    this.searchPageSubject.unsubscribe();
  }


  onSearchChange() {
    //if (this.searchQuery.length < 2) return; // avoid flooding server    
    this.searchQuerySubject.next(this.searchQuery);
    this.currentPage = 1;
  }

  onRadiusChange(): void {
    this.searchRadiusSubject.next(this.searchRadius);
    this.currentPage = 1;
  }

   onPageChange(): void {
    this.searchPageSubject.next(this.currentPage);
  }


  onToggleNearby(): void {

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

    this.currentPage = 1;
    this.onRadiusChange();
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
