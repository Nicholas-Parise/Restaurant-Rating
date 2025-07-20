import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthDataService } from '../shared/auth-data.component';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserDataService } from '../shared/user-data.component';
import { UserEntry } from '../shared/user-entry.model';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit {

  constructor(private userDataService: UserDataService,
    private authDataService: AuthDataService) { }

  userEntry: any;
  userSubscription = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  ngOnInit(): void {

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        // this.reviewDataService.getRestaurantUserReviews(this.restaurantId, this.authDataService.getUsername(), this.currentPage, this.pageSize);
        // this.restaurantDataService.GetBookmarkResturaunts(this.restaurantId);
      }
    });


  }



  onNextPage(): void {
    this.currentPage++;
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


}
