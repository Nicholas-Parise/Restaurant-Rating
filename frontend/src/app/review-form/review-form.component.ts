import { Component, OnInit, Input} from '@angular/core';
import { ReactiveFormsModule, FormControl,FormGroup, Validators } from '@angular/forms';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit{

  @Input() restaurantEntry : RestaurantEntry
  

reviewForm: FormGroup;
isFormVisible: boolean = false;
stars = [1, 2, 3, 4, 5];
selectedRating = 0;


constructor(private reviewDataService: ReviewDataService){}

  ngOnInit(){
    this.reviewForm = new FormGroup({
      "description": new FormControl(null),
      "score": new FormControl(null),
      "liked": new FormControl(null),
      "visited": new FormControl(null),
      "desired": new FormControl(null)
    })
  }

  onSubmit(){
    console.log(this.reviewForm);
//    console.log(this.restaurantEntry.name);
    console.log(this.restaurantEntry);
    //constructor(public id:number, public review: string, public liked: boolean, public visited: boolean, public score: number, public username:string){}
    const newEntry = new ReviewEntry(
        -1, 
        this.restaurantEntry.id,
        this.reviewForm.value.description, 
        this.reviewForm.value.liked, 
        this.reviewForm.value.visited, 
        this.reviewForm.value.desired, 
        this.reviewForm.value.score, 
        "null",
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

selectRating(index: number): void {
  this.selectedRating = (index + 1) * 2; // Full star (2, 4, 6, 8, 10)
  this.reviewForm.patchValue({ score: this.selectedRating });
}

selectHalfRating(index: number): void {
  this.selectedRating = (index * 2) + 1; // Half star (1, 3, 5, 7, 9)
  this.reviewForm.patchValue({ score: this.selectedRating });
}


toggleFavorite(): void {
  const current = this.reviewForm.get('liked')?.value;
  this.reviewForm.patchValue({ liked: !current });
}

toggleVisited(): void {
  const current = this.reviewForm.get('visited')?.value;
  this.reviewForm.patchValue({ visited: !current });
}



}
