import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { TagDataService } from '../shared/tag-data.component';
import { TagEntry } from '../shared/tag-entry.model';
import { TagCardComponent } from "../tag-card/tag-card.component";
import { CommonModule } from '@angular/common';
import { ReviewCardComponent } from "../review-card/review-card.component";
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [TagCardComponent, CommonModule, ReviewCardComponent],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})

export class RestaurantComponent implements OnInit{
  
  restaurantEntry: RestaurantEntry
  tagEntry: TagEntry[]
  reviewEntry : ReviewEntry[]

  constructor(private restaurantDataService: RestaurantDataService,private tagDataService: TagDataService, private reviewDataService: ReviewDataService, private route: ActivatedRoute ){} 

  ngOnInit() : void{

    this.tagEntry = this.tagDataService.GetTags();
    this.reviewEntry = this.reviewDataService.GetReviews();

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
