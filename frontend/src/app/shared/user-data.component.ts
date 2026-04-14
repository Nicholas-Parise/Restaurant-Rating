import { Injectable } from '@angular/core';
import { UserEntry } from './user-entry.model';
import { catchError, Observable, Subject, throwError } from 'rxjs';

import { ToastService } from '../shared/toast.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  userEntry: UserEntry;
  userSubject = new Subject<UserEntry>();

  friendEntry: UserEntry[] = [];
  friendSubject = new Subject<UserEntry[]>();

  userSearchEntry: UserEntry[] = [];
  userSearchSubject = new Subject<UserEntry[]>();

  totalusers: number = 0;
  totalPages: number = 0;

  constructor(private api: ApiService, private toast: ToastService) { }

  GetUserById(username: string) {
    this.api.get<{ user: UserEntry, totalReviews: Number }>(`users/${username}`).subscribe((jsonData) => {
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })
  }

  GetUser() {
    this.api.get<{ user: UserEntry, totalReviews: Number }>(`users`)
      .subscribe((jsonData) => {
        this.userEntry = jsonData.user;
        this.userSubject.next(this.userEntry);
      })
  }


  editUser(singleUserEntry: any) {
    this.api.put<{ user: UserEntry, message: string }>(`users`, singleUserEntry).subscribe((jsonData) => {
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })

    //this.userEntry.push(singleUserEntry);
    //this.userSubject.next(this.userEntry);
  }

  completeAccount(singleUserEntry: any): Observable<any> {
    return this.api.put<{ user: UserEntry, message: string }>(`users/complete`, singleUserEntry).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  deleteAccount(password: string) {
    const sendData = { "password": password };
    this.api.post<{ message: string }>(`users/delete`, sendData).subscribe((jsonData) => {
      console.log("Delete account");
    })

  }



  friendUser(username: string): void {
    this.api.post<{ user: UserEntry[], message: string }>(`friends/${username}`, {}).subscribe((jsonData) => {
      // this.userEntry = jsonData.user;
      // this.userSubject.next(this.userEntry);
      console.log("friend request sent");
    })
  }

  acceptFriendUser(username: string): void {
    this.api.post<{ user: UserEntry[], message: string }>(`friends/${username}/accept`, {}).subscribe((jsonData) => {
      console.log("Accepted friend request");
    })
  }

  denyFriendUser(username: string): void {
    this.api.post<{ user: UserEntry[], message: string }>(`friends/${username}/deny`, {}).subscribe((jsonData) => {
      console.log("denied friend request");
    })
  }

  removeFriendUser(username: string): void {
    this.api.delete<{ user: UserEntry[], message: string }>(`friends/${username}`).subscribe((jsonData) => {
      console.log("removed friend");
    })
  }


  GetFriends() {
    this.api.get<{ user: UserEntry[], totalReviews: Number }>(`friends`).subscribe((jsonData) => {
      this.friendEntry = jsonData.user;
      this.friendSubject.next(this.friendEntry);
    })
  }

  GetFriendsById(username: string) {
    this.api.get<{ user: UserEntry[], totalReviews: Number }>(`friends/${username}`).subscribe((jsonData) => {
      this.friendEntry = jsonData.user;
      this.friendSubject.next(this.friendEntry);
    })
  }



  uploadProfilePicture(data: FormData) {
    this.api.post<{ imageUrl: string, message: string }>(`users/upload`, data).subscribe((jsonData) => {
      console.log(jsonData);

      console.log(this.userEntry);
      this.userEntry.picture = jsonData.imageUrl;
      this.userSubject.next(this.userEntry);
    })
  }


  GetSearch(searchQuery: string, page: Number | null) {

    let args = `?q=${searchQuery}&page=${page}`;

    this.api.get<{ users: UserEntry[], totalusers: number, pageSize: number }>(`users/search${args}`).subscribe((jsonData) => {
      this.userSearchEntry = jsonData.users;
      this.totalusers = jsonData.totalusers;
      this.totalPages = Math.ceil(this.totalusers / jsonData.pageSize);
      console.log(this.totalusers, this.totalPages);
      this.userSearchSubject.next(this.userSearchEntry);
    })
  }


}
