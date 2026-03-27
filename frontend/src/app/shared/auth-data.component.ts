import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserEntry } from './user-entry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthDataService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.apiEndpoint;

  private loggedin: boolean | null = null;
  private userEntry: UserEntry;
  private loginCheckPromise: Promise<boolean> | null = null;

  PostRegister(username: String, password: String, email: String): Observable<any> {

    var sendData = { "username": username, "password": password, "email": email };

    return this.http.post<any>(`${this.baseUrl}auth/register`, sendData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  PostLogin(password: String, email: String): Observable<any> {
    const sendData = { "password": password, "email": email };

    return this.http.post<any>(`${this.baseUrl}auth/login`, sendData).pipe(
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


  signOut(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.post<{ message: string }>(`${this.baseUrl}auth/logout`, {}, { headers }).subscribe((jsonData) => {
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
    console.log("contacting server");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.loginCheckPromise = this.http
      .get<any>(`${this.baseUrl}auth/me`, { headers })
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

    return this.http.get<{ message: string }>(`${this.baseUrl}auth/username/${username}`).pipe(
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

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }


}
