import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewEntry } from '../shared/review-entry.model';
import { StarsComponent } from '../stars/stars.component';


@Component({
    selector: '[app-diary-card]',
    imports: [CommonModule, RouterLink, StarsComponent],
    templateUrl: './diary-card.component.html',
    styleUrl: './diary-card.component.css',
    standalone: true
})
export class DiaryCardComponent {

@Input() review: ReviewEntry;

  expanded: Boolean = false;
  
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;

    console.log('test');

    switch(this.review.type){
      case "ice_cream":
        target.src = 'assets/placeholder-icecream.jpg';
        break;
      case "pub":
      case "biergarten":
      case "bar":
        target.src = 'assets/placeholder-bar.avif';
        break;
      case "cafe":
        target.src = 'assets/placeholder-coffeshop.avif';  
        break;
      case "food_court":
        target.src = 'assets/placeholder-food-court.png'; 
        break;
      case "fast_food":
        target.src = 'assets/placeholder-fast-food.png';
        break;
      case "restaurant":
      default:
        target.src = 'assets/placeholder-restaurant.png';
        break;
      }   
  }




}
