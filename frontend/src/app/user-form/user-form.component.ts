import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-user-form',
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.css',
    standalone: true
})
export class UserFormComponent implements OnInit {

  @Input() userEntry: UserEntry;

  isFormVisible: boolean = false;
  showDeleteConfirm: boolean = false;

  currentTab: 'profile' | 'account' = 'profile';

  name: string | null;
  bio: string | null;
  notifications: boolean;

  newPassword: string;
  password: string;
  currentEmail: string;
  email: string;

  constructor(private userDataService: UserDataService) { }

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  ngOnInit() {
    this.prepopulate();
  }

  prepopulate() {
    if (this.userEntry) {
      this.name = this.userEntry.name;
      this.bio = this.userEntry.bio;
      this.notifications = this.userEntry.notifications;
      this.currentEmail = this.userEntry.email;
    }
  }

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

  closeForm(): void {
    this.isFormVisible = false;
  }

  showForm(): void {
    this.prepopulate();
    this.isFormVisible = true;
  }

  onSubmit() {
    this.userDataService.editUser({ name: this.name, bio: this.bio, notifications: this.notifications });

    if (this.selectedFile) {
      const picFormData = new FormData();
      picFormData.append('picture', this.selectedFile);
      this.userDataService.uploadProfilePicture(picFormData);
    }

    this.closeForm();
  }


  openDeleteConfirm() {
    if (!this.password) {
      alert("Please enter current password to delete account");
      return;
    }

    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }

  changeEmail() {
    if (!this.email || !this.password) {
      alert("Please enter new email and current password");
      return;
    }
    this.userDataService.editUser({
      email: this.email,
      password: this.password
    });
    this.password = "";
  }

  changePassword() {
    if (!this.newPassword || !this.password) {
      alert("Please enter new password and current password");
      return;
    }
    this.userDataService.editUser({
      newPassword: this.newPassword,
      password: this.password
    });
    this.password = "";
    this.newPassword = "";
  }


  confirmDelete() {
    this.userDataService.deleteAccount(this.password);
    this.closeDeleteConfirm();
    this.password = "";
  }


}
