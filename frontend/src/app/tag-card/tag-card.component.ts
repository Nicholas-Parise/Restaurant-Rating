import { Component, Input } from '@angular/core';
import { TagEntry } from '../shared/tag-entry.model';

@Component({
    selector: 'app-tag-card',
    imports: [],
    templateUrl: './tag-card.component.html',
    styleUrl: './tag-card.component.css',
    standalone: true
})
export class TagCardComponent {
@Input() tagEntry : TagEntry
}
