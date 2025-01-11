import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'sidebar', component: SideNavBarComponent },
  { path: 'home', component: HomeComponent },
];
