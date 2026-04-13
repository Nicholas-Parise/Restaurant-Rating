import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastService } from './toast.service';
import { ApiService } from './api.service';

import { ContactEntry } from './contact-entry.model';

@Injectable({
  providedIn: 'root'
})

export class ContactDataService {

  contactEntry: ContactEntry[];
  contactSubject = new Subject<ContactEntry[]>();

  totalReports: number = 0;
  totalPages: number = 0;

  constructor(private api: ApiService,private toast: ToastService) {}

  contact(contactEntry: ContactEntry) {
    this.api.post<{ message: string }>(`contacts`, contactEntry).subscribe((jsonData) => {
      console.log(jsonData.message);
      this.toast.show(jsonData.message, "info");
    })
  }


  get() {
    this.api.get<{ contacts: ContactEntry[] }>(`contacts`)
      .subscribe((jsonData) => {
        this.contactEntry = jsonData.contacts;
        this.contactSubject.next(this.contactEntry);
      })
  }


  getContact(contactId: string | number) {
    this.api.get<{ contacts: ContactEntry[] }>(`contacts/${contactId}`)
      .subscribe((jsonData) => {
        this.contactEntry = jsonData.contacts;
        this.contactSubject.next(this.contactEntry);
      })
  }



  dismiss(contactId: string | number) {
    this.api.post<{ message: string }>(`contacts/${contactId}/dismiss`, null)
      .subscribe((jsonData) => {
        console.log(jsonData.message);
        this.toast.show(jsonData.message, "info");
      })
  }


  resolve(contactId: string | number) {
    this.api.post<{ message: string }>(`contacts/${contactId}/resolve`, null)
      .subscribe((jsonData) => {
        console.log(jsonData.message);
        this.toast.show(jsonData.message, "info");
      })
  }

}
