import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-window.component.html',
  styleUrl: './profile-window.component.scss'
})
export class ProfileWindowComponent {
  userId: string = '';
  isEditMode: boolean = false;
  onlineColor: string = '#92c73e';
  offlineColor: string = '#696969';
  name: string = 'Steffen Hoffmann';  // Beispielname
  email: string = 'thehoffman@beispiel.com'; // Beispiel-E-Mail
  picture: string = '/steffen-hoffmann-avatar.png';
  status: string = '';

  constructor(public userService: UserService) { }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  ngOnInit(): void {
    this.userService.users.forEach(user => {
      if (user.id === this.userService.loggedUserId) {
        this.userId = user.id;
        this.name = user.name;
        this.email = user.email;
        this.picture = user.userImage;
        this.status = user.status
      }
    });
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

  save(): void {
    this.userService.updateUserInfo(this.userId, this.name, this.picture);
  }

  cancel() {
    this.toggleEditMode();
  }
}
