import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserEntry } from '../../shared/user-entry.model';
import { UserDataService } from '../../shared/user-data.component';
import { AuthDataService } from '../../shared/auth-data.component';



@Component({
  selector: 'app-complete-profile',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css',
})
export class CompleteProfileComponent {

  userEntry: UserEntry;

  isFormVisible: boolean = false;
  showDeleteConfirm: boolean = false;

  currentTab: 'profile' | 'account' = 'account';

  username: string | null;

  password: string;
  password_confirm: string;

  email: string | null;
  name: string | null;
  bio: string | null;
  notifications: boolean;

  error: string | null = null;
  invalidUserErrorMessage: string | null = null;
  loading: boolean = false;
  isDisabled: boolean = false;

  constructor(private userDataService: UserDataService, private router: Router, private auth: AuthDataService) { }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  submitAccount() {
    this.error = null;

    if (!this.username || this.username.trim().length < 3) {
      this.error = 'Username must be at least 3 characters';
      return;
    }

    if (this.password && this.password !== this.password_confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.userDataService.completeAccount({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.currentTab = 'profile';
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to update account';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.userDataService.editUser({ name: this.name, bio: this.bio, notifications: this.notifications });

    if (this.selectedFile) {
      const picFormData = new FormData();
      picFormData.append('picture', this.selectedFile);
      this.userDataService.uploadProfilePicture(picFormData);
    }
    this.router.navigate(['/home']);
  }

  usernameCheck() {

    if (this.username && this.username.length < 5) {
      this.invalidUserErrorMessage = "Username must be atleast 5 characters";
      return;
    }

    this.auth.getIsValidUsername(this.username).subscribe({
      next: (response) => {
        this.invalidUserErrorMessage = null;
        this.isDisabled = false;
      },
      error: (error) => {
        this.invalidUserErrorMessage = error?.error?.message || 'Username must be unique';
        this.isDisabled = true;
      }
    });
  }




}
