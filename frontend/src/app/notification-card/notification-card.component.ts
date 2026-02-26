import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationsDataService } from '../shared/notification-data.component';
import { NotificationEntry } from '../shared/notification-entry.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-notification-card',
    imports: [RouterLink, DatePipe],
    templateUrl: './notification-card.component.html',
    styleUrl: './notification-card.component.css',
    standalone: true
})
export class NotificationCardComponent {
  @Input() notificationEntry: NotificationEntry;
  @Output() close = new EventEmitter<void>();

  constructor(private notificationsDataService: NotificationsDataService) { }

  markAsRead(): void {
    this.closePanel();
    this.notificationsDataService.seen(this.notificationEntry.id);
  }

  deleteNotification(): void {
    this.notificationsDataService.remove(this.notificationEntry.id);
  }

  closePanel() {
    console.log("close");
    this.close.emit();
  }

}
