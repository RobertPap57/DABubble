import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { SlideSideBarComponent } from './slide-side-bar/slide-side-bar.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'sidebar', component: SlideSideBarComponent },
  { path: 'register', component: CreateAccountComponent },
  { path: 'avatar', component: ChooseAvatarComponent },
];
