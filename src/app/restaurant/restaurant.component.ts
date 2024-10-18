import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit{
  
  restaurantEntry: RestaurantEntry

  constructor(private restaurantDataService: RestaurantDataService, private route: ActivatedRoute ){} 

  ngOnInit() : void{
    this.route.params.subscribe(params => {
        
      console.log(this.route.snapshot.params)
      const id = params['id'];
      console.log('test: ',id);

      if(id == null){
        console.log('empty');
        this.restaurantEntry = this.restaurantDataService.GetResturaunts()[0];
      }else{
        try{
          this.restaurantEntry = this.restaurantDataService.GetResturauntsById(id);
        }catch(e){
          this.restaurantEntry = this.restaurantDataService.GetResturaunts()[0];
        }
      }
        //this.restaurantDataService.GetResturauntsById(this.id).subscribe( restaurantEntry => {
        //this.restaurantEntry = restaurantEntry
        //}
        
    })
  }
  


}
