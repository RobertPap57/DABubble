import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  constructor(private router: Router) {}

  lockImg: string = '/lock-grey.png';
  confirmLockImg: string = '/lock-grey.png';

  passwordText: string = '';
  confirmPasswordText: string = '';

  isHovered: boolean = false;

  isArrowHovered: boolean = false;

  isPasswordValid: boolean = true;

  /**
   * Updates the icon color of an input field when it gains focus.
   * Changes the icon to black if the field is focused and empty.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   */
  onFocus(field: string): void {
    if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-black.png';
    } else if (field === 'confirm' && !this.confirmPasswordText) {
      this.confirmLockImg = '/lock-black.png';
    }
  }

  /**
   * Updates the icon color of an input field when it loses focus.
   * Resets the icon to gray if the field is empty.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   */
  onBlur(field: string): void {
    if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-grey.png';
    } else if (field === 'confirm' && !this.confirmPasswordText) {
      this.confirmLockImg = '/lock-grey.png';
    }
  }

  /**
   * Updates the text and icon of an input field as the user types.
   * Changes the icon to black if the field is not empty, otherwise resets to gray.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   * @param {Event} event - The input event containing the user's input.
   */
  onInput(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (field === 'password') {
      this.passwordText = value;
      this.lockImg = value ? '/lock-black.png' : '/lock-grey.png';
    } else if (field === 'confirm') {
      this.confirmPasswordText = value;
      this.confirmLockImg = value ? '/lock-black.png' : '/lock-grey.png';
    }
  }

  /**
   * Toggles the hover state of the checkbox and updates the checkbox image.
   * @param {boolean} hoverState - Whether the checkbox is hovered.
   */
  onHover(hoverState: boolean): void {
    this.isHovered = hoverState;
  }

  /**
   * Handles the process of updating the password when the submit button is clicked.
   * Adds an overlay during submission and navigates to the login page upon success.
   */
  updatePw(): void {
    // Add overlay submit functionality here.
    this.router.navigate(['']);
  }

  /**
   * Enables or disables the password submission button based on a condition.
   * The button is enabled when the condition is true and disabled otherwise.
   * @param {boolean} condition - A condition that determines if the button should be enabled.
   */
  enableButton(condition: boolean): void {
    this.isPasswordValid = !condition;
  }
}
