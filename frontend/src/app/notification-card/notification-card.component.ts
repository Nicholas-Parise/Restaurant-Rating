import { Component, Input } from '@angular/core';
import { NotificationsDataService } from '../shared/notification-data.component';
import { NotificationEntry } from '../shared/notification-entry.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input() notificationEntry: NotificationEntry;

  constructor(private notificationsDataService: NotificationsDataService) { }

  markAsRead(): void {
    this.notificationsDataService.seen(this.notificationEntry.id);
  }

  deleteNotification(): void {
    this.notificationsDataService.remove(this.notificationEntry.id);
  }


}
