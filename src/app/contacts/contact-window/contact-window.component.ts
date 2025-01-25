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
  name: string = 'Steffen Hoffmann';  // Beispielname
  email: string = 'thehoffman@beispiel.com'; // Beispiel-E-Mail
  picture: string =  '/steffen-hoffmann-avatar.png';
  isActive: boolean = false; // Status standardmäßig 'abwesend'
  @Input({required : true}) userId!: String;

  constructor(public userSerice: UserService) { }

  ngOnInit(): void {
    this.name = this.userSerice.userName;
    this.email = this.userSerice.email;
    this.picture = this.userSerice.userImage;
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

}
