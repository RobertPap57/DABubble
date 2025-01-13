import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-window.component.html',
  styleUrl: './contact-window.component.scss'
})
export class ContactWindowComponent {
  name: string = 'Steffen Hoffmann';
  isActive: boolean = false; // Standardmäßig auf 'abwesend'

  constructor() { }

  ngOnInit(): void {
  }

  // Diese Methode könnte verwendet werden, um den Status von einer Datenbank abzurufen
  fetchStatusFromDatabase() {
  }

}
