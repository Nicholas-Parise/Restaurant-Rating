import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewEntry } from '../shared/review-entry.model';
import { StarsComponent } from '../stars/stars.component';


@Component({
  selector: '[app-diary-card]',
  standalone: true,
  imports: [CommonModule, RouterLink, StarsComponent],
  templateUrl: './diary-card.component.html',
  styleUrl: './diary-card.component.css'
})
export class DiaryCardComponent {

@Input() review: ReviewEntry;

  expanded: Boolean = false;

   onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-restaurant.png';
  }

}
