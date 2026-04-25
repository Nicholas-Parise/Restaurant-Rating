import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserEntry } from './user-entry.model';
import { ApiService } from './api.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AuthDataService {

  constructor(private api: ApiService) {}

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private loggedin: boolean | null = null;
  private userEntry: UserEntry;
  private loginCheckPromise: Promise<boolean> | null = null;

  PostRegister(username: String, password: String, email: String): Observable<any> {

    var sendData = { "username": username, "password": password, "email": email };

    return this.api.post<any>(`auth/register`, sendData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  PostLogin(password: String, email: String): Observable<any> {
    const sendData = { "password": password, "email": email };

    return this.api.post<any>(`auth/login`, sendData).pipe(
      tap(response => {
        if (response.token) {
          const token = response.token;
          localStorage.setItem('authToken', token);
          this.loggedin = true;
          this.userEntry = response;
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    forgot(email: String): Observable<any> {
    const sendData = { "email": email };
    return this.api.post<any>(`auth/forgot-password`, sendData).pipe(
      tap(response => {}),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

    reset(sendData: any): Observable<any> {
    return this.api.post<any>(`auth/reset-password`, sendData).pipe(
      tap(response => {}),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }





  signOut(): void {
    this.api.post<{ message: string }>(`auth/logout`, null).subscribe((jsonData) => {
      console.log(jsonData);
    })
    localStorage.removeItem("authToken");
    this.loginCheckPromise = null;
  }


  async getIsLoggedIn(): Promise<boolean> {

    if (this.loggedin !== null) {
      return this.loggedin;
    }

    if(this.loginCheckPromise){
      return this.loginCheckPromise;
    }

    if (this.isBrowser) return false;

    console.log("contacting server");

    this.loginCheckPromise = this.api
      .get<any>(`auth/me`)
      .toPromise()
      .then(response => {

        this.loggedin = true;
        this.userEntry = response;
        return true;
      })
      .catch(() => {
        this.loggedin = false;
        return false;
      })
      .finally(() => {
        // allow future refresh if needed
        this.loginCheckPromise = null;
      });

    return this.loginCheckPromise;
  }


  getIsValidUsername(username: null | string) {

    return this.api.get<{ message: string }>(`auth/username/${username}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  getUsername(): string {
    return this.userEntry.username;
  }

  getPicture(): string {
    return this.userEntry.picture;
  }

  getUserEntry(): UserEntry {
    return this.userEntry;
  }

  getIsMod(): boolean{
    return (this.userEntry.permissions == "admin" || this.userEntry.permissions == "moderator");
  }




}
