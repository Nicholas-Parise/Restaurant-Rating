import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthDataService } from '../shared/auth-data.component';
import { UserCardComponent } from '../user-card/user-card.component';
import { UserDataService } from '../shared/user-data.component';
import { UserEntry } from '../shared/user-entry.model';

@Component({
    selector: 'app-friends',
    imports: [CommonModule, FormsModule, UserCardComponent],
    templateUrl: './friends.component.html',
    styleUrl: './friends.component.css',
    standalone: true
})
export class FriendsComponent implements OnInit {

  constructor(private userDataService: UserDataService,
    private authDataService: AuthDataService,
    private route: ActivatedRoute) { }

  userEntry: UserEntry[];
  userSubscription = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  username: string | null;
  LoggedIn: boolean = false;

  acceptedUsers: UserEntry[];
  pendingUsers: UserEntry[];
  declinedUsers: UserEntry[];
  blockedUsers: UserEntry[];

  ngOnInit(): void {

    this.userSubscription = this.userDataService.friendSubject.subscribe(userEntry => {
      console.log(userEntry);
      this.userEntry = Array.isArray(userEntry) ? userEntry : [userEntry];
      this.filterUsers();
    });


    this.route.paramMap.subscribe(params => {

      this.username = params.get('username');

      if (this.username) {
        this.userDataService.GetFriendsById(this.username);
      } else {
        this.authDataService.getIsLoggedIn().then(isLoggedIn => {
          if (isLoggedIn) {
            this.userDataService.GetUser();
            this.userDataService.GetFriends();
            this.LoggedIn = true;
          } else {
            this.LoggedIn = false;
          }
        });

      }
    })

  }


  filterUsers(): void {

    this.acceptedUsers = this.userEntry.filter(entry => entry.status === 'accepted');
    this.pendingUsers = this.userEntry.filter(entry => entry.status === 'pending');
    this.declinedUsers = this.userEntry.filter(entry => entry.status === 'declined');
    this.blockedUsers = this.userEntry.filter(entry => entry.status === 'blocked');
  }

  onNextPage(): void {
    this.currentPage++;
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


}
