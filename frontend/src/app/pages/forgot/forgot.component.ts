import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDataService } from '../../shared/auth-data.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent {


  loginForm: FormGroup;
  passwordMismatch = false;
  errorMessage: string | null = null;

  ngOnInit(): void { }

  constructor(private fb: FormBuilder,
    private auth: AuthDataService,
    private router: Router) {

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
}
