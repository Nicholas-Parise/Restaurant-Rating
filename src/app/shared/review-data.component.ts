import { Injectable } from '@angular/core';
import { ReviewEntry } from './review-entry.model';

@Injectable({
  providedIn: 'root'
})

export class ReviewDataService {

    reviewEntry: ReviewEntry[] = [
    new ReviewEntry(0, 'This place is horrible',false,true,1),
    new ReviewEntry(1, 'Love ths PLACE!!!!', true, true,10),
    new ReviewEntry(2, 'eh its mid', false, true,5),
    new ReviewEntry(3, 'been going here since I was a kid and its still bad', false, true, 3)
  ];
  

  constructor() { }

  GetReviews() : ReviewEntry[]{
    return this.reviewEntry;
  }

  GetReviewById(id:number) : ReviewEntry{
    let temp = this.reviewEntry.find(reviewEntry => reviewEntry.id == id);
    
    if(temp === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return temp;
  }

}
