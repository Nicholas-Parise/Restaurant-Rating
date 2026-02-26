import { OnInit, Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';


@Component({
    selector: 'app-stars',
    imports: [],
    templateUrl: './stars.component.html',
    styleUrl: './stars.component.css',
    standalone: true
})
export class StarsComponent implements OnInit{

  stars = [1, 2, 3, 4, 5];
  selectedRating = 0;
  hoverRating = 0;

  @Output()
  rating: EventEmitter<number> = new EventEmitter();

  @Input() inputRating: number
  @Input() static: boolean


  ngOnInit(): void {
    this.selectedRating = this.inputRating;
  }


 ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputRating'] && !changes['inputRating'].firstChange) {
      this.selectedRating = changes['inputRating'].currentValue;
    }
  }


getRating(): number{
return this.selectedRating;
}

onStarHover(event: MouseEvent, star: number): void {

    const onFirstHalf = this.onFirstHalf(event);

    if (onFirstHalf) {
      this.hoverRating = (star + 1) * 2;
    } else {
      this.hoverRating = (star * 2) + 1;
    }
  }

onStarClick(event: MouseEvent, star: number): void {

    const onFirstHalf = this.onFirstHalf(event);

     this.removeHover();

    if (onFirstHalf) {
      this.selectedRating = (star + 1) * 2;
    } else {
      this.selectedRating = (star * 2) + 1;
    }
    this.rating.emit(this.selectedRating);
  }

  removeHover(){
    this.hoverRating = 0;
  }

  removeRating(){
    this.selectedRating = 0;
    this.rating.emit(this.selectedRating);
  }


  private onFirstHalf(event: MouseEvent): boolean {
    const starIcon = event.target as HTMLElement;
    return event.pageX > starIcon.getBoundingClientRect().right - starIcon.offsetWidth / 2;
  }

}
