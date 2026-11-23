import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, combineLatest } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthDataService } from '../../_shared/auth-data.component';
import { UserCardComponent } from '../../user-card/user-card.component';
import { UserDataService } from '../../_shared/user-data.component';
import { UserEntry } from '../../_shared/user-entry.model';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-friends',
    imports: [FormsModule, UserCardComponent],
    templateUrl: './friends.component.html',
    styleUrl: './friends.component.css',
    standalone: true
})
export class FriendsComponent implements OnInit {

  constructor(private userDataService: UserDataService,
    private authDataService: AuthDataService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document) { }

  userEntry: UserEntry[];
  userSubscription = new Subscription();

  currentPage: number = 1;
  pageSize: number = 10;
  maxPages: number = 0;

  username: string | null;
  LoggedIn: boolean = false;

  activeTab: 'friends' | 'pending' | 'declined' = 'friends';

  showPendingSent = true;
  showPendingReceived = true;

  showDeclinedSent = true;
  showDeclinedReceived = true;



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
        this.setSEO(this.username);
        
        this.authDataService.getIsLoggedIn().then(isLoggedIn => {
          if (isLoggedIn && this.username == this.authDataService.getUsername()) {
            this.userDataService.GetUser();
            this.userDataService.GetFriends();
            this.LoggedIn = true;
          } else {
           if (this.username) {
            this.userDataService.GetFriendsById(this.username);
           }
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


  setSEO(username: string) {
  
    const url = `https://deglazd.com/user/${username}/friends`;
  
    const description =
      `${username}'s Friends see all the friends and connections they have on Deglazd.`;
  
    // title
    this.title.setTitle(
      `${username}'s Friends | Deglazd`
    );
  
    // description
    this.meta.updateTag({
      name: 'description',
      content: description
    });
  
    // OpenGraph
    this.meta.updateTag({
      property: 'og:title',
      content: `${username}'s Friends | Deglazd`
    });
  
    this.meta.updateTag({
      property: 'og:description',
      content: description
    });
  
    this.meta.updateTag({
      property: 'og:url',
      content: url
    });
  
    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });
  /*
    if (user.picture) {
      this.meta.updateTag({
        property: 'og:image',
        content: user.picture
      });
    }
  */

    // canonical
    let link: HTMLLinkElement =
      this.document.querySelector("link[rel='canonical']") ||
      this.document.createElement('link');
  
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
  
    this.document.head.appendChild(link);
  }


}
