import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReportDataService } from '../shared/report-data.component';

import { ReportEntry } from '../shared/report-entry.model';
import { UserEntry } from '../shared/user-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';

@Component({
  selector: 'app-report-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.css',
})
export class ReportFormComponent implements OnInit {

  constructor(private reportDataService: ReportDataService) { }

  @Input() userEntry: UserEntry | null;
  @Input() reviewEntry: ReviewEntry | null;
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  target_type: string;
  target_id: number;

  validReasons = [
    { key: 1, value: 'spam' },
    { key: 2, value: 'harassment' },
    { key: 3, value: 'hate' },
    { key: 4, value: 'nudity' },
    { key: 5, value: 'violence' },
    { key: 6, value: 'misinformation' },
    { key: 7, value: 'other' }
  ];

  ngOnInit() {
    this.form = new FormGroup({
      "description": new FormControl(null),
      "reason": new FormControl(this.validReasons[1].value)
    })

    if (this.userEntry) {
      this.target_type = "user"
      this.target_id = this.userEntry.id;
    } else if (this.reviewEntry) {
      this.target_type = "review"
      this.target_id = this.reviewEntry.id;
    } else {
      console.log("Undefined State NO ENTRY PROVIDED")
    }
  }


  onSubmit() {
    const description = this.form.value.description;
    const reason = this.form.value.reason;

    const newEntry = {
      description: description,
      reason: reason,
      target_type: this.target_type,
      target_id: this.target_id
    } as ReportEntry;

    this.reportDataService.report(newEntry);
    this.closeForm();
  }

  closeForm(): void {
    this.close.emit();
    console.log('report gone'); 
  }
}