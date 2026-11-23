import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { RestaurantCardComponent } from '../../restaurant-card/restaurant-card.component';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';
import { AuthDataService } from '../../_shared/auth-data.component';
import { ActivatedRoute } from '@angular/router';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

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
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
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
       
        if(this.username)
          this.setSEO(this.username);
        
        this.getBookmarks();
        this.showEditLogic();
      
      } 
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

  
    setSEO(username: string) {
  
    const url = `https://deglazd.com/user/${username}/bookmarked`;
  
    const description =
      `${username}'s Bookmarked Restaurants. See all the places they want to go, all on Deglazd.`;
  
    // title
    this.title.setTitle(
      `${username}'s Bookmarked Restaurants | Deglazd`
    );
  
    // description
    this.meta.updateTag({
      name: 'description',
      content: description
    });
  
    // OpenGraph
    this.meta.updateTag({
      property: 'og:title',
      content: `${username}'s Bookmarked Restaurants | Deglazd`
    });
  
    this.meta.updateTag({
      property: 'og:description',
      content: description
    });
  
    this.meta.updateTag({
      property: 'og:url',
      content: url
    });
  
    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });
  /*
    if (user.picture) {
      this.meta.updateTag({
        property: 'og:image',
        content: user.picture
      });
    }
  */

    // canonical
    let link: HTMLLinkElement =
      this.document.querySelector("link[rel='canonical']") ||
      this.document.createElement('link');
  
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
  
    this.document.head.appendChild(link);
  }
  


}
