import { Routes } from '@angular/router';
import { DiaryComponent } from './diary/diary.component';
import { ExploreComponent } from './explore/explore.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { TagComponent } from './tag/tag.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FriendsComponent } from './friends/friends.component';
import { BookmarkedComponent } from './bookmarked/bookmarked.component';
import { ListsComponent } from './lists/lists.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'Diary', component: DiaryComponent},
    {path: 'Explore', component: ExploreComponent},
    {path: 'List', component: ListsComponent},
    {path: 'restaurant/:id', component: RestaurantComponent},
    {path: 'restaurant', component: RestaurantComponent},
    {path: 'user/friends', component: FriendsComponent},
    {path: 'user/:username/friends', component: FriendsComponent},
    {path: 'user/bookmarked', component: BookmarkedComponent},
    {path: 'user/:username/bookmarked', component: BookmarkedComponent},
    {path: 'user/:username', component: UserComponent},
    {path: 'user', component: UserComponent},
    {path: 'tag/:id', component: TagComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
