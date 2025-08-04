import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthDataService } from '../shared/auth-data.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserEntry } from '../shared/user-entry.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
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

    this.authSubscription = this.authDataService.authSubject.subscribe(userEntry => {
      if (userEntry) {
        this.picture = userEntry.picture;
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

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



  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    // Close dropdown when losing focus
    setTimeout(() => this.dropdownOpen = false, 150);
  }

  signOut() {
    this.authDataService.signOut(); // You should define this in your auth service
    this.router.navigate(['/login']);
  }


}
