import { Component, Input } from '@angular/core';
import { UserEntry } from '../shared/user-entry.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() userEntry = {} as UserEntry
  @Input() menu: boolean

  menuOpen: boolean = false;

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  addFriend() {
    // TODO: implement add friend
    console.log(`Add friend: ${this.userEntry.username}`);
    this.menuOpen = false;
  }

  blockUser() {
    // TODO: implement block
    console.log(`Block user: ${this.userEntry.username}`);
    this.menuOpen = false;
  }

  reportUser() {
    // TODO: implement report
    console.log(`Report user: ${this.userEntry.username}`);
    this.menuOpen = false;
  }


}
