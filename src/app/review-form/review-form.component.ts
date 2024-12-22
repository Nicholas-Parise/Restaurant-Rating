import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit{

reviewForm: FormGroup;
isFormVisible: boolean = false;

constructor(){}

  ngOnInit(){
    this.reviewForm = new FormGroup({
      "review": new FormControl(null),
      "score": new FormControl(null),
      "love": new FormControl(null)
    })
  }

  onSubmit(){
    console.log(this.reviewForm);
  }


  closeForm(){
    console.log("test");
    this.isFormVisible = false;
  }
  
  showForm(){
    this.isFormVisible = true;
  }


}
