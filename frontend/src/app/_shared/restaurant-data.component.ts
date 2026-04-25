import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';
import { Subject } from 'rxjs';

import { ToastService } from './toast.service';
import { ApiService } from './api.service';
import { ReviewEntry } from './review-entry.model';


@Injectable({
  providedIn: 'root'
})

export class RestaurantDataService {

  restaurantEntry: RestaurantEntry[] = [];
  restaurantSubject = new Subject<RestaurantEntry[]>();

  reviewsEntry: ReviewEntry[] = [];

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

  constructor(private api: ApiService,private toast: ToastService) {}

  get() {
    this.api.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`restaurants`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }


  getSearch(searchQuery: string, lat: Number | null, lng: Number | null, radius: Number | null, page: Number | null) {

    let args = `?q=${searchQuery}&page=${page}`;
    if (lat) {
      args = `?q=${searchQuery}&lat=${lat}&lng=${lng}&rad=${radius}&page=${page}`
    }

    this.api.get<{ restaurants: RestaurantEntry[], totalRestaurants: number, pageSize: number }>(`restaurants/search${args}`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.totalRestaurants = jsonData.totalRestaurants;
      this.totalPages = Math.ceil(this.totalRestaurants / jsonData.pageSize);
      //console.log(this.totalRestaurants, this.totalPages);
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  getFast() {
    this.api.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`restaurants?amount=0`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }


  getHot(){
   this.api.get<{ restaurants: RestaurantEntry[], totalRestaurants: Number }>(`restaurants/popular`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }


  getById(id: number) {
    this.api.get<{ restaurants: RestaurantEntry[], reviews: ReviewEntry[] }>(`restaurants/${id}`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.reviewsEntry = jsonData.reviews;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  GetRecentResturaunts(username:string) {

    this.api.get<{ recents: RestaurantEntry[], totalRecents: number }>(`users/recent?username=${username}`).subscribe((jsonData) => {
      this.recentEntry = jsonData.recents;
      this.recentSubject.next(this.recentEntry);
    })
  }


  GetFavouriteResturaunts(username:string) {

    this.api.get<{ favourites: RestaurantEntry[], totalFavourites: number }>(`favourites/${username}`).subscribe((jsonData) => {
      this.favouriteEntry = jsonData.favourites;
      this.favouriteSubject.next(this.favouriteEntry);
    })
  }


  addFavourite(restaurantId: number) {
    this.api.post<{ message: string }>(`favourites/${restaurantId}`, null).subscribe((jsonData) => {
      //this.restaurantEntry = jsonData.restaurants;
      //this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  removeFavourite(restaurantId: number) {
    this.api.delete<{ message: string }>(`favourites/${restaurantId}`).subscribe((jsonData) => {
      //console.log(this.favouriteEntry);
      this.favouriteEntry = this.favouriteEntry.filter(res => res.id !== restaurantId);
      this.favouriteSubject.next(this.favouriteEntry);
    })
  }


  GetBookmarkResturaunts(restaurantId: number|null) {
    this.api.get<{ bookmarked: RestaurantEntry[], totalBookmarked: number }>(`bookmarks?restaurant=${restaurantId}`).subscribe((jsonData) => {
      this.bookmarkEntry = jsonData.bookmarked;
      this.totalBookmarks = jsonData.totalBookmarked;
      this.bookmarkSubject.next(this.bookmarkEntry);
    })
  }


    GetBookmark(username: string, page: Number) {
    this.api.get<{ bookmarked: RestaurantEntry[], totalBookmarked: number }>(`bookmarks/${username}?page=${page}`).subscribe((jsonData) => {
      this.bookmarkEntry = jsonData.bookmarked;
      this.totalBookmarks = jsonData.totalBookmarked;
      this.bookmarkSubject.next(this.bookmarkEntry);
    })
  }


  addBookmark(restaurantId: number) {
    this.api.post<{ message: string }>(`bookmarks/${restaurantId}`, null).subscribe((jsonData) => {
      //this.restaurantEntry = jsonData.restaurants;
      //this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  removeBookmark(restaurantId: number) {
    this.api.delete<{ message: string }>(`bookmarks/${restaurantId}`).subscribe((jsonData) => {
     this.bookmarkEntry = this.bookmarkEntry.filter(res => res.id !== restaurantId);
      this.bookmarkSubject.next(this.bookmarkEntry);
    })
  }


}
