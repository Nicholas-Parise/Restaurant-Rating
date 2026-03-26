import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReportDataService } from '../shared/report-data.component';

import { ReportEntry } from '../shared/report-entry.model';
import { UserEntry } from '../shared/user-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';

import { ReportModalService } from '../reportModal.service';
import { ReportTarget } from '../shared/report-target';

@Component({
  selector: 'app-report-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './report-form.component.html',
  styleUrl: './report-form.component.css',
})
export class ReportFormComponent implements OnInit {

  constructor(private reportDataService: ReportDataService, private modal: ReportModalService) { }

  form: FormGroup;

  target: ReportTarget | null = null;

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
      "reason": new FormControl(this.validReasons[0].value)
    })

    this.modal.target$.subscribe(target => {
      this.target = target;

      if (target) {
        this.form.reset({
          description: null,
          reason: this.validReasons[0].value
        });
      }
    });
  }

  onSubmit() {
    if (!this.target) {
      console.error('No report target');
      return;
    }

    const newEntry = {
      description: this.form.value.description,
      reason: this.form.value.reason,
      target_type: this.target.type,
      target_id: this.target.data.id
    } as ReportEntry;

    this.reportDataService.report(newEntry);
    this.closeForm();
  }

  closeForm() {
    this.modal.close();
  }

}