import { Component, OnInit, Input} from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup, Validators } from '@angular/forms';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit{

  @Input() restaurantEntry : RestaurantEntry
  

reviewForm: FormGroup;
isFormVisible: boolean = false;



constructor(private reviewDataService: ReviewDataService){}

  ngOnInit(){
    this.reviewForm = new FormGroup({
      "description": new FormControl(null),
      "score": new FormControl(null),
      "favorited": new FormControl(null),
      "visited": new FormControl(null),
      "desired": new FormControl(null)
    })
  }

  onSubmit(){
    console.log(this.reviewForm);
    console.log(this.restaurantEntry.name);
    //constructor(public id:number, public review: string, public favorited: boolean, public visited: boolean, public score: number, public username:string){}
    const newEntry = new ReviewEntry(
        -1, 
        this.restaurantEntry.id,
        -1,
        this.reviewForm.value.description, 
        this.reviewForm.value.favorited, 
        this.reviewForm.value.visited, 
        this.reviewForm.value.desired, 
        this.reviewForm.value.score, 
        "null",
        "null",
        "null");

    this.reviewDataService.onAddReviewEntry(newEntry);
    this.closeForm();
  }


  closeForm(){
    console.log("close");
    this.isFormVisible = false;
  }
  
  showForm(){
    this.isFormVisible = true;
  }


}
