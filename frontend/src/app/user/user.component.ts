import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,RestaurantCardComponent,ReviewCardComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  userEntry: any;
  userSubscription = new Subscription();

  favRestaurantEntry: RestaurantEntry[];
  recentRestaurantEntry: RestaurantEntry[];

  reviewEntry : ReviewEntry[];
  reviewSubscription = new Subscription();

  username: string;
  currentPage: number = 1;
  pageSize: number = 10;

constructor(private userDataService : UserDataService, private restaurantDataService: RestaurantDataService, private reviewDataService : ReviewDataService , private route: ActivatedRoute){}

ngOnDestroy() : void{
  this.reviewSubscription.unsubscribe();
  this.userSubscription.unsubscribe();
}

ngOnInit() : void{

    this.userSubscription = this.userDataService.userSubject.subscribe(userEntry =>{
      console.log(userEntry);
      this.userEntry = userEntry;
    });

  this.reviewSubscription = this.reviewDataService.reviewSubject.subscribe(reviewEntry =>{
      this.reviewEntry = reviewEntry;
    });


  this.route.params.subscribe(params => {
        
    this.username = params['username'];

   if(this.username == null){
        console.log('empty');
        this.userDataService.GetUser();        
      }else{
        try{
          this.userDataService.GetUserById(this.username);  
          this.reviewDataService.GetReviews();
        }catch(e){
         
        }
      }

    this.favRestaurantEntry = this.restaurantDataService.restaurantEntry;
    this.recentRestaurantEntry = this.restaurantDataService.restaurantEntry;
    
  })

  this.loadReviews();

}


loadReviews(): void {
  this.reviewDataService.getUserReviews(this.username,this.currentPage,this.pageSize);
  //  .subscribe((data: any) => {
     // this.reviewEntry = data.reviews;
   // });
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
