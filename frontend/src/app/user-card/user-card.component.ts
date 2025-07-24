import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { UserEntry } from '../shared/user-entry.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../shared/user-data.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent implements OnInit {
  @Input() userEntry = {} as UserEntry
  @Input() menu: boolean

  menuOpen: boolean = false;
  allowMenu: boolean = false;

  constructor(private userDataService: UserDataService) { }

  ngOnInit(): void {
    if (this.menu) {
      this.allowMenu = this.menu;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['menu']) { //&& !changes['bookmarked'].firstChange) {
      this.allowMenu = changes['menu'].currentValue;
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeDropdown(): void {
    this.menuOpen = false;
  }

  addFriend(): void {
    this.userDataService.friendUser(this.userEntry.username);
    console.log(`Add friend: ${this.userEntry.username}`);
    this.menuOpen = false;
  }

  acceptFriend(): void {
    this.userDataService.acceptFriendUser(this.userEntry.username);
    console.log(`accepted friend: ${this.userEntry.username}`);
    this.menuOpen = false;
  }

  denyFriend(): void {
    this.userDataService.denyFriendUser(this.userEntry.username);
    // TODO: implement deny friend
    console.log(`denied friend: ${this.userEntry.username}`);
    this.menuOpen = false;
  }

  removeFriend(): void {
    this.userDataService.removeFriendUser(this.userEntry.username);
    // TODO: implement remove friend
    console.log(`removed friend: ${this.userEntry.username}`);
    this.menuOpen = false;
  }


  reportUser(): void {
    // TODO: implement report
    console.log(`Report user: ${this.userEntry.username}`);
    this.menuOpen = false;
  }


}
