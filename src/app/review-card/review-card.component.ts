import { Component, Input, OnInit } from '@angular/core';
import { ReviewEntry } from '../shared/review-entry.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent implements OnInit{

@Input() reviewEntry : ReviewEntry;

  ngOnInit(): void {
    
  }

}