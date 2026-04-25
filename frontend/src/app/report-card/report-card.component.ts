import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportEntry } from '../_shared/report-entry.model';

@Component({
  selector: 'app-report-card',
  imports: [CommonModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css',
})
export class ReportCardComponent {
  @Input() reportEntry: ReportEntry;
}
