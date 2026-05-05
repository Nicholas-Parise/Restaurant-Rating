import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';
import { Subject } from 'rxjs';

import { ToastService } from './toast.service';
import { ApiService } from './api.service';
import { ReviewEntry } from './review-entry.model';
import { TagEntry } from './tag-entry.model';


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

  tagSubject = new Subject<TagEntry[]>();
  tagEntry: TagEntry[];

  totalReviews = 0;
  totalRestaurants = 0;
  totalPages = 0;

  constructor(private api: ApiService, private toast: ToastService) { }

  private searchCache = new Map<string, {
    restaurants: RestaurantEntry[],
    totalRestaurants: number,
    pageSize: number,
    timestamp: number
  }>();

  private buildSearchKey(
    searchQuery: string,
    lat: number | null,
    lng: number | null,
    radius: number | null,
    selectedTagSlugs: string[],
    page: number | null,
    pageSize: number
  ): string {

    return JSON.stringify({
      searchQuery,
      lat: lat ? Number(lat.toFixed(3)) : null,
      lng: lng ? Number(lng.toFixed(3)) : null,
      radius,
      tags: [...selectedTagSlugs].sort(),
      page,
      pageSize
    });
  }




  get() {
    this.api.get<{ restaurants: RestaurantEntry[], totalReviews: Number }>(`restaurants`).subscribe((jsonData) => {
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  getTags() {
    this.api.get<{ categories: TagEntry[] }>(`categories`).subscribe((jsonData) => {
      this.tagEntry = jsonData.categories;
      this.tagSubject.next(this.tagEntry);
    })
  }


  getSearch(searchQuery: string, lat: number | null, lng: number | null, radius: number | null, selectedTagSlugs: string[] = [], page: number | null, pageSize: number = 12) {

    const cacheKey = this.buildSearchKey(
      searchQuery,
      lat,
      lng,
      radius,
      selectedTagSlugs,
      page,
      pageSize
    );


    const cached = this.searchCache.get(cacheKey);

    if (cached) {
      console.log("cache");
      this.restaurantEntry = cached.restaurants;
      this.totalRestaurants = cached.totalRestaurants;
      this.totalPages = Math.ceil(cached.totalRestaurants / cached.pageSize);
      this.restaurantSubject.next(this.restaurantEntry);
      return;
    }

    const params = new URLSearchParams();

    params.set('q', searchQuery);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (lat != null && lng != null) {
      params.set('lat', String(lat));
      params.set('lng', String(lng));
      params.set('rad', String(radius));
    }

    for (const slug of selectedTagSlugs) {
      params.append('tags', slug);
    }

    this.api.get<{ restaurants: RestaurantEntry[], totalRestaurants: number, pageSize: number }>(`restaurants/search?${params.toString()}`).subscribe((jsonData) => {

      this.searchCache.set(cacheKey, {
        ...jsonData,
        timestamp: Date.now()
      });

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


  getHot() {
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

  GetRecentResturaunts(username: string) {

    this.api.get<{ recents: RestaurantEntry[], totalRecents: number }>(`users/recent?username=${username}`).subscribe((jsonData) => {
      this.recentEntry = jsonData.recents;
      this.recentSubject.next(this.recentEntry);
    })
  }


  GetFavouriteResturaunts(username: string) {

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


  GetBookmarkResturaunts(restaurantId: number | null) {
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
