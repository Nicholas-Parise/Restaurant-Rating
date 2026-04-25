import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastService } from './toast.service';
import { ApiService } from './api.service';
import { ListEntry } from './list-entry.model';
import { RestaurantEntry } from './restaurant-entry.model';

@Injectable({
  providedIn: 'root'
})

export class ListDataService {

  listSubject = new Subject<ListEntry[]>();
  listEntry: ListEntry[] = [];
  restaurantEntry: RestaurantEntry[] = [] ;
  totalLists:number = 0;
  totalPages:number = 0;

  userListSubject = new Subject<ListEntry[]>();
  userListEntry: ListEntry[] = [];
  totalUserLists:number = 0;

  constructor(private api: ApiService,private toast: ToastService) {}

  getListById(list_id: number | string) {

    this.api.get<{ lists: ListEntry[], restaurants: RestaurantEntry[] }>(`lists/${list_id}`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.restaurantEntry = jsonData.restaurants;
      this.listSubject.next(this.listEntry);
    });
  }


  // get authenticated user lists
  getLists() {

    this.restaurantEntry = [];

    this.api.get<{ lists: ListEntry[], totalLists: number }>(`lists`).subscribe((jsonData) => {
      this.userListEntry = jsonData.lists;
      this.totalUserLists = jsonData.totalLists;
      this.userListSubject.next(this.userListEntry);
    })
  }

  getListsByUsername(username: string) {
    this.api.get<{ lists: ListEntry[], totalLists: number }>(`lists/users/${username}`).subscribe((jsonData) => {
      this.userListEntry = jsonData.lists;
      this.totalUserLists = jsonData.totalLists;
      this.userListSubject.next(this.userListEntry);
    });
  }

  getRecommended() {
    this.api.get<{ lists: ListEntry[], totalLists: number }>(`lists/recommended`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.totalLists = jsonData.totalLists;
      this.listSubject.next(this.listEntry);
    });
  }


  GetSearch(searchQuery: string, page: number | null, pageSize: number | null) {

    this.api.get<{ lists: ListEntry[], totalLists: number, pageSize: number }>(`lists/search?q=${searchQuery}&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.totalLists = jsonData.totalLists;
      this.totalPages = Math.ceil(this.totalLists / jsonData.pageSize);
      this.listSubject.next(this.listEntry);
    });
  }


  createList(singleListEntry: ListEntry) {
    this.api.post<{ message: string, list: ListEntry }>(`lists`, singleListEntry).subscribe((jsonData) => {
      this.userListEntry.push(jsonData.list);
      this.userListSubject.next(this.userListEntry);
    });
  }

  editList(singleListEntry: ListEntry, list_id: number) {
    this.api.put<{ message: string, list: ListEntry }>(`lists/${list_id}`, singleListEntry).subscribe((jsonData) => {
      this.listEntry[0].name = jsonData.list.name;
      this.listEntry[0].description = jsonData.list.description;
      this.listSubject.next(this.listEntry);
    });
  }

  deleteList(list_id: number) {
    this.api.delete<{ message: string }>(`lists/${list_id}`).subscribe((jsonData) => {
      this.listEntry = this.listEntry.filter(list => list.id !== list_id);
      this.listSubject.next(this.listEntry);
    });
  }

  addToList(restaurant_id: number, list_id: number) {
    this.api.post<{ message: string }>(`lists/${list_id}/${restaurant_id}`, null).subscribe((jsonData) => {
    });
  }

  removeFromList(restaurant_id: number, list_id: number) {
    this.api.delete<{ message: string }>(`lists/${list_id}/${restaurant_id}`).subscribe((jsonData) => {
      if(this.restaurantEntry){
      this.restaurantEntry = this.restaurantEntry.filter(res => res.id !== restaurant_id);
      }
      this.listSubject.next(this.listEntry);
      
    });
  }

}
