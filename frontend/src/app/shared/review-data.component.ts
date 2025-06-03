import { Injectable } from '@angular/core';
import { ReviewEntry } from './review-entry.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';


@Injectable({
  providedIn: 'root'
})

export class ReviewDataService {

  reviewEntry: ReviewEntry[] = [];
  
  reviewSubject = new Subject<ReviewEntry[]>();

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  GetReviews(){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>(`${this.baseUrl}reviews`).subscribe((jsonData) =>{
      this.reviewEntry = jsonData.reviews;
      this.reviewSubject.next(this.reviewEntry);
    })
  }


  onAddReviewEntry(singleReviewEntry:ReviewEntry){

  //localStorage.setItem('authToken', token);

    const headers = new HttpHeaders().set('Authorization',  `Bearer ${AuthDataService.getToken()}`);
    
    this.http.post<{message: string}>(`${this.baseUrl}reviews`,singleReviewEntry,{ headers } ).subscribe((jsonData) =>{
      this.getRestauranReviews(singleReviewEntry.restaurant_id,0,10);
    })

    this.reviewEntry.push(singleReviewEntry);
    this.reviewSubject.next(this.reviewEntry);
  }


  getRestauranReviews(restaurantId: number, page: number, pageSize: number){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>(`${this.baseUrl}reviews/restaurants/${restaurantId}?&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) =>{
      this.reviewEntry = jsonData.reviews;
      this.reviewSubject.next(this.reviewEntry);
    })
  }


 getUserReviews(username: string, page: number, pageSize: number){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>(`${this.baseUrl}reviews?&username=${username}&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) =>{
      this.reviewEntry = jsonData.reviews;
      this.reviewSubject.next(this.reviewEntry);
    })  
  }




  GetReviewById(id:number) : ReviewEntry{
    let temp = this.reviewEntry.find(reviewEntry => reviewEntry.id == id);
    
    if(temp === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return temp;
  }

}
