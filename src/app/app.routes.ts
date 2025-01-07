import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';

export const routes: Routes = [
    { path: 'header', component: HeaderComponent },
    { path: 'sideBar', component: SideNavBarComponent },
];
