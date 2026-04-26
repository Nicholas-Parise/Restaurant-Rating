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
import { ContactsComponent } from './pages/contacts/contacts.component';

import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import { ForgotComponent } from './pages/forgot/forgot.component';
import { RecoverComponent } from './pages/recover/recover.component';

import { AboutComponent } from './pages/about/about.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

import { RestaurantResolver } from './_shared/RestaurantResolver.service';
import { UserResolver } from './_shared/UserResolver.service';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'Explore', component: ExploreComponent },
    //{path: 'restaurant/:slug', component: RestaurantComponent},
    {
        path: 'restaurant/:slug',
        component: RestaurantComponent,
        resolve: {
            restaurantData: RestaurantResolver
        }
    },
    {
        path: 'user/:username',
        component: UserComponent,
        resolve: {
            userData: UserResolver
        }
    },
    { path: 'user/:username/diary', component: DiaryComponent },
    { path: 'user/:username/friends', component: FriendsComponent },
    { path: 'user/:username/bookmarked', component: BookmarkedComponent },

    { path: 'List', component: ListsComponent },
    { path: 'List/:id', component: ListsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'reports/:target_type/:target_id', component: ReportsComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'contacts/:contact_id', component: ContactsComponent },
    { path: 'complete-profile', component: CompleteProfileComponent },
    { path: 'about', component: AboutComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-of-service', component: TermsOfServiceComponent },
    { path: 'forgot', component: ForgotComponent },

    { path: 'recover', component: RecoverComponent },
    { path: 'recover/:recover_id', component: RecoverComponent },

    { path: '**', component: HomeComponent, pathMatch: 'full' }
];
