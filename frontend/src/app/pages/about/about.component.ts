import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ContactEntry } from '../../_shared/contact-entry.model';
import { ContactDataService } from '../../_shared/contact-data.component';

@Component({
    selector: 'app-about',
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css',
    standalone: true
})
export class AboutComponent implements OnInit {

    contactForm: FormGroup;

    validReasons = [
        { "key": "general", "label": "General Inquiry" },
        { "key": "account", "label": "Account Issue" },
        { "key": "bug", "label": "Technical Problem / Bug Report" },
        { "key": "owner", "label": "Business Owner Request" },
        { "key": "feature", "label": "Feature Request / Suggestion" },
        { "key": "report", "label": "Report Content" },
        { "key": "billing", "label": "Billing / Payment Issue" },
        { "key": "partnership", "label": "Partnership / Collaboration" },
        { "key": "other", "label": "Other" }
    ];

    constructor(private contactDataService: ContactDataService) { }

    ngOnInit() {
        this.contactForm = new FormGroup({
            "subject": new FormControl(null),
            "website": new FormControl(null),
            "message": new FormControl(null),
            "email": new FormControl(null, [Validators.email,Validators.required]),
            "reason": new FormControl(this.validReasons[0].key)
        })
    }


    get f() {
        return this.contactForm.controls;
    }

    onSubmit() {

        const newEntry = {
            subject: this.contactForm.value.subject,
            message: this.contactForm.value.message,
            reason: this.contactForm.value.reason,
            email: this.contactForm.value.email,
            website: this.contactForm.value.website
        } as ContactEntry;

        this.contactDataService.contact(newEntry);

        this.resetForm();
    }

    resetForm(): void {
        this.contactForm.patchValue({ subject: "" });
        this.contactForm.patchValue({ message: "" });
        this.contactForm.patchValue({ email: "" });
        this.contactForm.patchValue({ reason: this.validReasons[0].key });
    }


}
