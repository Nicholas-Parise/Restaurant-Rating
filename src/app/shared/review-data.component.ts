import { Injectable } from '@angular/core';
import { ReviewEntry } from './review-entry.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReviewDataService {

    reviewEntry: ReviewEntry[] = [
    new ReviewEntry(0, 'This place is horrible',false,true,1,'treasureHound'),
    new ReviewEntry(1, 'Love ths PLACE!!!!', true, true,10,'admin'),
    new ReviewEntry(2, 'eh its mid', false, true,5,'nickpar03'),
    new ReviewEntry(3, 'been going here since I was a kid and its still bad', false, true, 3,'jesus')
  ];
  
//private http: HttpClient
  constructor() { }

  private baseUrl = 'https://your-api-url.com/api/reviews';

  GetReviews() : ReviewEntry[]{
    return this.reviewEntry;
  }

  getRestaurantReviews(restaurantId:number, currentPage:number, pageSize:number) : ReviewEntry[]{

    return this.reviewEntry;

  }

  getUserReviews(username:string, currentPage:number, pageSize:number) : ReviewEntry[]{

    return this.reviewEntry;

  }


/*
  getReviews(restaurantId: number, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}?restaurantId=${restaurantId}&page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

 getUserReviews(username: string, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/user-reviews?username=${username}&page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

*/


  GetReviewById(id:number) : ReviewEntry{
    let temp = this.reviewEntry.find(reviewEntry => reviewEntry.id == id);
    
    if(temp === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return temp;
  }

}
