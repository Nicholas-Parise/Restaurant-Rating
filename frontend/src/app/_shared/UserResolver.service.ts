import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { catchError, map, of } from 'rxjs';

import { UserEntry } from "./user-entry.model";
import { RestaurantEntry } from "./restaurant-entry.model";
import { ReviewEntry } from "./review-entry.model";

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
    constructor(private api: ApiService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        const username = route.params['username'];

        if (!username) {
            this.router.navigate(['/']);
            return of(null);
        }
/*
            userEntry: UserEntry;

            recentRestaurantEntry: RestaurantEntry[];

            favRestaurantEntry: RestaurantEntry[];

            reviewEntry: ReviewEntry[];
*/

        return this.getByUsername(username).pipe(
            map((data) => {
                return {
                    user: data.user || null,
                    favourite_restaurants: data.favourites || [],
                    recents: data.recents || [],
                    reviews: data.reviews || [],
                    totalReviews: data.totalReviews || 0                
                };
            }),
            catchError((err) => {
                if (err.status === 404) {
                    this.router.navigate(['/']);
                } else if (err.status >= 500) {
                    this.router.navigate(['/']);
                } else {
                    this.router.navigate(['/']);
                }

                return of(null);
            })
        );
    }

    getByUsername(username: string) {
        return this.api.get<{ user: UserEntry, favourites: RestaurantEntry[], recents: RestaurantEntry[], reviews: ReviewEntry[], totalReviews: number }>(
            `users/${username}`
        );
    }
}