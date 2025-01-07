import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'sidebar', component: SideNavBarComponent },
];
