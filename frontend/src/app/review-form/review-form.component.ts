import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RestaurantEntry } from '../shared/restaurant-entry.model';
import { ReviewEntry } from '../shared/review-entry.model';
import { ReviewDataService } from '../shared/review-data.component';

import { StarsComponent } from '../stars/stars.component';
import { RestaurantDataService } from '../shared/restaurant-data.component';
import { FormsModule } from '@angular/forms';

import { ListEntry } from '../shared/list-entry.model';
import { ListDataService } from '../shared/list-data.component';

@Component({
    selector: 'app-review-form',
    imports: [ReactiveFormsModule, FormsModule, StarsComponent],
    templateUrl: './review-form.component.html',
    styleUrl: './review-form.component.css',
    standalone: true
})
export class ReviewFormComponent implements OnInit {

  @Input() restaurantEntry: RestaurantEntry;
  @Input() reviewEntry: ReviewEntry | null;
  @Input() bookmarked: boolean | null;
  @Input() userList: ListEntry[];

  reviewForm: FormGroup;
  isFormVisible: boolean = false;
  selectedRating = 0;
  bookmark: boolean = false;

  addToListVisible: boolean = false;
  selectedListId: number | null = null;

  constructor(private reviewDataService: ReviewDataService,
    private restaurantDataService: RestaurantDataService,
    private listDataService: ListDataService) { }

  ngOnInit() {
    this.reviewForm = new FormGroup({
      "description": new FormControl(null),
      "score": new FormControl(null),
      "liked": new FormControl(null),
      "visited": new FormControl(null)
    })

    this.prepopulate();
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['bookmarked']) { //&& !changes['bookmarked'].firstChange) {
      this.bookmark = changes['bookmarked'].currentValue;
    }

    if (changes['reviewEntry']) { //&& !changes['reviewEntry'].firstChange) {
      this.reviewEntry = changes['reviewEntry'].currentValue;
      if (this.reviewForm) {
        this.prepopulate();
      }
    }
  }



  prepopulate() {
    if (this.reviewEntry) {
      this.selectedRating = this.reviewEntry.score;
      this.reviewForm.patchValue({ liked: this.reviewEntry.liked });
      this.reviewForm.patchValue({ visited: this.reviewEntry.visited });
    }

    if (this.bookmarked) {
      this.bookmark = true;
    }
  }


  getDataFromStar(e: any) {
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
      this.reviewForm.value.score,
      "null",
      "null",
      new Date(),
      new Date(),
      "null",
      "null");

    this.reviewDataService.onAddReviewEntry(newEntry);
    this.closeForm();
  }

  closeForm(): void {
    console.log("close");
    this.isFormVisible = false;
  }

  showForm(): void {
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


  toggleBookmark(): void {
    this.bookmark = !this.bookmark;
    if (this.bookmark) {
      this.restaurantDataService.addBookmark(this.restaurantEntry.id);
    } else {
      this.restaurantDataService.removeBookmark(this.restaurantEntry.id);
    }
  }


  addToFavourites(): void {
    this.restaurantDataService.addFavourite(this.restaurantEntry.id);
  }


  showAddToListPopup(): void {
    this.addToListVisible = true;
  }

  closeAddToListPopup(): void {
    this.addToListVisible = false;
    this.selectedListId = null;
  }

  confirmAddToList(): void {
    if (this.selectedListId !== null) {
      this.listDataService.addToList(this.restaurantEntry.id, this.selectedListId);
      this.closeAddToListPopup();
    }
  }



}
