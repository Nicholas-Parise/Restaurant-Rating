import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { RestaurantCardComponent } from '../../restaurant-card/restaurant-card.component';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';
import { AuthDataService } from '../../_shared/auth-data.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-bookmarked',
    imports: [RestaurantCardComponent],
    templateUrl: './bookmarked.component.html',
    styleUrl: './bookmarked.component.css',
    standalone: true
})
export class BookmarkedComponent implements OnInit {

  bookmarkSubject = new Subscription();
  restaurantEntry: RestaurantEntry[];

  username: string | null;
  LoggedIn: boolean = false;

  showEdit: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  constructor(private restaurantDataService: RestaurantDataService,
    private authDataService: AuthDataService,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this.bookmarkSubject.unsubscribe();
  }

  ngOnInit(): void {

    this.bookmarkSubject = this.restaurantDataService.bookmarkSubject.subscribe(restaurantEntry => {
      this.restaurantEntry = restaurantEntry;
    });


    this.route.paramMap.subscribe(params => {

      if (params.get('username')) {

        this.username = params.get('username');
        this.getBookmarks();
      } 

      this.showEditLogic();
      
    })
  }

  showEditLogic(): void {
    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn && this.username == this.authDataService.getUsername()) {
        this.showEdit = true;
      }
    });
  }


  getBookmarks() {
    this.restaurantDataService.GetBookmark(this.username || "", this.currentPage);
  }

  onNextPage(): void {
    this.currentPage++;
    this.getBookmarks();
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.getBookmarks();
  }



}
