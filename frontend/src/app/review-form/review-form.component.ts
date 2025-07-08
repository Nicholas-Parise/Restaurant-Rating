import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';
import { CommonModule } from '@angular/common';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StarsComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit {

  @Input() restaurantEntry: RestaurantEntry;
  @Input() reviewEntry: ReviewEntry|null;

  reviewForm: FormGroup;
  isFormVisible: boolean = false;

  selectedRating = 0;

  constructor(private reviewDataService: ReviewDataService) { }

  ngOnInit() {
    this.reviewForm = new FormGroup({
      "description": new FormControl(null),
      "score": new FormControl(null),
      "liked": new FormControl(null),
      "visited": new FormControl(null),
      "desired": new FormControl(null)
    })

     this.prepopulate();
  }

  prepopulate(){
    if(this.reviewEntry){
      this.selectedRating = this.reviewEntry.score; 
      this.reviewForm.patchValue({ liked: this.reviewEntry.liked });
      this.reviewForm.patchValue({ visited: this.reviewEntry.visited });
    }
  }


  getDataFromStar(e:any){
    console.log("test");
    this.selectedRating = e;
  }

  onSubmit() {

    this.reviewForm.patchValue({ score: this.selectedRating });

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

  closeForm():void {
    console.log("close");
    this.isFormVisible = false;
  }

  showForm():void {
    this.isFormVisible = true;
  }

  toggleFavorite(): void {
    const current = this.reviewForm.get('liked')?.value;
    this.reviewForm.patchValue({ liked: !current });
  }

  toggleVisited(): void {
    const current = this.reviewForm.get('visited')?.value;
    this.reviewForm.patchValue({ visited: !current });
  }

addToFavourites():void{
  
}



}
