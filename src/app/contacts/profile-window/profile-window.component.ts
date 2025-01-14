import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-window.component.html',
  styleUrl: './profile-window.component.scss'
})
export class ProfileWindowComponent {
  name: string = 'Steffen Hoffmann';  // Beispielname
  email: string = 'thehoffman@beispiel.com'; // Beispiel-E-Mail
  isActive: boolean = false; // Status standardmäßig 'abwesend'

  constructor() { }

  ngOnInit(): void {
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }
}
