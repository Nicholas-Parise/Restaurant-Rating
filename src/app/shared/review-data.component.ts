import { Injectable } from '@angular/core';
import { ReviewEntry } from './review-entry.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReviewDataService {

    reviewEntry: ReviewEntry[] = [];
  
  reviewSubject = new Subject<ReviewEntry[]>();


  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  GetReviews(){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>('http://localhost:3000/reviews').subscribe((jsonData) =>{
      this.reviewEntry = jsonData.reviews;
      this.reviewSubject.next(this.reviewEntry);
    })
  }

  

  onAddReviewEntry(singleReviewEntry:ReviewEntry){

    this.http.post<{message: string}>('http://localhost:3000/add-review',singleReviewEntry).subscribe((jsonData) =>{
      this.GetReviews();
    })

    this.reviewEntry.push(singleReviewEntry);
    this.reviewSubject.next(this.reviewEntry);
  }


  getReviews(restaurantId: number, page: number, pageSize: number){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>(`${this.baseUrl}/restaurants/${restaurantId}/reviews?&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) =>{
      this.reviewEntry = jsonData.reviews;
      this.reviewSubject.next(this.reviewEntry);
    })
  }


 getUserReviews(username: string, page: number, pageSize: number){
    this.http.get<{reviews: ReviewEntry[], totalReviews: Number}>(`${this.baseUrl}/reviews?&username=${username}&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) =>{
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
