import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ContactEntry } from '../../_shared/contact-entry.model';
import { ContactDataService } from '../../_shared/contact-data.component';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

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

    constructor(private contactDataService: ContactDataService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
    ) { }

    ngOnInit() {
        this.setSEO();

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



  setSEO(){

  const url = `https://deglazd.com/about`;

  const description =
    `Learn about the people behind Deglazd, or share your Comments/Concerns.`;

  // title
  this.title.setTitle(
    `About | Deglazd`
  );

  // description
  this.meta.updateTag({
    name: 'description',
    content: description
  });

  // OpenGraph
  this.meta.updateTag({
    property: 'og:title',
    content: `About | Deglazd`
  });

  this.meta.updateTag({
    property: 'og:description',
    content: description
  });

  this.meta.updateTag({
    property: 'og:url',
    content: url
  });

  this.meta.updateTag({
    property: 'og:type',
    content: 'website'
  });
/*
  if (user.picture) {
    this.meta.updateTag({
      property: 'og:image',
      content: user.picture
    });
  }
*/

  // canonical
  let link: HTMLLinkElement =
    this.document.querySelector("link[rel='canonical']") ||
    this.document.createElement('link');

  link.setAttribute('rel', 'canonical');
  link.setAttribute('href', url);

  this.document.head.appendChild(link);
}


}
