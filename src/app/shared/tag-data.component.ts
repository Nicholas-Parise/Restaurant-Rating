import { Injectable } from '@angular/core';
import { TagEntry } from './tag-entry.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TagDataService {

    tagEntry: TagEntry[] = [
    new TagEntry(0, 'fast food', 'description'),
    new TagEntry(1, 'cafe', 'description'),
    new TagEntry(2, 'fine dining',  'description'),
    new TagEntry(3, 'buffet',  'description')
  ];
  
  tagSubject = new Subject<TagEntry[]>();

  constructor() { }

  GetTags() : TagEntry[]{
    return this.tagEntry;
  }

  GetTagById(id:number) : TagEntry{
    let temp = this.tagEntry.find(tagEntry => tagEntry.id == id);
    
    if(temp === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return temp;
  }

}
