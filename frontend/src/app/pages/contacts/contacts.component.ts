import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthDataService } from '../../_shared/auth-data.component';
import { ContactDataService } from '../../_shared/contact-data.component';
import { ContactEntry } from '../../_shared/contact-entry.model';

import { ContactsCardComponent } from '../../contacts-card/contacts-card.component';


@Component({
  selector: 'app-contacts',
  imports: [CommonModule, ContactsCardComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
  standalone: true
})
export class ContactsComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authDataService: AuthDataService,
    private contactDataService: ContactDataService
  ) { }
  
  private contactSubscription = new Subscription();  
  
  contacts: ContactEntry[];
  contact_id: number|string|null;
  LoggedIn: boolean = false;


  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.contactSubscription = this.contactDataService.contactSubject.subscribe(contacts => {
      this.contacts = contacts;
    });


    this.route.paramMap.subscribe(params => {
      this.contact_id = params.get('contact_id');

      this.authDataService.getIsLoggedIn().then(isLoggedIn => {

        this.LoggedIn = isLoggedIn;

        if (isLoggedIn && this.authDataService.getIsMod()) {
          if (this.contact_id) {
            this.contactDataService.getContact(this.contact_id);
          } else {
            this.contactDataService.get();
          }
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }


dismiss(entry:ContactEntry):void{
  this.contactDataService.dismiss(entry.id);
  this.router.navigate(['/contacts']);
}


resolve(entry:ContactEntry):void{
  this.contactDataService.resolve(entry.id);
   this.router.navigate(['/contacts']);
}


}
