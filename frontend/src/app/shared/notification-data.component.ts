import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';
import { NotificationEntry } from './notification-entry.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationsDataService {

  NotificationEntry: NotificationEntry[] = [];
  NotificationSubject = new Subject<NotificationEntry[]>();

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  Get() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ notifications: NotificationEntry[] }>(`${this.baseUrl}notifications`, { headers }).subscribe((jsonData) => {
      this.NotificationEntry = jsonData.notifications;
      this.NotificationSubject.next(this.NotificationEntry);
    })
  }

  seen(id: number) {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    var sendData = { "is_read": true };

    this.http.put<{ message: string }>(`${this.baseUrl}notifications/${id}`, sendData, { headers }).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
    let foundIndex = this.NotificationEntry.findIndex(not => not.id === id);
    this.NotificationEntry[foundIndex].is_read = true;
    this.NotificationSubject.next(this.NotificationEntry);
  }

  remove(id: number): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.delete<{ message: string }>(`${this.baseUrl}notifications/${id}`, { headers }).subscribe((jsonData) => {
      this.NotificationEntry = this.NotificationEntry.filter(not => not.id !== id);
      this.NotificationSubject.next(this.NotificationEntry);
    })

  }

}
