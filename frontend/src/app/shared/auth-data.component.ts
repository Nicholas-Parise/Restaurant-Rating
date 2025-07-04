import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthDataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  loggedin: boolean | null = null;

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

  verifyToken(){

    const headers = new HttpHeaders().set('Authorization', `Bearer ${AuthDataService.getToken()}`);

    this.http.get<HttpResponse<any>>(`${this.baseUrl}auth/me`, { headers, observe: 'response' }).subscribe((response: HttpResponse<any>) => {
      console.log(response.status) // log status code

      if (response.status == 200) {
        this.loggedin = true;
      } else {
        this.loggedin = false;
      }

    }, (e: HttpErrorResponse) => console.log(e.status))

  }

  getIsLoggedIn(): boolean|null{

    if(this.loggedin == null){
      this.verifyToken();
    }
    return this.loggedin;
  }


  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }





}
