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

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';


  GetUsers(){
    //return this.userEntry;
  }

  GetUserById(username:string){
    this.http.get<{user: UserEntry[], totalReviews: Number}>(`${this.baseUrl}users/${username}`).subscribe((jsonData) =>{
      this.userEntry = jsonData.user;
      this.userSubject.next(this.userEntry);
    })
  }

  GetUser(){

    const headers = new HttpHeaders().set('Authorization',  `Bearer ${AuthDataService.getToken()}`);

    this.http.get<{user: UserEntry[], totalReviews: Number}>(`${this.baseUrl}users`, { headers }).subscribe((jsonData) =>{
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


  uploadProfilePicture(data: FormData){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

     this.http.post<{ user: UserEntry[], message: string }>(`${this.baseUrl}users/upload`, data, { headers }).subscribe((jsonData) => {
      console.log(jsonData);
    })
  }




}
