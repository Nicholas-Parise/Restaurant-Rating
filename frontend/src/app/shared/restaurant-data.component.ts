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

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  GetResturaunts() {
    this.http.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`${this.baseUrl}restaurants`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
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


  GetFavouriteResturaunts() {
    const headers = new HttpHeaders({
  'Authorization': `Bearer ${AuthDataService.getToken()}`
});

    console.log('Token:', AuthDataService.getToken());

    this.http.get<{ favourites: RestaurantEntry[], totalFavourites: Number }>(`${this.baseUrl}users/favourites`, { headers }).subscribe((jsonData) => {
      this.favouriteEntry = jsonData.favourites;
      this.restaurantSubject.next(this.favouriteEntry);
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
