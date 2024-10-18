import { Component, Input } from '@angular/core';
import { RestaurantEntry } from '../shared/restaurant-entry.model';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  @Input() restaurantEntry = {} as RestaurantEntry
}
