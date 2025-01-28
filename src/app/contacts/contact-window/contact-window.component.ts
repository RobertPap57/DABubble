import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contact-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-window.component.html',
  styleUrl: './contact-window.component.scss'
})
export class ContactWindowComponent {
  onlineColor: string = '#92c73e';
  offlineColor: string = '#696969';
  name: string = 'Steffen Hoffmann';  // Beispielname
  email: string = 'thehoffman@beispiel.com'; // Beispiel-E-Mail
  picture: string = '/steffen-hoffmann-avatar.png';
  isActive: boolean = false; // Status standardmäßig 'abwesend'
  @Input({ required: true }) userId!: string;
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.users.forEach(user => {
      if (user.id == this.userId || user.id === this.userService.profileUserId) {
        this.name = user.name;
        this.email = user.email;
        this.picture = user.userImage;
        this.isActive = user.status == "online";
      }
    });
  }

  close(): void {
    this.onClose.emit();
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

  openDirectMessage() {
    this.userService.privMsgUserId = this.userId;
    this.close();
  }
}
