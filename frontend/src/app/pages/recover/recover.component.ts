import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthDataService } from '../../_shared/auth-data.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
})
export class RecoverComponent implements OnInit{

  recoverForm: FormGroup;
  passwordMismatch = false;
  errorMessage: string | null = null;
  invalidOTC: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthDataService, private router:Router, private route: ActivatedRoute) {
    this.recoverForm = this.fb.group({
      otc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const otc = params['recover_id'];

      this.f['otc'].setValue(otc);
    });
  }

  get f() {
    return this.recoverForm.controls;
  }


  onSubmit(): void {
    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    const userData = {
      otc: this.f['otc'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.errorMessage = null;
    this.auth.reset(userData).subscribe({
      next: (response) => {
         this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Password reset failed. Please try again.';
      }
    });
  }


}
