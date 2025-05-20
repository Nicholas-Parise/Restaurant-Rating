import { Component, Input } from '@angular/core';
import { TagEntry } from '../shared/tag-entry.model';

@Component({
  selector: 'app-tag-card',
  standalone: true,
  imports: [],
  templateUrl: './tag-card.component.html',
  styleUrl: './tag-card.component.css'
})
export class TagCardComponent {
@Input() tagEntry : TagEntry
}
