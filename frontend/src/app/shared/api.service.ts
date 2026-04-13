import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthDataService } from './auth-data.component';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = environment.apiEndpoint;
    USE_COOKIES = environment.authMode === 'cookie';

    constructor(private http: HttpClient) { }

    get<T>(url: string) {

        if (this.USE_COOKIES) {
            return this.http.get<T>(this.baseUrl + url, {
                withCredentials: true
            });
        }

        return this.http.get<T>(this.baseUrl + url, {
            headers: {
                Authorization: `Bearer ${AuthDataService.getToken()}`
            }
        });
    }

    post<T>(url: string, body: any) {

        if (this.USE_COOKIES) {
            return this.http.post<T>(this.baseUrl + url, body, {
                withCredentials: true
            });
        }

        return this.http.post<T>(this.baseUrl + url, body, {
            headers: {
                Authorization: `Bearer ${AuthDataService.getToken()}`
            }
        });
    }

    put<T>(url: string, body: any) {

        if (this.USE_COOKIES) {
            return this.http.put<T>(this.baseUrl + url, body, {
                withCredentials: true
            });
        }

        return this.http.put<T>(this.baseUrl + url, body, {
            headers: {
                Authorization: `Bearer ${AuthDataService.getToken()}`
            }
        });
    }


    delete<T>(url: string, body: any | null = null) {

        const options: any = this.USE_COOKIES
            ? {
                withCredentials: true,
                body: body
            }
            : {
                headers: {
                    Authorization: `Bearer ${AuthDataService.getToken()}`
                },
                body: body
            };

        return this.http.delete<T>(this.baseUrl + url, options);
    }


}