import { Injectable } from '@angular/core';
import { RestaurantEntry } from './restaurant-entry.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestaurantDataService {

  restaurantEntry: RestaurantEntry[] = [];
  
  restaurantSubject = new Subject<RestaurantEntry[]>();

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  GetResturaunts(){
    this.http.get<{restaurants: RestaurantEntry[], totalReviews: Number}>(`${this.baseUrl}restaurants`).subscribe((jsonData) =>{
      this.restaurantEntry = jsonData.restaurants;
      this.restaurantSubject.next(this.restaurantEntry);
    })
  }

  GetResturauntsById(id:number){
    this.http.get<{restaurants: RestaurantEntry[], totalReviews: Number}>(`${this.baseUrl}restaurants/${id}`).subscribe((jsonData) =>{
          this.restaurantEntry = jsonData.restaurants;
          this.restaurantSubject.next(this.restaurantEntry);
      })
  }

}
