import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TagEntry } from '../_shared/tag-entry.model';
import { RestaurantDataService } from '../_shared/restaurant-data.component';

@Component({
  selector: 'app-tag-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './tag-modal.component.html',
  styleUrl: './tag-modal.component.css',
})
export class TagModalComponent implements OnInit {

  constructor(private restaurantDataService: RestaurantDataService) { }

  @Input() selectedTags: TagEntry[];
  @Output() selectedTagsChange = new EventEmitter<TagEntry[]>();
  @Output() close = new EventEmitter<void>();

  allTags: TagEntry[] = [];
  tagSubscription = new Subscription();
  localSelectedTags: TagEntry[] = [];
  selectedTagSlugs = new Set<string>();

  tagSearch = '';

  ngOnInit(): void {
    this.localSelectedTags = [...this.selectedTags];

    this.selectedTagSlugs = new Set(
      this.selectedTags.map(t => t.slug)
    );

    this.tagSubscription = this.restaurantDataService.tagSubject.subscribe(tagEntry => {
      this.allTags = tagEntry;
    });

    this.restaurantDataService.getTags();
  }

  toggleTag(tag: TagEntry) {

    if (this.selectedTagSlugs.has(tag.slug)) {

      this.selectedTagSlugs.delete(tag.slug);

      this.localSelectedTags =
        this.localSelectedTags.filter(
          t => t.slug !== tag.slug
        );

    } else {

      this.selectedTagSlugs.add(tag.slug);

      this.localSelectedTags = [
        ...this.localSelectedTags,
        tag
      ];
    }
  }


  get filteredSelectedTags(): TagEntry[] {

    return this.localSelectedTags.filter(tag =>
      tag.name.toLowerCase().includes(
        this.tagSearch.toLowerCase()
      )
    );
  }

  get filteredAvailableTags(): TagEntry[] {

    return this.allTags.filter(tag => {

      const matchesSearch =
        tag.name.toLowerCase().includes(
          this.tagSearch.toLowerCase()
        );

      const notSelected =
        !this.selectedTagSlugs.has(tag.slug);

      return matchesSearch && notSelected;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }


  onSubmit(): void {
    this.selectedTagsChange.emit(this.localSelectedTags);
    this.close.emit();
  }


  closeForm(): void {
    this.close.emit();
  }





}




