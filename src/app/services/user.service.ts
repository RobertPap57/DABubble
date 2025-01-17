import { Injectable, inject } from '@angular/core';
import { User } from '../interfaces/user.model';
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  DocumentData,
  Firestore,
  onSnapshot,
  QuerySnapshot,
  query,
  where,
  getDocs,
  DocumentReference,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersUpdated = new Subject<User[]>();
  users: User[] = [];
  firestore: Firestore = inject(Firestore);
  userId: string = '';
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userImage: string = '';

  unsubUserList;

  constructor(private router: Router) {
    this.unsubUserList = this.subUserList();
  }

  subUserList() {
    return onSnapshot(
      this.getallUsersdocRef(),
      (list: QuerySnapshot<DocumentData>) => {
        this.users = [];
        list.forEach((element) => {
          // console.log(this.setUserObject(element.data(), element.id));
          this.users.push(this.setUserObject(element.data(), element.id));
        });
        this.usersUpdated.next([...this.users]);
      }
    );
  }

  /**
   * Add a new document with a generated id to the firestore
   *
   * @param user the User Array
   */
  async createUser(user: User) {
    await addDoc(this.getallUsersdocRef(), user)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef);
      });
  }

  /**
   * checks if the Object has all the User-Object
   *
   * @param obj The Object from the input
   * @param id the id that is generated from the object
   * @returns an User-Object
   */
  setUserObject(obj: any, id: string): User {
    return {
      id: id || '',
      name: obj.name,
      userImage: obj.userImage,
      email: obj.email,
      password: obj.password,
      status: obj.status,
      lastSeen: obj.lastSeen,
    };
  }

  /**
   * gets the reference for the 'user' collection
   *
   * @returns
   */
  getallUsersdocRef() {
    return collection(this.firestore, 'user');
  }

  /**
   * gets the reference of a specific user in the collection 'user'
   *
   * @param colId
   * @param docId
   * @returns
   */
  getSingleUserDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Prepares and uploads new user data to Firestore.
   */
  uploadUserData(): void {
    const newUser = this.prepareNewUser();
    this.saveUserToFirestore(newUser);
  }

  /**
   * Prepares a new user object based on the current input data.
   * @returns {User} - The new user object to be uploaded.
   */
  private prepareNewUser(): User {
    return {
      id: '',
      name: this.userName,
      email: this.email,
      password: this.password,
      userImage: this.userImage,
      status: '',
      lastSeen: new Date(),
    };
  }

  /**
   * Saves the user object to Firestore and handles success or error responses.
   * @param {User} user - The user object to be saved in Firestore.
   */
  public saveUserToFirestore(user: User): void {
    this.createUser(user)
      .then(() => {
        console.log('User data successfully uploaded.');
      })
      .catch((error) => {
        console.error('Error uploading user data:', error);
      });
  }

  /**
   * Handles user login by validating email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<boolean>} - Returns true if login is successful, otherwise false.
   */
  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      const querySnapshot = await this.getUserByEmail(email);
      if (querySnapshot.empty) {
        this.handleLoginError('User not found. Please try again.');
        return false;
      }

      const loginSuccessful = await this.processLogin(querySnapshot, password);
      if (!loginSuccessful) {
        this.handleLoginError('Incorrect password.');
      }

      return loginSuccessful;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * Retrieves user documents from Firestore by email.
   * @param {string} email - The email of the user to query.
   * @returns {Promise<QuerySnapshot>} - A snapshot of matching user documents.
   */
  private async getUserByEmail(
    email: string
  ): Promise<QuerySnapshot<DocumentData>> {
    const userRef = this.getallUsersdocRef();
    const emailQuery = query(userRef, where('email', '==', email));
    return await getDocs(emailQuery);
  }

  /**
   * Processes login by validating the password and updating user status.
   * @param {QuerySnapshot<DocumentData>} querySnapshot - The snapshot of user documents.
   * @param {string} password - The provided password to validate.
   * @returns {Promise<boolean>} - Returns true if login is successful, otherwise false.
   */
  private async processLogin(
    querySnapshot: QuerySnapshot<DocumentData>,
    password: string
  ): Promise<boolean> {
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      if (userData['password'] === password) {
        console.log('Login successful.');
        await this.finalizeLogin(doc.id);
        return true;
      }
    }
    return false;
  }

  /**
   * Finalizes the login process by updating user status and navigating to the home page.
   * @param {string} userId - The Firestore document ID of the logged-in user.
   * @returns {Promise<void>}
   */
  private async finalizeLogin(userId: string): Promise<void> {
    await this.updateUserStatus(userId, 'online');
    this.router.navigate(['/home', userId]);
  }

  /**
   * Handles login errors by logging the error message.
   * @param {string} message - The error message to display.
   */
  private handleLoginError(message: string): void {
    console.error(message);
  }

  /**
   * Updates the status and ID of a user in Firestore.
   * @param {string} id - The Firestore document ID of the user.
   * @param {string} status - The new status to set for the user.
   */
  async updateUserStatus(id: string, status: string): Promise<void> {
    try {
      const userDocRef = this.getSingleUserDocRef('user', id);
      await this.updateStatus(userDocRef, status);
      await this.updateId(userDocRef, id);
      this.logStatusUpdate(status);
    } catch (error) {
      this.handleUpdateError(error);
    }
  }

  /**
   * Updates the status field of a Firestore document.
   * @param {DocumentReference} userDocRef - The reference to the Firestore document.
   * @param {string} status - The new status to set.
   * @returns {Promise<void>}
   */
  private async updateStatus(
    userDocRef: DocumentReference<DocumentData>,
    status: string
  ): Promise<void> {
    await updateDoc(userDocRef, { status });
  }

  /**
   * Updates the ID field of a Firestore document.
   * @param {DocumentReference} userDocRef - The reference to the Firestore document.
   * @param {string} id - The new ID to set.
   * @returns {Promise<void>}
   */
  private async updateId(
    userDocRef: DocumentReference<DocumentData>,
    id: string
  ): Promise<void> {
    await updateDoc(userDocRef, { id });
  }

  /**
   * Logs a successful status update to the console.
   * @param {string} status - The updated status to log.
   */
  private logStatusUpdate(status: string): void {
    console.log(`Status successfully updated: ${status}`);
  }

  /**
   * Handles errors that occur during the update process.
   * @param {any} error - The error to handle.
   */
  private handleUpdateError(error: any): void {
    console.error('Error updating status:', error);
  }

  /**
   * Logs out the user by updating their status and navigating to the login page.
   * @param {string} id - The Firestore document ID of the user.
   */
  async logoutUser(id: string): Promise<void> {
    await this.setOfflineStatus(id);
    this.logLogoutMessage();
    this.navigateToLogin();
  }

  /**
   * Updates the user's status to 'offline' in Firestore.
   * @param {string} id - The Firestore document ID of the user.
   * @returns {Promise<void>}
   */
  private async setOfflineStatus(id: string): Promise<void> {
    await this.updateUserStatus(id, 'offline');
  }

  /**
   * Logs a logout success message to the console.
   */
  private logLogoutMessage(): void {
    console.log('User successfully logged out.');
  }

  /**
   * Navigates the user to the login page.
   */
  private navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
