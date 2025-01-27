import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FeedbackOverlayComponent } from '../feedback-overlay/feedback-overlay.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, FeedbackOverlayComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild(FeedbackOverlayComponent)
  feedbackOverlay!: FeedbackOverlayComponent;

  constructor(private router: Router, private userService: UserService) {}

  emailImg: string = './mail-grey.png';
  lockImg: string = './lock-grey.png';
  visibilityIcon: string = './visibility_off.png';
  visibilityOnIcon: string = './visibility.png';
  passwordFieldType: string = 'password';

  emailText: string = '';
  passwordText: string = '';
  showError: boolean = false;
  loginUser: boolean = false;
  loginGuest: boolean = true;
  regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  guestUrl: string = '0LxX4SgAJLMdrMynLbem';

  /**
   * Handles the mouse down event on the visibility icon.
   * Changes the password field type to 'text' to display the password
   * and updates the visibility icon to indicate that the password is visible.
   */
  onMouseDown(): void {
    this.passwordFieldType = 'text';
    this.visibilityIcon = this.visibilityOnIcon;
  }

  /**
   * Handles the mouse up event on the visibility icon.
   * Changes the password field type back to 'password' to hide the password
   * and restores the visibility icon to its default state.
   */
  onMouseUp(): void {
    this.passwordFieldType = 'password';
    this.visibilityIcon = './visibility_off.png';
  }

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
      if (loginSuccessful) {
        this.emailText = '';
        this.passwordText = '';
        this.showError = false;
        this.loginUser = false;
        this.feedbackOverlay.showFeedback('Anmelden');
      }
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
    this.enableButton(this.isFormValid());
  }

  /**
   * Enables or disables the email submission button.
   * @param {boolean} isValid - Whether the email is valid.
   */
  enableButton(isValid: boolean | null | undefined): void {
    this.loginUser = !!isValid;
  }

  /**
   * Checks if the form is valid based on password length and match.
   * @returns True if the passwords are valid and match.
   */
  private isFormValid(): boolean {
    return this.regexp.test(this.emailText); // Überprüft die E-Mail-Adresse
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

  guestLogin(): void {
    this.loginGuest = false;
    this.userService.finalizeLogin(this.guestUrl);
    this.feedbackOverlay.showFeedback('Anmelden');
  }
}
