import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {

  constructor(
    private restaurantDataService: RestaurantDataService
  ) { }

  restaurantEntry: any;
  restaurantSubscription = new Subscription();

  private searchQuerySubject = new Subject<string>();
  private searchRadiusSubject = new Subject<number>();
  private combinedSearchSub = new Subscription();

  ngOnInit(): void {

    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry => {
      console.log(restaurantEntry)
      this.restaurantEntry = restaurantEntry;
    });

    this.combinedSearchSub = combineLatest([
      this.searchQuerySubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.searchRadiusSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).subscribe(([query, radius]) => {
      this.restaurantDataService.GetSearchResturaunts(query, this.lat, this.lng, radius);
    });



    this.searchQuerySubject.next(this.searchQuery);
    this.searchRadiusSubject.next(this.searchRadius);

  }

  ngOnDestroy(): void {
    this.restaurantSubscription.unsubscribe();
    this.combinedSearchSub.unsubscribe();
  }

  searchQuery = '';
  nearbyEnabled = false;
  lat: Number | null = null;
  lng: Number | null = null;
  searchRadius = 10;
  searchResults: RestaurantEntry[] = [];

  onSearchChange() {
    //if (this.searchQuery.length < 2) return; // avoid flooding server    
    this.searchQuerySubject.next(this.searchQuery);
  }

  onRadiusChange(): void {
    this.searchRadiusSubject.next(this.searchRadius);
  }

  onToggleNearby(): void {

    if (this.nearbyEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          this.onSearchChange();
        });
      }
    } else {
      this.lat = null;
      this.lng = null
    }

  }


}
