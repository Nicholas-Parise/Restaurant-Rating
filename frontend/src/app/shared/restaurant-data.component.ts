import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';

@Injectable({
  providedIn: 'root'
})

export class RestaurantDataService {

  restaurantEntry: RestaurantEntry[] = [];

  favouriteEntry: RestaurantEntry[] = [];

  recentEntry: RestaurantEntry[] = [];

  restaurantSubject = new Subject<RestaurantEntry[]>();

  favouriteSubject = new Subject<RestaurantEntry[]>();
  recentSubject = new Subject<RestaurantEntry[]>();

  totalReviews = 0;
  totalRestaurants = 0;
  totalPages = 0;

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  GetResturaunts() {
    this.http.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`${this.baseUrl}restaurants`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }


  GetSearchResturaunts(searchQuery: string, lat: Number|null, lng: Number|null, radius: Number|null, page: Number|null) {

    let args = `?q=${searchQuery}&page=${page}`;
    if(lat){
      args = `?q=${searchQuery}&lat=${lat}&lng=${lng}&rad=${radius}&page=${page}`
    }

    this.http.get<{ restaurants: RestaurantEntry[], totalRestaurants: number, pageSize: number}>(`${this.baseUrl}restaurants/search${args}`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.totalRestaurants = jsonData.totalRestaurants;
      this.totalPages = Math.ceil(this.totalRestaurants / jsonData.pageSize);
      console.log(this.totalRestaurants, this.totalPages);
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  GetResturauntsFast() {
    this.http.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`${this.baseUrl}restaurants?amount=0`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }


  GetResturauntsById(id: number) {
    this.http.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`${this.baseUrl}restaurants/${id}`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  GetRecentResturaunts() {
    const headers = new HttpHeaders({
  'Authorization': `Bearer ${AuthDataService.getToken()}`
});

    console.log('Token:', AuthDataService.getToken());

    this.http.get<{ recents: RestaurantEntry[], totalRecents: Number }>(`${this.baseUrl}users/recent`, { headers }).subscribe((jsonData) => {
      this.recentEntry = jsonData.recents;
      this.recentSubject.next(this.recentEntry);
    })
  }


  GetFavouriteResturaunts() {
    const headers = new HttpHeaders({
  'Authorization': `Bearer ${AuthDataService.getToken()}`
});

    console.log('Token:', AuthDataService.getToken());

    this.http.get<{ favourites: RestaurantEntry[], totalFavourites: Number }>(`${this.baseUrl}users/favourites`, { headers }).subscribe((jsonData) => {
      this.favouriteEntry = jsonData.favourites;
      this.favouriteSubject.next(this.favouriteEntry);
    })
  }


  addFavourite(restaurantId: number) {
    const headers = new HttpHeaders({
  'Authorization': `Bearer ${AuthDataService.getToken()}`
});

    console.log('Token:', AuthDataService.getToken());

    this.http.post<{ message: string }>(`${this.baseUrl}users/favourites/${restaurantId}`, {}, { headers }).subscribe((jsonData) => {
      //this.restaurantEntry = jsonData.restaurants;
      //this.restaurantSubject.next(this.restaurantEntry);
    })
  }
}
