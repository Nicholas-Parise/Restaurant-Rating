import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  @Input() userEntry: UserEntry;

  isFormVisible: boolean = false;

  //userForm: FormGroup;

  constructor(private userDataService: UserDataService,
    private fb: FormBuilder
  ) { }


  userForm = this.fb.group({
    name: [''],
    email: [''],
    bio: [''],
    password: [''],
    newPassword: [''],
    notifications: [true]
  });

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  showAdvanced: boolean = false;

  ngOnInit() {
    /*
     this.userForm = new FormGroup({
       "name": new FormControl(null),
       "description": new FormControl(null)
     })
 */
    this.prepopulate();
  }

  prepopulate() {
    if (this.userEntry) {
      this.userForm.patchValue({ name: this.userEntry.name });
      this.userForm.patchValue({ email: this.userEntry.email });
      this.userForm.patchValue({ bio: this.userEntry.bio });
      this.userForm.patchValue({ notifications: this.userEntry.notifications });
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
    console.log("close");
    this.isFormVisible = false;
  }

  showForm(): void {
    console.log("open");
    this.prepopulate();
    this.isFormVisible = true;
  }

  onSubmit() {

    if (!this.showAdvanced) {

      this.userForm.patchValue({ newPassword: "" });
      this.userForm.patchValue({ email: "" });
      this.userForm.patchValue({ password: "" });
    }


    this.userDataService.editUser(this.userForm.value);

    if (this.selectedFile) {
      const picFormData = new FormData();
      picFormData.append('picture', this.selectedFile);
      this.userDataService.uploadProfilePicture(picFormData);
    }

    this.closeForm();
  }




}
