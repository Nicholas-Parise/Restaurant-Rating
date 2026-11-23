import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDataService } from '../../_shared/auth-data.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: true
})
export class LoginComponent {

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    const userData = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    console.log('login user:', userData);
    this.errorMessage = null;
    this.auth.PostLogin(userData.password, userData.email).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.router.navigate(['/user',response.username]);
        // Navigate to show success
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }


  googleButton():void{
    window.location.href = `${environment.apiEndpoint}auth/google`;
  }

  setSEO(){

    const url = `https://deglazd.com/login`;

    const description =
        `Login to your existing account on Deglazd`;

    // title
    this.title.setTitle(
        `Login | Deglazd`
    );

    // description
    this.meta.updateTag({
        name: 'description',
        content: description
    });

    // OpenGraph
    this.meta.updateTag({
        property: 'og:title',
        content: `Login | Deglazd`
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
