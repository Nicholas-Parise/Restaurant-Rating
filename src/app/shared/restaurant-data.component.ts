import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';

@Injectable({
  providedIn: 'root'
})

export class RestaurantDataService {

    restaurantEntry: RestaurantEntry[] = [
    new RestaurantEntry(0, 'Video Editor Interface', 'description', 'April 20 2024',['../../assets/Editor/VideoEditor.png','../../assets/Editor/HomePage.png']),
    new RestaurantEntry(1, 'Traffic Simulator',  'description', 'April 18 2024', ['../../assets/traffic.png','picture2'])   
  ];
  

  constructor() { }

  GetResturaunts() : RestaurantEntry[]{
    return this.restaurantEntry;
  }

  GetProjectById(id:number) : RestaurantEntry{
    let rest = this.restaurantEntry.find(restaurantEntry => restaurantEntry.id == id);
    
    if(rest === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return rest;
  }

}
