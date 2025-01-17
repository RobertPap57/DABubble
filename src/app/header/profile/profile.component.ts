import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserIdService } from '../../services/user-id.service';

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
  userName = 'Max Mustermann';

  constructor(public userIdService: UserIdService, public userService: UserService) { }


  openEditUser() {
    //open the Edit User Component
  }
}
