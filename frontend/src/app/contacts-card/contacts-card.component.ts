import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContactEntry } from '../shared/contact-entry.model';

@Component({
  selector: 'app-contacts-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './contacts-card.component.html',
  styleUrl: './contacts-card.component.css',
})
export class ContactsCardComponent {

@Input() contactEntry: ContactEntry;

}
