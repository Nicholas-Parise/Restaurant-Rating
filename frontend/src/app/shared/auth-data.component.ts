import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserEntry } from './user-entry.model';

@Injectable({
  providedIn: 'root'
})

export class AuthDataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  loggedin: boolean | null = null;
  username: string;
  picture: string;
  userEntry: UserEntry;

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
        const token = response.token;
        if (token) {
          localStorage.setItem('authToken', token);
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
  }


  async getIsLoggedIn(): Promise<boolean> {
    console.log(this.loggedin);
    if (this.loggedin !== null) {
      return this.loggedin;
    }

    try {
       console.log("contacting server");
      const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);
      const response = await this.http.get<any>(`${this.baseUrl}auth/me`, { headers }).toPromise();

      this.loggedin = true;
      this.username = response.username;
      this.picture = response.picture;
      this.userEntry = response;
      console.log(this.userEntry);
      return true;

    } catch (error) {
      this.loggedin = false;
      return false;
    }
  }



  getUsername(): string {
    return this.username;
  }

  getPicture(): string {
    return this.picture;
  }

  getUserEntry():UserEntry{
    return this.userEntry;
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }





}
