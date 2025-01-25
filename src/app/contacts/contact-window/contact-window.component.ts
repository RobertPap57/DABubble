import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ required: true }) userId!: String;

  constructor(public userSerice: UserService) { }

  ngOnInit(): void {
    this.userSerice.users.forEach(user => {
      if (user.id == this.userId) {
        this.name = user.name;
        this.email = user.email;
        this.picture = user.userImage;
        this.isActive = user.status == "online";
      }
    });
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

}
