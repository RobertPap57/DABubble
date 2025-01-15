import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private userService: UserService) {}

  emailImg: string = '/mail-grey.png';
  lockImg: string = '/lock-grey.png';

  emailText: string = '';
  passwordText: string = '';
  showError: boolean = false;

  async onLogin() {
    try {
      this.showError = false;
      const loginSuccessful = await this.userService.loginUser(
        this.emailText,
        this.passwordText
      );
      if (!loginSuccessful) {
        this.showError = true;
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      this.showError = true;
    }
  }

  /**
   * Handles the focus event for an input field.
   * Updates the icon color to black when the input field is focused,
   * provided the corresponding field is empty.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   */
  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-black.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-black.png';
    }
  }

  /**
   * Handles the blur event for an input field.
   * Resets the icon color to gray when the input field loses focus,
   * provided the corresponding field is empty.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   */
  onBlur(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-grey.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-grey.png';
    }
  }

  /**
   * Handles the input event for an input field.
   * Updates the text and icon color dynamically as the user types.
   * If the field is empty, the icon is reset to gray; otherwise, it is set to black.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   * @param {Event} event - The input event containing the user's input.
   */
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

  openResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
