import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError,tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthDataService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'http://localhost:3000/';

  PostRegister(name:String, password:String, email:String): Observable<any> {

    var sendData = {"name":name, "password":password, "email":email};

    return this.http.post<any>(`${this.baseUrl}auth/register`,sendData).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  PostLogin(password:String, email:String): Observable<any> {
    const sendData = {"password":password, "email":email};

    return this.http.post<any>(`${this.baseUrl}auth/login`,sendData).pipe(
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
  
  static getToken(): string|null{
    return localStorage.getItem('authToken');
  }




}
