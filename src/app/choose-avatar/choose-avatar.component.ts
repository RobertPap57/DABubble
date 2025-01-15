import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss',
})
export class ChooseAvatarComponent {
  constructor(private router: Router, public userData: UserService) {}

  isArrowHovered: boolean = false;
  backArrowImage: string = '/back-arrow.png';

  avatarImages: string[] = [
    '/frederik-beck-avatar.png',
    '/elias-neumann-avatar.png',
    '/elise-roth-avatar.png',
    '/noah-braun-avatar.png',
    '/sofia-müller-avatar.png',
    '/steffen-hoffmann-avatar.png',
  ];

  selectedAvatar: string = '/default-user-avatar.png';

  /**
   * Navigates the user to the register page.
   */
  backToRegister(): void {
    this.router.navigate(['register']);
  }

  /**
   * Navigates the user back to the login page.
   */
  openLogin(): void {
    this.router.navigate(['login']);
    this.userData.userImage = this.selectedAvatar;
    this.userData.prepareNewUser();
    console.log([
      this.userData.userImage,
      this.userData.userName,
      this.userData.email,
      this.userData.password,
      this.userData.confirmPassword,
    ]);
  }

  /**
   * Toggles the hover state of the back arrow icon and updates its image.
   *
   * @param {boolean} hoverState - A boolean indicating whether the back arrow is being hovered.
   */
  onHoverArrow(hoverState: boolean): void {
    this.isArrowHovered = hoverState;
    this.updateArrowImage();
  }

  /**
   * Updates the back arrow icon image based on its hover state.
   * If the back arrow is hovered, the hover image is shown.
   * Otherwise, the default image is displayed.
   */
  updateArrowImage(): void {
    if (this.isArrowHovered) {
      this.backArrowImage = '/back-arrow-hover.png';
    } else {
      this.backArrowImage = '/back-arrow.png';
    }
  }

  /**
   * Updates the selected avatar with the clicked image.
   *
   * @param {string} avatarImage - The URL of the clicked avatar.
   */
  selectAvatar(avatarImage: string): void {
    this.selectedAvatar = avatarImage;
  }
}
