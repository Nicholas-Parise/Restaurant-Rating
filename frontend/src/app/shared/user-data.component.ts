import { Injectable } from '@angular/core';
import { UserEntry } from './user-entry.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthDataService } from './auth-data.component';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  userEntry: UserEntry[] = [];
  userSubject = new Subject<UserEntry[]>();

  totalusers: number = 0;
  totalPages: number = 0;


  friendEntry: UserEntry[] = [];
  friendSubject = new Subject<UserEntry[]>();

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';


  GetUsers() {
    //return this.userEntry;
  }

  GetUserById(username: string) {
    this.http.get<{ user: UserEntry[], totalReviews: Number }>(`${this.baseUrl}users/${username}`).subscribe((jsonData) => {
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })
  }

  GetUser() {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ user: UserEntry[], totalReviews: Number }>(`${this.baseUrl}users`, { headers }).subscribe((jsonData) => {
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })
  }


  editUser(singleUserEntry: any) {

    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.put<{ user: UserEntry[], message: string }>(`${this.baseUrl}users`, singleUserEntry, { headers }).subscribe((jsonData) => {
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })

    //this.userEntry.push(singleUserEntry);
    //this.userSubject.next(this.userEntry);
  }


  friendUser(username: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ user: UserEntry[], message: string }>(`${this.baseUrl}friends/${username}`, {}, { headers }).subscribe((jsonData) => {
      // this.userEntry = jsonData.user;
      // this.userSubject.next(this.userEntry);
      console.log("friend request sent");
    })
  }

  acceptFriendUser(username: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ user: UserEntry[], message: string }>(`${this.baseUrl}friends/${username}/accept`, {}, { headers }).subscribe((jsonData) => {
      console.log("Accepted friend request");
    })
  }

  denyFriendUser(username: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ user: UserEntry[], message: string }>(`${this.baseUrl}friends/${username}/deny`, {}, { headers }).subscribe((jsonData) => {
      console.log("denied friend request");
    })
  }

  removeFriendUser(username: string): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.delete<{ user: UserEntry[], message: string }>(`${this.baseUrl}friends/${username}`, { headers }).subscribe((jsonData) => {
      console.log("removed friend");
    })
  }


  GetFriends() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{ user: UserEntry[], totalReviews: Number }>(`${this.baseUrl}friends`, { headers }).subscribe((jsonData) => {
      this.friendEntry = jsonData.user;
      this.friendSubject.next(this.friendEntry);
    })
  }

  GetFriendsById(username: string) {
    this.http.get<{ user: UserEntry[], totalReviews: Number }>(`${this.baseUrl}friends/${username}`).subscribe((jsonData) => {
      this.friendEntry = jsonData.user;
      this.friendSubject.next(this.friendEntry);
    })
  }



  uploadProfilePicture(data: FormData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ user: UserEntry[], message: string }>(`${this.baseUrl}users/upload`, data, { headers }).subscribe((jsonData) => {
      console.log(jsonData);
    })
  }


  GetSearch(searchQuery: string, page: Number | null) {

    let args = `?q=${searchQuery}&page=${page}`;

    this.http.get<{ users: UserEntry[], totalusers: number, pageSize: number }>(`${this.baseUrl}users/search${args}`).subscribe((jsonData) => {
      this.userEntry = jsonData.users;
      this.totalusers = jsonData.totalusers;
      this.totalPages = Math.ceil(this.totalusers / jsonData.pageSize);
      console.log(this.totalusers, this.totalPages);
      this.userSubject.next(this.userEntry);
    })
  }



}
