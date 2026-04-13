import { Injectable } from '@angular/core';
import { ReviewEntry } from './review-entry.model';
import { Subject } from 'rxjs';

import { ToastService } from '../shared/toast.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class ReviewDataService {

  reviewSubject = new Subject<ReviewEntry[]>();
  reviewEntry: ReviewEntry[] = [];
  totalReviews = 0;
  totalPages = 0;

  userReviewSubject = new Subject<ReviewEntry[]>();
  userReviewEntry: ReviewEntry[] = [];
  totalUserReviews = 0;
  totalUserPages = 0;

  constructor(private api: ApiService,private toast: ToastService) {}

  // get authenticated user reviews
  GetReviews(page: number, pageSize: number) {

    this.api.get<{ reviews: ReviewEntry[], totalReviews: number }>(`reviews/?page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.userReviewEntry = jsonData.reviews;
      this.totalUserReviews = jsonData.totalReviews;
      this.totalUserPages = Math.ceil(this.totalUserReviews / pageSize);
      this.userReviewSubject.next(this.userReviewEntry);
    })
  }


  onAddReviewEntry(singleReviewEntry: ReviewEntry) {

    this.api.post<{ message: string }>(`reviews`, singleReviewEntry).subscribe((jsonData) => {
      this.getRestauranReviews(singleReviewEntry.restaurant_id, 0, 10);
    })

    this.reviewEntry.push(singleReviewEntry);
    this.reviewSubject.next(this.reviewEntry);
  }


  getRestauranReviews(restaurantId: number, page: number, pageSize: number) {
    this.api.get<{ reviews: ReviewEntry[], totalReviews: number }>(`reviews/restaurants/${restaurantId}?page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.reviewEntry = jsonData.reviews;
      this.totalReviews = jsonData.totalReviews;
      this.totalPages = Math.ceil(this.totalReviews / pageSize);
      this.reviewSubject.next(this.reviewEntry);
    })
  }


  getUserReviews(username: string, page: number, pageSize: number) {
    this.api.get<{ reviews: ReviewEntry[], totalReviews: number }>(`reviews/${username}?page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.userReviewEntry = jsonData.reviews;
      this.totalUserReviews = jsonData.totalReviews;
      this.totalUserPages = Math.ceil(this.totalUserReviews / pageSize);
      this.userReviewSubject.next(this.userReviewEntry);
    })
  }

  // get the reviews from a user for a rest
  getRestaurantUserReviews(restaurantId: number, username: string, page: number, pageSize: number) {
    this.api.get<{ reviews: ReviewEntry[], totalReviews: number }>(`reviews/${username}?restaurant=${restaurantId}&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.userReviewEntry = jsonData.reviews;
      this.totalUserReviews = jsonData.totalReviews;
      this.totalUserPages = Math.ceil(this.totalUserReviews / pageSize);
      this.userReviewSubject.next(this.userReviewEntry);
    })
  }


  GetReviewById(id: number): ReviewEntry {
    let temp = this.reviewEntry.find(reviewEntry => reviewEntry.id == id);

    if (temp === undefined) {
      throw new TypeError('index Does not exist');
    }

    return temp;
  }

}
