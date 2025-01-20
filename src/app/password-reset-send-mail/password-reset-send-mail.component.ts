import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { getDocs, query, updateDoc } from '@angular/fire/firestore';
import { where } from '@firebase/firestore';

@Component({
  selector: 'app-password-reset-send-mail',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './password-reset-send-mail.component.html',
  styleUrl: './password-reset-send-mail.component.scss',
})
export class PasswordResetSendMailComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

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
    this.router.navigate(['']);
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

  post = {
    endPoint: 'https://dabubble.lars-schumacher.com/send-reset-link.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  /**
   * Handles the form submission, generates a token, and updates the user in Firestore.
   */
  onSubmit(): void {
    if (this.sendMail && this.emailText) {
      let token = this.generateToken();
      this.sendEmailWithToken(this.emailText, token);
      this.updateUserWithToken(this.emailText, token);
      this.router.navigate(['']);
    }
  }
  /**
   * Generates a random 32-byte token as a hexadecimal string.
   * @returns {string} - The generated token.
   */
  private generateToken(): string {
    let randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  /**
   * Sends an email with the token to the specified address.
   * @param {string} email - The email address to send the token to.
   * @param {string} token - The generated token to include in the email.
   */
  private sendEmailWithToken(email: string, token: string): void {
    let body = {
      email: email,
      token: token,
    };

    this.http.post(this.post.endPoint, this.post.body(body)).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending email:', error);
      },
      complete: () => {
        console.info('Email send operation complete.');
      },
    });
  }
  /**
   * Updates the user in Firestore by adding the generated token based on their email address.
   * @param {string} email - The email address of the user to update.
   * @param {string} token - The generated token to assign to the user.
   */
  private async updateUserWithToken(
    email: string,
    token: string
  ): Promise<void> {
    try {
      let userRef = this.userService.getallUsersdocRef();
      let emailQuery = query(userRef, where('email', '==', email));
      let querySnapshot = await getDocs(emailQuery);

      if (querySnapshot.empty) {
        console.error('User not found for the provided email address.');
        return;
      }

      querySnapshot.forEach(async (doc) => {
        let userDocRef = this.userService.getSingleUserDocRef('user', doc.id);
        await updateDoc(userDocRef, { token });
        console.log(`Token added successfully to user: ${email}`);
      });
    } catch (error) {
      console.error('Error updating user with token:', error);
    }
  }
}
