import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReportEntry } from '../_shared/report-entry.model';

@Component({
  selector: 'app-report-case-card',
  imports: [CommonModule],
  templateUrl: './report-case-card.component.html',
  styleUrl: './report-case-card.component.css',
})
export class ReportCaseCardComponent {

@Input() reportEntry: ReportEntry;

  constructor(private router: Router) {}

  openReport() {

    console.log(this.reportEntry);

    const type = this.reportEntry.target_type;
    const id = this.reportEntry.target_id;

    this.router.navigate(['/reports', type, id]);
  }

}
