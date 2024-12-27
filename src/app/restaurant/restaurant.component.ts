import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ReviewFormComponent } from '../review-form/review-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [TagCardComponent, CommonModule, ReviewCardComponent, ReviewFormComponent],
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})

export class RestaurantComponent implements OnInit{
  
  @ViewChild(ReviewFormComponent) reviewFormComponent: ReviewFormComponent;

  restaurantEntry: RestaurantEntry
  restaurantSubscription = new Subscription();  
  
  tagEntry: TagEntry[]
  tagSubscription = new Subscription();
  
  reviewEntry : ReviewEntry[]
  reviewSubscription = new Subscription();

  restaurantId: number;
  currentPage: number = 1;
  pageSize: number = 10;


  constructor(private restaurantDataService: RestaurantDataService,private tagDataService: TagDataService, private reviewDataService: ReviewDataService, private route: ActivatedRoute ){} 


  ngOnDestroy() : void{
    this.reviewSubscription.unsubscribe();
    this.tagSubscription.unsubscribe();
  }

  ngOnInit() : void{

    this.reviewDataService.GetReviews();
    this.reviewSubscription = this.reviewDataService.reviewSubject.subscribe(reviewEntry =>{
      this.reviewEntry = reviewEntry;
    });



    this.tagSubscription = this.tagDataService.tagSubject.subscribe(tagEntry =>{
      this.tagEntry = tagEntry;
    });
    this.tagEntry = this.tagDataService.GetTags();


    this.route.params.subscribe(params => {
        
      console.log(this.route.snapshot.params)
      this.restaurantId = params['id'];
      console.log('test: ',this.restaurantId);

      if(this.restaurantId == null){
        console.log('empty');
        this.restaurantEntry = this.restaurantDataService.GetResturaunts()[0];
      }else{
        try{
          this.restaurantEntry = this.restaurantDataService.GetResturauntsById(this.restaurantId);
          
        }catch(e){
          this.restaurantEntry = this.restaurantDataService.GetResturaunts()[0];
        }
      }
        //this.restaurantDataService.GetResturauntsById(this.id).subscribe( restaurantEntry => {
        //this.restaurantEntry = restaurantEntry
        //}
        
    })
  }


  showReviewForm(): void {
    this.reviewFormComponent.showForm();
  }


  loadReviews(): void {
    this.reviewDataService.getReviews(this.restaurantId, this.currentPage, this.pageSize);
  }



  onNextPage(): void {
    this.currentPage++;
    this.loadReviews();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReviews();
    }
  }

  


}
