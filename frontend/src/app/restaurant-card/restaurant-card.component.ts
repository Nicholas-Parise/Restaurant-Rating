import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';

import { Router } from '@angular/router';
import { ListEntry } from '../shared/list-entry.model';
import { ListDataService } from '../shared/list-data.component';

import { UtilService} from '../util.service';

@Component({
    selector: 'app-restaurant-card',
    imports: [],
    templateUrl: './restaurant-card.component.html',
    styleUrl: './restaurant-card.component.css',
    standalone: true
})
export class RestaurantCardComponent implements OnInit {
  @Input() restaurantEntry = {} as RestaurantEntry
  @Input() menu: boolean = false;
  @Input() favourite: boolean = false;
  @Input() bookmark: boolean = false;

  @Input() list: ListEntry;

  util = inject(UtilService)

  allowMenu: boolean = false;
  menuOpen: boolean = false;

  constructor(private restaurantDataService: RestaurantDataService,
    private listDataService:ListDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.menu) {
      this.allowMenu = this.menu;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['menu']) { //&& !changes['bookmarked'].firstChange) {
      this.allowMenu = changes['menu'].currentValue;
    }
  }

  navigateToRestaurant(event: MouseEvent): void {
    this.router.navigate(['/restaurant', this.restaurantEntry.slug + '-' + this.restaurantEntry.id]);
  }

  removeFavourite(): void {
    this.closeDropdown();
    this.restaurantDataService.removeFavourite(this.restaurantEntry.id);
  }

  removeBookmark(): void {
    this.closeDropdown();
    this.restaurantDataService.removeBookmark(this.restaurantEntry.id);
  }

  removeList():void{
    this.closeDropdown();
    this.listDataService.removeFromList(this.restaurantEntry.id, this.list.id);
  }


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeDropdown(): void {
    this.menuOpen = false;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;

    console.log('test');

    target.src = this.util.getPlaceholderImage(this.restaurantEntry.type); 
  }

}
