import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthDataService } from '../_shared/auth-data.component';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserEntry } from '../_shared/user-entry.model';

@Component({
    selector: 'app-navbar',
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone: true
})
export class NavbarComponent implements OnInit {

  @Output() toggleNotifications = new EventEmitter<void>();

  constructor(private authDataService: AuthDataService,
    private router: Router) { }

  dropdownOpen: boolean = false;
  loggedIn: boolean = false;
  picture: string;

  authSubscription = new Subscription();

  navOpen = false;

  ngOnInit(): void {

    this.authDataService.getIsLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.picture = this.authDataService.getPicture();
        this.loggedIn = true;
      }
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-avatar.png';
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }
}
