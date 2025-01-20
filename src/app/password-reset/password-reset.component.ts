import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  Firestore,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  token: string | null = null;
  lockImg: string = '/lock-grey.png';
  confirmLockImg: string = '/lock-grey.png';
  passwordText: string = '';
  confirmPasswordText: string = '';
  isPasswordValid: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => this.setToken(params));
  }

  /**
   * Sets the token from route parameters.
   * @param params The route parameters.
   */
  private setToken(params: ParamMap): void {
    this.token = params.get('token');
  }

  /**
   * Updates the icon color of an input field when it gains focus.
   * @param field The name of the field (password or confirm).
   */
  onFocus(field: string): void {
    if (this.isPasswordField(field)) {
      this.lockImg = '/lock-black.png';
    } else if (this.isConfirmField(field)) {
      this.confirmLockImg = '/lock-black.png';
    }
  }

  /**
   * Checks if the field is password.
   * @param field The name of the field.
   * @returns True if the field is password.
   */
  private isPasswordField(field: string): boolean {
    return field === 'password' && !this.passwordText;
  }

  /**
   * Checks if the field is confirm password.
   * @param field The name of the field.
   * @returns True if the field is confirm password.
   */
  private isConfirmField(field: string): boolean {
    return field === 'confirm' && !this.confirmPasswordText;
  }

  /**
   * Updates the icon color of an input field when it loses focus.
   * @param field The name of the field (password or confirm).
   */
  onBlur(field: string): void {
    if (this.isPasswordField(field)) {
      this.lockImg = '/lock-grey.png';
    } else if (this.isConfirmField(field)) {
      this.confirmLockImg = '/lock-grey.png';
    }
  }

  /**
   * Updates the text and icon of an input field as the user types.
   * @param field The name of the field (password or confirm).
   * @param event The input event.
   */
  onInput(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updatePasswordField(field, value);
    this.enableButton(this.isFormValid());
  }

  /**
   * Updates the password or confirm field and icon based on input.
   * @param field The name of the field.
   * @param value The current input value.
   */
  private updatePasswordField(field: string, value: string): void {
    if (field === 'password') {
      this.passwordText = value;
      this.lockImg = value ? '/lock-black.png' : '/lock-grey.png';
    } else if (field === 'confirm') {
      this.confirmPasswordText = value;
      this.confirmLockImg = value ? '/lock-black.png' : '/lock-grey.png';
    }
  }

  /**
   * Checks if the form is valid based on password length and match.
   * @returns True if the passwords are valid and match.
   */
  private isFormValid(): boolean {
    return (
      this.passwordText.length >= 8 &&
      this.passwordText === this.confirmPasswordText
    );
  }

  /**
   * Enables or disables the password submission button.
   * @param condition The condition to enable the button.
   */
  enableButton(condition: boolean): void {
    this.isPasswordValid = !condition;
  }

  /**
   * Updates the user's password in Firestore if the token is valid.
   */
  async updatePw(): Promise<void> {
    if (!this.token) return;
    try {
      await this.processPasswordUpdate();
    } catch (error) {
      console.error('Error updating password:', error);
    }
  }

  /**
   * Processes the password update in Firestore.
   */
  private async processPasswordUpdate(): Promise<void> {
    const usersRef = collection(this.firestore, 'user');
    const tokenQuery = query(usersRef, where('token', '==', this.token));
    const querySnapshot = await getDocs(tokenQuery);

    if (querySnapshot.empty) return;

    querySnapshot.forEach(async (docSnap) => {
      await this.updateUserPassword(docSnap);
    });
  }

  /**
   * Updates the user's password in Firestore and navigates to home.
   * @param docSnap The document snapshot of the user.
   */
  private async updateUserPassword(
    docSnap: QueryDocumentSnapshot
  ): Promise<void> {
    const userDocRef = doc(this.firestore, 'user', docSnap.id);
    await updateDoc(userDocRef, {
      password: this.passwordText,
      token: null,
    });
    console.log('Password successfully updated');
    this.router.navigate(['']);
  }
}
