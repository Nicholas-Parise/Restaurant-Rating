import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportTarget } from './shared/report-target.model';

@Injectable({
  providedIn: 'root',
})

export class ReportModalService {
  private targetSubject = new BehaviorSubject<ReportTarget | null>(null);

  target$ = this.targetSubject.asObservable();

  open(target: ReportTarget) {
    this.targetSubject.next(target);
  }

  close() {
    this.targetSubject.next(null);
  }

}
