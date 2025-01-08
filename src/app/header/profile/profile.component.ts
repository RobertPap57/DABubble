import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  userOnline = true;

  openEditUser() {
    //open the Edit User Component
  }
}
