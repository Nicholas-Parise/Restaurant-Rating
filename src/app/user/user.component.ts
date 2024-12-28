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

  userEntry: UserEntry;
  favRestaurantEntry: RestaurantEntry[];
  recentRestaurantEntry: RestaurantEntry[];

  reviewEntry : ReviewEntry[]
  reviewSubscription = new Subscription();

  username: string;
  currentPage: number = 1;
  pageSize: number = 10;

constructor(private userDataService : UserDataService, private restaurantDataService: RestaurantDataService, private reviewDataService : ReviewDataService , private route: ActivatedRoute){}

ngOnInit() : void{

  this.route.params.subscribe(params => {
        
    console.log(this.route.snapshot.params)
    this.username = params['username'];
    console.log('test: '+this.username);


    this.reviewDataService.GetReviews();
    this.reviewSubscription = this.reviewDataService.reviewSubject.subscribe(reviewEntry =>{
      this.reviewEntry = reviewEntry;
    });



    this.favRestaurantEntry = this.restaurantDataService.restaurantEntry;
    this.recentRestaurantEntry = this.restaurantDataService.restaurantEntry;

    if(this.username == null){
      console.log('empty');
      this.userEntry = this.userDataService.GetUserById('admin');
    }else{
      try{
        this.userEntry = this.userDataService.GetUserById(this.username);
        
      }catch(e){
        this.userEntry = this.userDataService.GetUserById('admin');
      }
    }
      //this.restaurantDataService.GetResturauntsById(this.id).subscribe( restaurantEntry => {
      //this.restaurantEntry = restaurantEntry
      //}
    
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
