import { Routes } from '@angular/router';
import { DiaryComponent } from './diary/diary.component';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'Diary', component: DiaryComponent},
    {path: 'Explore', component: ExploreComponent},
    {path: 'user', component: UserComponent},
    {path: 'restaurant/:id', component: RestaurantComponent},
    {path: 'restaurant', component: RestaurantComponent},
    {path: 'user/:username', component: UserComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
