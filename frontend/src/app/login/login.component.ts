import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDataService } from '../shared/auth-data.component';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

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

  ngOnInit(): void { }

  constructor(private fb: FormBuilder,
    private auth: AuthDataService,
    private router: Router) {

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
        this.router.navigate(['/user']);
        // Navigate or show success
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error?.error?.message || 'Login failed. Please try again.';
      }
    });
  }


}
