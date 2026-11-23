import { Component, OnInit } from '@angular/core';
import { RestaurantEntry } from '../../_shared/restaurant-entry.model';
import { RestaurantDataService } from '../../_shared/restaurant-data.component';
import { RestaurantCardComponent } from "../../restaurant-card/restaurant-card.component";

import { ListEntry } from '../../_shared/list-entry.model';
import { ListDataService } from '../../_shared/list-data.component';
import { ListCardComponent } from '../../list-card/list-card.component';

import { Subscription } from 'rxjs';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

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

  constructor(private restaurantDataService: RestaurantDataService, 
    private listDataService:ListDataService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document){}

  ngOnInit(): void {
    this.setSEO();

    this.restaurantSubscription = this.restaurantDataService.restaurantSubject.subscribe(restaurantEntry =>{
      this.restaurantEntry = restaurantEntry;
    });

    this.listSubscription = this.listDataService.listSubject.subscribe(listEntry =>{
      this.listEntry = listEntry;
    });


    this.restaurantDataService.getHot();
    this.listDataService.getRecommended();
  }

  ngOnDestroy() : void{
    this.restaurantSubscription.unsubscribe();
  }


  
  setSEO(){

  const url = `https://deglazd.com/`;

  const description =
    `A more personalised way to rate and manage the restaurants you and your friends have gone to. All on Deglazd.`;

  // title
  this.title.setTitle(
    `Deglazd`
  );

  // description
  this.meta.updateTag({
    name: 'description',
    content: description
  });

  // OpenGraph
  this.meta.updateTag({
    property: 'og:title',
    content: `Deglazd`
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
