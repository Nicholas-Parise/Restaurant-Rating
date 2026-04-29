import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewEntry } from '../_shared/review-entry.model';
import { StarsComponent } from '../stars/stars.component';
import { UtilService} from '../_shared/util.service';

@Component({
    selector: '[app-diary-card]',
    imports: [CommonModule, RouterLink, StarsComponent],
    templateUrl: './diary-card.component.html',
    styleUrl: './diary-card.component.css',
    standalone: true
})
export class DiaryCardComponent implements OnInit{

@Input() review: ReviewEntry;

  expanded: Boolean = false;
  util = inject(UtilService)

ngOnInit(): void {
  if (!this.review.pictures) {
      this.review.pictures = this.util.getPlaceholderImage(this.review.type);
  }
}

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.util.getPlaceholderImage(this.review.type);   
  }
}
