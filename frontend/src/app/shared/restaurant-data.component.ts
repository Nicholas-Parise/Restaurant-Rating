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
  restaurantSubject = new Subject<RestaurantEntry[]>();

  favouriteEntry: RestaurantEntry[] = [];
  favouriteSubject = new Subject<RestaurantEntry[]>();

  recentEntry: RestaurantEntry[] = [];
  recentSubject = new Subject<RestaurantEntry[]>();

  bookmarkEntry: RestaurantEntry[] = [];
  bookmarkSubject = new Subject<RestaurantEntry[]>();
  totalBookmarks: number;

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


  GetSearchResturaunts(searchQuery: string, lat: Number | null, lng: Number | null, radius: Number | null, page: Number | null) {

    let args = `?q=${searchQuery}&page=${page}`;
    if (lat) {
      args = `?q=${searchQuery}&lat=${lat}&lng=${lng}&rad=${radius}&page=${page}`
    }

    this.http.get<{ restaurants: RestaurantEntry[], totalRestaurants: number, pageSize: number }>(`${this.baseUrl}restaurants/search${args}`).subscribe((jsonData) => {
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

  GetRecentResturaunts(username:string) {
    /*const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });
*/
    this.http.get<{ recents: RestaurantEntry[], totalRecents: number }>(`${this.baseUrl}users/recent?username=${username}`).subscribe((jsonData) => {
      this.recentEntry = jsonData.recents;
      this.recentSubject.next(this.recentEntry);
    })
  }


  GetFavouriteResturaunts(username:string) {
/*
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });
*/

    this.http.get<{ favourites: RestaurantEntry[], totalFavourites: number }>(`${this.baseUrl}users/favourites?username=${username}`).subscribe((jsonData) => {
      this.favouriteEntry = jsonData.favourites;
      this.favouriteSubject.next(this.favouriteEntry);
    })
  }


  addFavourite(restaurantId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });

    //console.log('Token:', AuthDataService.getToken());

    this.http.post<{ message: string }>(`${this.baseUrl}users/favourites/${restaurantId}`, {}, { headers }).subscribe((jsonData) => {
      //this.restaurantEntry = jsonData.restaurants;
      //this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  removeFavourite(restaurantId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });

    //console.log('Token:', AuthDataService.getToken());

    this.http.delete<{ message: string }>(`${this.baseUrl}users/favourites/${restaurantId}`, { headers }).subscribe((jsonData) => {
    })
  }


  GetBookmarkResturaunts(restaurantId: number|null) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });

    //console.log('Token:', AuthDataService.getToken());

    this.http.get<{ bookmarked: RestaurantEntry[], totalBookmarked: number }>(`${this.baseUrl}users/bookmarks?restaurant=${restaurantId}`, { headers }).subscribe((jsonData) => {
      this.bookmarkEntry = jsonData.bookmarked;
      this.totalBookmarks = jsonData.totalBookmarked;
      this.bookmarkSubject.next(this.bookmarkEntry);
    })
  }


  addBookmark(restaurantId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });

    //console.log('Token:', AuthDataService.getToken());

    this.http.post<{ message: string }>(`${this.baseUrl}users/bookmarks/${restaurantId}`, {}, { headers }).subscribe((jsonData) => {
      //this.restaurantEntry = jsonData.restaurants;
      //this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  removeBookmark(restaurantId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${AuthDataService.getToken()}`
    });

    console.log('Token:', AuthDataService.getToken());

    this.http.delete<{ message: string }>(`${this.baseUrl}users/bookmarks/${restaurantId}`, { headers }).subscribe((jsonData) => {
    })
  }


}
