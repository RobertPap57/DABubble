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

  emailImg: string = './mail-grey.png';
  lockImg: string = './lock-grey.png';

  emailText: string = '';
  passwordText: string = '';
  showError: boolean = false;

  /**
   * Handles the login process, showing errors if login fails.
   */
  async onLogin(): Promise<void> {
    try {
      this.showError = false;
      let loginSuccessful = await this.userService.loginUser(
        this.emailText,
        this.passwordText
      );

      if (!loginSuccessful) {
        this.showError = true;
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.showError = true;
    }
  }

  /**
   * Updates the input field's icon color when it gains focus.
   * Changes the icon to black if the input field is empty.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   */
  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.updateIcon('email', true);
    } else if (field === 'password' && !this.passwordText) {
      this.updateIcon('password', true);
    }
  }

  /**
   * Resets the input field's icon color when it loses focus.
   * Changes the icon to gray if the input field is empty.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   */
  onBlur(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.updateIcon('email', false);
    } else if (field === 'password' && !this.passwordText) {
      this.updateIcon('password', false);
    }
  }

  /**
   * Handles user input and dynamically updates the icon color based on the field's content.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   * @param {Event} event - The input event containing the user's input.
   */
  onInput(field: string, event: Event): void {
    let value = (event.target as HTMLInputElement).value;

    if (field === 'email') {
      this.emailText = value;
      this.updateIcon('email', !!value);
    } else if (field === 'password') {
      this.passwordText = value;
      this.updateIcon('password', !!value);
    }
  }

  /**
   * Updates the icon for the specified input field based on its state.
   *
   * @param {string} field - The name of the input field ('email' or 'password').
   * @param {boolean} isFocusedOrFilled - Whether the field is focused or filled.
   */
  private updateIcon(field: string, isFocusedOrFilled: boolean): void {
    let color = isFocusedOrFilled ? 'black' : 'grey';

    if (field === 'email') {
      this.emailImg = `/mail-${color}.png`;
    } else if (field === 'password') {
      this.lockImg = `/lock-${color}.png`;
    }
  }

  /**
   * Navigates to the reset password page.
   */
  openResetPassword(): void {
    this.router.navigate(['/reset-password']);
  }
}
