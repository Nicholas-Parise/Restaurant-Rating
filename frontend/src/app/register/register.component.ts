import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthDataService } from '../shared/auth-data.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  passwordMismatch = false;
  errorMessage: string | null = null;

ngOnInit(): void {}

  constructor(private fb: FormBuilder, private auth: AuthDataService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }



onSubmit(): void {
     if (this.f['password'].value !== this.f['confirmPassword'].value) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    const userData = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    console.log('Registering user:', userData);
    this.errorMessage = null;
    this.auth.PostRegister(userData.name, userData.password, userData.email).subscribe({
      next: (response) => {
        console.log('register success:', response);
        // Navigate or show success
      },
      error: (error) => {
        console.error('Register failed:', error);
        this.errorMessage = error?.error?.message || 'Register failed. Please try again.';
      }
    });
  }

}
