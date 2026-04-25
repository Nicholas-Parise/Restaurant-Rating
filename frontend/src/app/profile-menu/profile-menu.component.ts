import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RouterLink } from '@angular/router';
import { UserEntry } from '../_shared/user-entry.model';
import { UserDataService } from '../_shared/user-data.component';
import { AuthDataService } from '../_shared/auth-data.component';
import { NotificationEntry } from '../_shared/notification-entry.model';
import { NotificationsDataService } from '../_shared/notification-data.component';
import { NotificationCardComponent } from '../notification-card/notification-card.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-menu',
    imports: [RouterLink, NotificationCardComponent],
    templateUrl: './profile-menu.component.html',
    styleUrl: './profile-menu.component.css',
    standalone: true
})
export class ProfileMenuComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  userEntry: UserEntry;
  authSubscription = new Subscription();

  notificationEntry: NotificationEntry[];
  notificationSubscription = new Subscription();

  userHover:boolean = false;

  constructor(private userDataService: UserDataService,
    private authDataService: AuthDataService,
    private notificationsDataService: NotificationsDataService,
    private router:Router) { }


  ngOnDestroy(): void {
    this.notificationSubscription.unsubscribe();
  }


  ngOnInit(): void {

     this.notificationSubscription = this.notificationsDataService.NotificationSubject.subscribe(notificationEntry => {
      console.log(notificationEntry)
      this.notificationEntry = notificationEntry;
    });

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.userEntry = this.authDataService.getUserEntry();
        this.notificationsDataService.Get();
      }
    });
  }


  closePanel() {
    console.log("close");
    this.close.emit();
  }

   onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }


  logout() {
    this.closePanel();
    this.authDataService.signOut();
    this.router.navigate(['/login']);
  }


}
