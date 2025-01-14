import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(private router: Router, public userData: UserService) {}

  emailImg: string = '/mail-grey.png';
  lockImg: string = '/lock-grey.png';
  userNameImg: string = '/user-name-icon-grey.png';
  confirmLockImg: string = '/lock-grey.png';

  emailText: string = '';
  passwordText: string = '';
  confirmPasswordText: string = '';
  userNameText: string = '';

  isChecked: boolean = false;
  isHovered: boolean = false;
  showError: boolean = false;
  currentImage: string = '/check-field.png';

  isArrowHovered: boolean = false;
  backArrowImage: string = '/back-arrow.png';

  createUser() {
    this.userData.userName = this.userNameText;
    this.userData.email = this.emailText;
    this.userData.password = this.passwordText;
    this.userData.confirmPassword = this.confirmPasswordText;
    console.log([
      this.userData.userName,
      this.userData.email,
      this.userData.password,
      this.userData.confirmPassword,
    ]);
  }

  /**
   * Navigates the user back to the login page.
   */
  backToLogin(): void {
    this.router.navigate(['login']);
  }

  /**
   * Handles navigation to the avatar selection page.
   * Displays error messages if fields are invalid or passwords do not match.
   */
  openAvatar(): void {
    const allFieldsFilled =
      this.emailText &&
      this.passwordText &&
      this.confirmPasswordText &&
      this.userNameText;
    const passwordsMatch = this.passwordText === this.confirmPasswordText;

    if (!allFieldsFilled || !passwordsMatch || !this.isChecked) {
      this.showError = true;
    } else {
      this.showError = false;
      this.router.navigate(['avatar']);
      this.createUser();
    }
  }

  /**
   * Updates the icon color of an input field when it gains focus.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
   */
  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-black.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-black.png';
    } else if (field === 'confirm' && !this.confirmPasswordText) {
      this.confirmLockImg = '/lock-black.png';
    } else if (field === 'userName' && !this.userNameText) {
      this.userNameImg = '/user-name-icon-black.png';
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
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-grey.png';
    } else if (field === 'confirm' && !this.confirmPasswordText) {
      this.confirmLockImg = '/lock-grey.png';
    } else if (field === 'userName' && !this.userNameText) {
      this.userNameImg = '/user-name-icon-grey.png';
    }
  }

  /**
   * Updates the text and icon of an input field as the user types.
   * Includes password matching validation for confirmPassword.
   * @param {string} field - The input field name ('email', 'password', or 'userName').
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
    } else if (field === 'confirm') {
      this.confirmPasswordText = value;
      this.confirmLockImg = value ? '/lock-black.png' : '/lock-grey.png';
      if (
        this.passwordText === this.confirmPasswordText &&
        this.confirmPasswordText == ''
      ) {
        this.showError = false;
      }
    } else if (field === 'userName') {
      this.userNameText = value;
      this.userNameImg = value
        ? '/user-name-icon-black.png'
        : '/user-name-icon-grey.png';
    }
  }

  /**
   * Toggles the hover state of the checkbox and updates the checkbox image.
   * @param {boolean} hoverState - Whether the checkbox is hovered.
   */
  onHover(hoverState: boolean): void {
    this.isHovered = hoverState;
    this.updateImage();
  }

  /**
   * Toggles the checked state of the checkbox and updates the checkbox image.
   */
  onClick(): void {
    this.isChecked = !this.isChecked;
    this.updateImage();
  }

  /**
   * Updates the checkbox image based on its checked and hover states.
   */
  updateImage(): void {
    if (this.isChecked && this.isHovered) {
      this.currentImage = '/check-field-checkmarked-hover.png';
    } else if (this.isChecked) {
      this.currentImage = '/check-field-checkmarked.png';
    } else if (this.isHovered) {
      this.currentImage = '/check-field-hover.png';
    } else {
      this.currentImage = '/check-field.png';
    }
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
   */
  updateArrowImage(): void {
    if (this.isArrowHovered) {
      this.backArrowImage = '/back-arrow-hover.png';
    } else {
      this.backArrowImage = '/back-arrow.png';
    }
  }
}
