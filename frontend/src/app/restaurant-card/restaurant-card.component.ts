import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent implements OnInit {
  @Input() restaurantEntry = {} as RestaurantEntry
  @Input() menu: boolean = false;
  @Input() favourite: boolean = false;
  @Input() bookmark: boolean = false;

  allowMenu: boolean = false;
  menuOpen: boolean = false;

  constructor(private restaurantDataService: RestaurantDataService,
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
    // You can use Angular router here
    this.router.navigate(['/restaurant', this.restaurantEntry.id]);
  }

  removeFavourite(): void {
    this.closeDropdown();
    this.restaurantDataService.removeFavourite(this.restaurantEntry.id);
  }

  removeBookmark(): void {
    this.closeDropdown();
    this.restaurantDataService.removeBookmark(this.restaurantEntry.id);
  }


  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeDropdown(): void {
    this.menuOpen = false;
  }

   onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-restaurant.png';
  }

}
