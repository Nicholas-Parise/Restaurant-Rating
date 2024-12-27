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
      "review": new FormControl(null),
      "score": new FormControl(null),
      "favourited": new FormControl(null),
      "visited": new FormControl(null)
    })
  }

  onSubmit(){
    console.log(this.reviewForm);
    console.log(this.restaurantEntry.name);
    //constructor(public id:number, public review: string, public favourited: boolean, public visited: boolean, public score: number, public username:string){}
    const newEntry = new ReviewEntry(-1,this.reviewForm.value.review,this.reviewForm.value.favourited,this.reviewForm.value.visited,this.reviewForm.value.score,"admin");
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
