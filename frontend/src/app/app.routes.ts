import { Routes } from '@angular/router';

import { DiaryComponent } from './pages/diary/diary.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from './pages/user/user.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { BookmarkedComponent } from './pages/bookmarked/bookmarked.component';
import { ListsComponent } from './pages/lists/lists.component';
import { ReportsComponent } from './pages/reports/reports.component';

import { AboutComponent } from './pages/about/about.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'Explore', component: ExploreComponent},
    {path: 'user/diary', component: DiaryComponent},
    {path: 'user/:username/diary', component: DiaryComponent},
    {path: 'List', component: ListsComponent},
    {path: 'List/:id', component: ListsComponent},
    {path: 'restaurant/:slug', component: RestaurantComponent},
    {path: 'restaurant', component: RestaurantComponent},
    {path: 'user/friends', component: FriendsComponent},
    {path: 'user/:username/friends', component: FriendsComponent},
    {path: 'user/bookmarked', component: BookmarkedComponent},
    {path: 'user/:username/bookmarked', component: BookmarkedComponent},
    {path: 'user/:username', component: UserComponent},
    {path: 'user', component: UserComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'reports', component: ReportsComponent},
    {path: 'reports/:target_type/:target_id', component: ReportsComponent},
    {path: 'about', component: AboutComponent},
    {path: 'privacy-policy', component: PrivacyPolicyComponent},
    {path: 'terms-of-service', component: TermsOfServiceComponent},
    {path: '**', component: HomeComponent, pathMatch: 'full'}
];
