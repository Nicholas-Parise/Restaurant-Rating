import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';
import { ListEntry } from './list-entry.model';
import { RestaurantEntry } from './restaurant-entry.model';
import { json } from 'express';

@Injectable({
  providedIn: 'root'
})

export class ListDataService {

  listSubject = new Subject<ListEntry[]>();
  listEntry: ListEntry[] = [];
  restaurantEntry: RestaurantEntry[] = [];
  totalLists:number = 0;
  totalPages:number = 0;

  userListSubject = new Subject<ListEntry[]>();
  userListEntry: ListEntry[] = [];
  totalUserLists:number = 0;

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  getListById(list_id: number | string) {

    this.http.get<{ lists: ListEntry[], restaurants: RestaurantEntry[] }>(`${this.baseUrl}lists/${list_id}`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.restaurantEntry = jsonData.restaurants;
      this.listSubject.next(this.listEntry);
    });
  }


  // get authenticated user lists
  getLists() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ lists: ListEntry[], totalLists: number }>(`${this.baseUrl}lists`, { headers }).subscribe((jsonData) => {
      this.userListEntry = jsonData.lists;
      this.totalUserLists = jsonData.totalLists;
      this.userListSubject.next(this.userListEntry);
    })
  }

  getListsByUsername(username: string) {
    this.http.get<{ lists: ListEntry[], totalLists: number }>(`${this.baseUrl}lists/users/${username}`).subscribe((jsonData) => {
      this.userListEntry = jsonData.lists;
      this.totalUserLists = jsonData.totalLists;
      this.userListSubject.next(this.userListEntry);
    });
  }

  getRecommended() {
    this.http.get<{ lists: ListEntry[], totalLists: number }>(`${this.baseUrl}lists/recommended`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.totalLists = jsonData.totalLists;
      this.listSubject.next(this.listEntry);
    });
  }


  GetSearch(searchQuery: string, page: number | null, pageSize: number | null) {

    this.http.get<{ lists: ListEntry[], totalLists: number, pageSize: number }>(`${this.baseUrl}lists/search?q=${searchQuery}&page=${page}&pageSize=${pageSize}`).subscribe((jsonData) => {
      this.listEntry = jsonData.lists;
      this.totalLists = jsonData.totalLists;
      this.totalPages = Math.ceil(this.totalLists / jsonData.pageSize);
      this.listSubject.next(this.listEntry);
    });
  }


  createList(singleListEntry: ListEntry) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string, list: ListEntry }>(`${this.baseUrl}lists`, singleListEntry, { headers }).subscribe((jsonData) => {
      this.userListEntry.push(jsonData.list);
      this.userListSubject.next(this.userListEntry);
    });
  }

  editList(singleListEntry: ListEntry, list_id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.put<{ message: string, list: ListEntry }>(`${this.baseUrl}lists/${list_id}`, singleListEntry, { headers }).subscribe((jsonData) => {
      this.listEntry[0].name = jsonData.list.name;
      this.listEntry[0].description = jsonData.list.description;
      this.listSubject.next(this.listEntry);
    });
  }

  deleteList(list_id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.delete<{ message: string }>(`${this.baseUrl}lists/${list_id}`, { headers }).subscribe((jsonData) => {
      this.listEntry = this.listEntry.filter(list => list.id !== list_id);
      this.listSubject.next(this.listEntry);
    });
  }

  addToList(restaurant_id: number, list_id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}lists/${list_id}/${restaurant_id}`, {}, { headers }).subscribe((jsonData) => {
    });
  }

  removeFromList(restaurant_id: number, list_id: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.delete<{ message: string }>(`${this.baseUrl}lists/${list_id}/${restaurant_id}`, { headers }).subscribe((jsonData) => {
      this.restaurantEntry = this.restaurantEntry.filter(res => res.id !== restaurant_id);
      this.listSubject.next(this.listEntry);
    });
  }



}
