import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-password-reset-send-mail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset-send-mail.component.html',
  styleUrl: './password-reset-send-mail.component.scss',
})
export class PasswordResetSendMailComponent {
  constructor(private router: Router, private userService: UserService) {}

  emailImg: string = '/mail-grey.png';

  emailText: string = '';

  isHovered: boolean = false;
  currentImage: string = '/check-field.png';

  isArrowHovered: boolean = false;
  backArrowImage: string = '/back-arrow.png';

  sendMail: boolean = false;

  /**
   * Navigates the user back to the login page.
   */
  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Updates the icon color of an input field when it gains focus.
   * Changes the icon to black if the field is focused and empty.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   */
  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-black.png';
    }
  }

  /**
   * Updates the icon color of an input field when it loses focus.
   * Resets the icon to gray if the field is empty.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   */
  onBlur(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-grey.png';
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

    if (field === 'email') {
      this.emailText = value;
      this.emailImg = value ? '/mail-black.png' : '/mail-grey.png';
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
   * Toggles the hover state of the back arrow icon and updates its image.
   * @param {boolean} hoverState - Whether the back arrow is hovered.
   */
  onHoverArrow(hoverState: boolean): void {
    this.isArrowHovered = hoverState;
    this.updateArrowImage();
  }

  /**
   * Updates the back arrow icon image based on its hover state.
   * Displays a hover-specific image if hovered, otherwise displays the default image.
   */
  updateArrowImage(): void {
    if (this.isArrowHovered) {
      this.backArrowImage = '/back-arrow-hover.png';
    } else {
      this.backArrowImage = '/back-arrow.png';
    }
  }

  enableButton(isValid: boolean | null | undefined): void {
    this.sendMail = !!isValid;
  }

  async onSendResetEmail(): Promise<void> {
    await this.userService.sendPasswordResetEmail(this.emailText);
  }
}
