import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from './toast.model';

@Injectable({
  providedIn: 'root',
})

export class ToastService {

  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);

  toasts$ = this.toastSubject.asObservable();

  private idCounter = 0;

  show(message: string, type: Toast['type'] = 'info') {
    const toast: Toast = {
      id: this.idCounter++,
      message,
      type
    };

    this.toasts.push(toast);
    this.toastSubject.next([...this.toasts]);

    // auto remove after 3s
    setTimeout(() => this.remove(toast.id), 3000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next([...this.toasts]);
  }
}