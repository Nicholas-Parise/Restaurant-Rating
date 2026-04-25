import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationEntry } from './notification-entry.model';
import { ToastService } from './toast.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class NotificationsDataService {

  NotificationEntry: NotificationEntry[] = [];
  NotificationSubject = new Subject<NotificationEntry[]>();

  constructor(private api: ApiService,private toast: ToastService) {}

  Get() {
    this.api.get<{ notifications: NotificationEntry[] }>(`notifications`).subscribe((jsonData) => {
      this.NotificationEntry = jsonData.notifications;
      this.NotificationSubject.next(this.NotificationEntry);
    })
  }

  seen(id: number) {

    var sendData = { "is_read": true };

    this.api.put<{ message: string }>(`notifications/${id}`, sendData).subscribe((jsonData) => {
      console.log(jsonData.message);
    })
    let foundIndex = this.NotificationEntry.findIndex(not => not.id === id);
    this.NotificationEntry[foundIndex].is_read = true;
    this.NotificationSubject.next(this.NotificationEntry);
  }

  remove(id: number): void {
    this.api.delete<{ message: string }>(`notifications/${id}`).subscribe((jsonData) => {
      this.NotificationEntry = this.NotificationEntry.filter(not => not.id !== id);
      this.NotificationSubject.next(this.NotificationEntry);
    })

  }

}
