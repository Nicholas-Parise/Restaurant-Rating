import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { catchError, map, of } from 'rxjs';
import { RestaurantEntry } from "./restaurant-entry.model";
import { ReviewEntry } from "./review-entry.model";


@Injectable({ providedIn: 'root' })
export class RestaurantResolver implements Resolve<any> {
    constructor(private api: ApiService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        const slug = route.params['slug'];

        if (!slug) {
            this.router.navigate(['/']);
            return of(null);
        }

        const id = slug.split('-').pop();

        if (!id) {
            this.router.navigate(['/']);
            return of(null);
        }

        return this.getById(id).pipe(
            map((data) => {
                return {
                    restaurant: data.restaurants || null,
                    reviews: data.reviews || []
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

    getById(id: number) {
        return this.api.get<{ restaurants: RestaurantEntry[], reviews: ReviewEntry[] }>(
            `restaurants/${id}`
        );
    }
}