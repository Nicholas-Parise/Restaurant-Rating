import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ApiService {

    USE_COOKIES = environment.authMode === 'cookie';

    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));


    private get baseUrl(): string {
    if (isPlatformServer(this.platformId)) {
      const internal = (globalThis as any)?.process?.env?.INTERNAL_API_URL;
      if (internal) return internal;
    }
    return environment.apiEndpoint;
  }


getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('authToken') : null;
  }

    get<T>(url: string) {

        if (this.USE_COOKIES) {
            return this.http.get<T>(this.baseUrl + url, {
                withCredentials: true
            });
        }

        return this.http.get<T>(this.baseUrl + url, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`
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
                Authorization: `Bearer ${this.getToken()}`
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
                Authorization: `Bearer ${this.getToken()}`
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
                    Authorization: `Bearer ${this.getToken()}`
                },
                body: body
            };

        return this.http.delete<T>(this.baseUrl + url, options);
    }


}