import { Component, OnInit } from '@angular/core';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RestaurantCardComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  restaurantEntry: RestaurantEntry[];

constructor(private restaurantDataService: RestaurantDataService){}

  ngOnInit(): void {
    this.restaurantEntry = this.restaurantDataService.GetResturaunts();
  }

}
