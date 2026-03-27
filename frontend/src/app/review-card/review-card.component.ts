import { Component, Input, OnInit } from '@angular/core';
import { ReviewEntry } from '../shared/review-entry.model';
import { RouterLink } from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import { ReportModalService } from '../shared/reportModal.service';

@Component({
    selector: 'app-review-card',
    imports: [RouterLink, StarsComponent],
    templateUrl: './review-card.component.html',
    styleUrl: './review-card.component.css',
    standalone: true
})
export class ReviewCardComponent implements OnInit{

@Input() reviewEntry : ReviewEntry;

  constructor(private reportModalService:ReportModalService){}

  expanded: boolean = false;

  ngOnInit(): void {
    
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }


  report() {
    this.reportModalService.open({
      type: 'review',
      data: this.reviewEntry
    });
  }


}