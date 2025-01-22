import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-window.component.html',
  styleUrl: './profile-window.component.scss'
})
export class ProfileWindowComponent {
  isEditMode: boolean = true;
  name: string = 'Steffen Hoffmann';  // Beispielname
  email: string = 'thehoffman@beispiel.com'; // Beispiel-E-Mail
  picture: string =  '/steffen-hoffmann-avatar.png';
  isActive: boolean = false; // Status standardmäßig 'abwesend'

  constructor(public userService: UserService) { }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  ngOnInit(): void {
    this.name = this.userService.userName;
    this.email = this.userService.email;
    this.picture = this.userService.userImage;
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

  save() {
    this.toggleEditMode();
  }

  cancel() {
    this.toggleEditMode();
  }
}
