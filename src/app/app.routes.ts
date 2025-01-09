import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { CreateAccountComponent } from './create-account/create-account.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'sidebar', component: SideNavBarComponent },
  { path: 'register', component: CreateAccountComponent },
];
