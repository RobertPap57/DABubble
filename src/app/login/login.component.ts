import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  emailImg: string = '/mail-grey.png';
  lockImg: string = '/lock-grey.png';

  emailText: string = ''; // Speichert den Text im Emailfeld
  passwordText: string = ''; // Speichert den Text im Passwortfeld

  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-black.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-black.png';
    }
  }

  onBlur(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-grey.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-grey.png';
    }
  }

  onInput(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (field === 'email') {
      this.emailText = value;
      this.emailImg = value ? '/mail-black.png' : '/mail-grey.png';
    } else if (field === 'password') {
      this.passwordText = value;
      this.lockImg = value ? '/lock-black.png' : '/lock-grey.png';
    }
  }
}
