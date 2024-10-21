import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';

@Injectable({
  providedIn: 'root'
})

export class RestaurantDataService {

    restaurantEntry: RestaurantEntry[] = [
    new RestaurantEntry(0, 'Nonnas kitchen', 'description', 'April 20 2024',['assets/placeholder-restaurant.png','picture2']),
    new RestaurantEntry(1, 'mcdonalds',  'description', 'April 18 2024', ['assets/placeholder-restaurant.png','picture2'])   
  ];
  

  constructor() { }

  GetResturaunts() : RestaurantEntry[]{
    return this.restaurantEntry;
  }

  GetResturauntsById(id:number) : RestaurantEntry{
    let rest = this.restaurantEntry.find(restaurantEntry => restaurantEntry.id == id);
    
    if(rest === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return rest;
  }

}
