import { Component } from '@angular/core';
import { ChatBoxComponent } from '../chat-box.component';
import { UserService } from '../../services/user.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})
export class AddUsersComponent {

  constructor (public chatBox: ChatBoxComponent, public userService: UserService) {}
}
