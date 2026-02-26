import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEntry } from '../shared/list-entry.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-card',
    imports: [CommonModule],
    templateUrl: './list-card.component.html',
    styleUrl: './list-card.component.css',
    standalone: true
})
export class ListCardComponent {

  @Input() listEntry: ListEntry;

  constructor(private router: Router) { }

  onViewList() {
    // TODO: navigate to list details
    console.log("View list clicked");
  }

  onFollowList() {
    // TODO: follow this list
    console.log("Follow list clicked");
  }

  navigateToList(event: MouseEvent): void {
    // You can use Angular router here
    this.router.navigate(['/List', this.listEntry.id]);
  }


}
