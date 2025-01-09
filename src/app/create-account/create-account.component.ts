import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(private router: Router) {}

  emailImg: string = '/mail-grey.png';
  lockImg: string = '/lock-grey.png';
  userNameImg: string = '/user-name-icon-grey.png';

  emailText: string = '';
  passwordText: string = '';
  userNameText: string = '';

  isChecked: boolean = false;
  isHovered: boolean = false;
  showError: boolean = false;
  currentImage: string = '/check-field.png';

  isArrowHovered: boolean = false;
  backArrowImage: string = '/back-arrow.png';

  backToLogin(): void {
    this.router.navigate(['']);
  }

  openAvatar(): void {
    if (!this.isChecked) {
      this.showError = true;
    } else {
      this.showError = false;
      this.router.navigate(['/avatar']);
    }
  }

  onFocus(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-black.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-black.png';
    } else if (field === 'userName' && !this.userNameText) {
      this.userNameImg = '/user-name-icon-black.png';
    }
  }

  onBlur(field: string): void {
    if (field === 'email' && !this.emailText) {
      this.emailImg = '/mail-grey.png';
    } else if (field === 'password' && !this.passwordText) {
      this.lockImg = '/lock-grey.png';
    } else if (field === 'userName' && !this.userNameText) {
      this.userNameImg = '/user-name-icon-grey.png';
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
    } else if (field === 'userName') {
      this.passwordText = value;
      this.userNameImg = value
        ? '/user-name-icon-black.png'
        : '/user-name-icon-grey.png';
    }
  }

  onHover(hoverState: boolean): void {
    this.isHovered = hoverState;
    this.updateImage();
  }

  onClick(): void {
    this.isChecked = !this.isChecked;
    this.updateImage();
  }

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

  onHoverArrow(hoverState: boolean): void {
    this.isArrowHovered = hoverState;
    this.updateArrowImage();
  }

  updateArrowImage(): void {
    if (this.isArrowHovered) {
      this.backArrowImage = '/back-arrow-hover.png';
    } else {
      this.backArrowImage = '/back-arrow.png';
    }
  }
}
