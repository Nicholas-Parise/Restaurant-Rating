import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthDataService } from '../../_shared/auth-data.component';
import { ContactDataService } from '../../_shared/contact-data.component';
import { ContactEntry } from '../../_shared/contact-entry.model';

import { ContactsCardComponent } from '../../contacts-card/contacts-card.component';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

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
    private contactDataService: ContactDataService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }
  
  private contactSubscription = new Subscription();  
  
  contacts: ContactEntry[];
  contact_id: number|string|null;
  LoggedIn: boolean = false;


  ngOnDestroy(): void {
    this.contactSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setSEO();

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


  setSEO(){

    const url = `https://deglazd.com/contacts`;

    const description =
        `Contacts Admin Console for Deglazd`;

    // title
    this.title.setTitle(
        `Contacts Admin Console | Deglazd`
    );

    // description
    this.meta.updateTag({
        name: 'description',
        content: description
    });

    // OpenGraph
    this.meta.updateTag({
        property: 'og:title',
        content: `Contacts Admin Console | Deglazd`
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
