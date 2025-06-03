import { Component, Input, OnInit } from '@angular/core';
import { ReviewEntry } from '../shared/review-entry.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent implements OnInit{

@Input() reviewEntry : ReviewEntry;

  ngOnInit(): void {
    
  }

}