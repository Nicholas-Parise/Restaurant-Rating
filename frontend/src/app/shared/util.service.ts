import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
 
  constructor() { }


  getPlaceholderImage(type: string): string{
      switch(type){
      case "ice_cream":
        return 'assets/placeholder-icecream.jpg';
      case "pub":
      case "biergarten":
      case "bar":
        return 'assets/placeholder-bar.avif';
      case "cafe":
        return 'assets/placeholder-coffeshop.avif';  
      case "food_court":
        return 'assets/placeholder-food-court.png'; 
      case "fast_food":
        return 'assets/placeholder-fast-food.jpg';
      case "restaurant":
      default:
        return 'assets/placeholder-restaurant.png';
      }  
  }
}
