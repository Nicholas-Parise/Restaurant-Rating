import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDataService } from '../../_shared/auth-data.component';
import { Router } from '@angular/router';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent implements OnInit{


  loginForm: FormGroup;
  passwordMismatch = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.setSEO();
   }

  constructor(private fb: FormBuilder,
    private auth: AuthDataService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {

    const email = this.f['email'].value;
    
    this.errorMessage = null;

    this.auth.forgot(email).subscribe({
      next: (response) => {
        this.router.navigate(['/recover']);
        // Navigate or show success
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Email doesnt belong to account.';
      }
    });
  }


  setSEO(){

    const url = `https://deglazd.com/forgot`;

    const description =
        `Recover your account Login on Deglazd`;

    // title
    this.title.setTitle(
        `Forgot | Deglazd`
    );

    // description
    this.meta.updateTag({
        name: 'description',
        content: description
    });

    // OpenGraph
    this.meta.updateTag({
        property: 'og:title',
        content: `Forgot | Deglazd`
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
