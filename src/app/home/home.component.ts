import { Component, OnInit } from '@angular/core';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RestaurantCardComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  restaurantEntry: RestaurantEntry[];
  restaurantSubscription = new Subscription();  

  constructor(private restaurantDataService: RestaurantDataService){}

  ngOnInit(): void {
    
    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry =>{
      this.restaurantEntry = restaurantEntry;
    });
    //this.restaurantDataService.GetResturaunts();  
    this.restaurantDataService.GetResturauntsFast();
  }

  ngOnDestroy() : void{
    this.restaurantSubscription.unsubscribe();
  }

}
