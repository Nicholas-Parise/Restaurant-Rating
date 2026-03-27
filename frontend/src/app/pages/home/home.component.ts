import { Component, OnInit } from '@angular/core';
import { RestaurantEntry } from '../../shared/restaurant-entry.model';
import { RestaurantDataService } from '../../shared/restaurant-data.component';
import { RestaurantCardComponent } from "../../restaurant-card/restaurant-card.component";

import { ListEntry } from '../../shared/list-entry.model';
import { ListDataService } from '../../shared/list-data.component';
import { ListCardComponent } from '../../list-card/list-card.component';

import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    imports: [RestaurantCardComponent, ListCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    standalone: true
})
export class HomeComponent implements OnInit{

  restaurantEntry: RestaurantEntry[];
  restaurantSubscription = new Subscription();  
  
  listEntry: ListEntry[];
  listSubscription = new Subscription();

  constructor(private restaurantDataService: RestaurantDataService, private listDataService:ListDataService){}

  ngOnInit(): void {
    
    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry =>{
      this.restaurantEntry = restaurantEntry;
    });

    this.listSubscription = this.listDataService.listSubject.subscribe(listEntry =>{
      this.listEntry = listEntry;
    });


    this.restaurantDataService.GetHotResturaunts();
    this.listDataService.getRecommended();
  }

  ngOnDestroy() : void{
    this.restaurantSubscription.unsubscribe();
  }

}
