import { Injectable } from '@angular/core';
import { TagEntry } from './tag-entry.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TagDataService {

    tagEntry: TagEntry[] = [
    new TagEntry(0, 'fast food', 'description',"null"),
    new TagEntry(1, 'cafe', 'description',"null"),
    new TagEntry(2, 'fine dining',  'description',"null"),
    new TagEntry(3, 'buffet',  'description',"null")
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
