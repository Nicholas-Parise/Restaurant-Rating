import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

import { ContactEntry } from './contact-entry.model';

@Injectable({
  providedIn: 'root'
})

export class ContactDataService {

  contactEntry: ContactEntry[];
  contactSubject = new Subject<ContactEntry[]>();

  totalReports: number = 0;
  totalPages: number = 0;

  constructor(private http: HttpClient, private toast: ToastService) { }

  private baseUrl = environment.apiEndpoint;

  contact(contactEntry: ContactEntry) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);
    this.http.post<{ message: string }>(`${this.baseUrl}contacts`, contactEntry, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
      this.toast.show(jsonData.message, "info");
    })
  }


  get() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ contacts: ContactEntry[] }>(`${this.baseUrl}contacts`, { headers })
      .subscribe((jsonData) => {
        this.contactEntry = jsonData.contacts;
        this.contactSubject.next(this.contactEntry);
      })
  }


  getContact(contactId: string | number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ contacts: ContactEntry[] }>(`${this.baseUrl}contacts/${contactId}`, { headers })
      .subscribe((jsonData) => {
        this.contactEntry = jsonData.contacts;
        this.contactSubject.next(this.contactEntry);
      })
  }



  dismiss(contactId: string | number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}contacts/${contactId}/dismiss`, null, { headers })
      .subscribe((jsonData) => {
        console.log(jsonData.message);
        this.toast.show(jsonData.message, "info");
      })
  }


  resolve(contactId: string | number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}contacts/${contactId}/resolve`, null, { headers })
      .subscribe((jsonData) => {
        console.log(jsonData.message);
        this.toast.show(jsonData.message, "info");
      })
  }





}
