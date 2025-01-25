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
  Unsubscribe,
  CollectionReference,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [];
  firestore: Firestore = inject(Firestore);
  userId: string = '';
  userName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  userImage: string = '';

  loggedUserId: string = '';
  privMsgUserId: string = '';

  unsubUserList;

  constructor(private router: Router) {
    this.unsubUserList = this.subUserList();
  }

  /**
   * Subscribes to changes in the 'user' Firestore collection and updates the user list.
   * @returns {Unsubscribe} - A function to unsubscribe from the snapshot listener.
   */
  subUserList(): Unsubscribe {
    return onSnapshot(
      this.getallUsersdocRef(),
      (snapshot: QuerySnapshot<DocumentData>) => {
        this.users = snapshot.docs.map((doc) =>
          this.setUserObject(doc.data(), doc.id)
        );
      }
    );
  }

  /**
   * Adds a new user document to Firestore with a generated ID.
   * @param {User} user - The user data to add.
   */
  async createUser(user: User): Promise<void> {
    try {
      let docRef = await addDoc(this.getallUsersdocRef(), user);
      console.log('User Data doc:', docRef.id);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  /**
   * Converts Firestore document data into a User object.
   * @param {any} obj - The Firestore document data.
   * @param {string} id - The document ID.
   * @returns {User} - The constructed User object.
   */
  setUserObject(obj: any, id: string): User {
    return {
      id: id || '',
      name: obj.name || '',
      userImage: obj.userImage || '',
      email: obj.email || '',
      password: obj.password || '',
      status: obj.status || '',
      lastSeen: obj.lastSeen || new Date(),
    };
  }

  /**
   * Retrieves the Firestore reference for the 'user' collection.
   * @returns {CollectionReference<DocumentData>} - The Firestore collection reference.
   */
  getallUsersdocRef(): CollectionReference<DocumentData> {
    return collection(this.firestore, 'user');
  }

  /**
   * Retrieves a specific Firestore document reference in the 'user' collection.
   * @param {string} colId - The Firestore collection ID.
   * @param {string} docId - The Firestore document ID.
   * @returns {DocumentReference<DocumentData>} - The Firestore document reference.
   */
  getSingleUserDocRef(
    colId: string,
    docId: string
  ): DocumentReference<DocumentData> {
    return doc(collection(this.firestore, colId), docId);
  }

  /**
   * Prepares and uploads a new user object to Firestore.
   */
  uploadUserData(): void {
    let newUser = this.prepareNewUser();
    this.saveUserToFirestore(newUser);
  }

  /**
   * Creates a new user object based on input data.
   * @returns {User} - The constructed user object.
   */
  private prepareNewUser(): User {
    return {
      id: '',
      name: this.userName,
      email: this.email,
      password: this.password,
      userImage: this.userImage,
      status: 'offline',
      lastSeen: new Date(),
    };
  }

  /**
   * Saves the user object to Firestore.
   * @param {User} user - The user object to save.
   */
  public async saveUserToFirestore(user: User): Promise<void> {
    try {
      await this.createUser(user);
      console.log('User data successfully uploaded.');
    } catch (error) {
      console.error('Error uploading user data:', error);
    }
  }

  /**
   * Logs in a user by validating their email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} - True if login is successful, false otherwise.
   */
  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      let querySnapshot = await this.getUserByEmail(email);
      if (querySnapshot.empty) {
        return false;
      }
      let isLoginSuccessful = await this.processLogin(querySnapshot, password);
      return isLoginSuccessful;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * Retrieves a user document from Firestore by email.
   * @param {string} email - The email to query.
   * @returns {Promise<QuerySnapshot<DocumentData>>} - The query result.
   */
  private async getUserByEmail(
    email: string
  ): Promise<QuerySnapshot<DocumentData>> {
    let userRef = this.getallUsersdocRef();
    let emailQuery = query(userRef, where('email', '==', email));
    return await getDocs(emailQuery);
  }

  public getUserById(
    id: string
  ): User {
    for (var i = 0; i < this.users.length; i++){
      var user = this.users[i]; 
      if (user.id === id) {
        return user;
      }
    };
    throw Error("Can't find user");
  }

  /**
   * Validates user credentials and updates their status if successful.
   * @param {QuerySnapshot<DocumentData>} querySnapshot - The user query result.
   * @param {string} password - The password to validate.
   * @returns {Promise<boolean>} - True if credentials are valid, false otherwise.
   */
  private async processLogin(
    querySnapshot: QuerySnapshot<DocumentData>,
    password: string
  ): Promise<boolean> {
    for (let doc of querySnapshot.docs) {
      let userData = doc.data();
      if (userData['password'] === password) {
        await this.finalizeLogin(doc.id);
        return true;
      }
    }
    return false;
  }

  /**
   * Finalizes login by updating the user's status and navigating to the home page.
   * @param {string} userId - The logged-in user's Firestore document ID.
   */
  public async finalizeLogin(userId: string): Promise<void> {
    await this.updateUserStatus(userId, 'online');
    setTimeout(() => {
      this.router.navigate(['/home', userId]);
    }, 1500);
  }

  async updateUserInfo(id: string, name: string, avatar: string): Promise<void> {
    try {
      console.log(id);
      let userDocRef = this.getSingleUserDocRef('user', id);
      await updateDoc(userDocRef, {
        name: name,
        userImage: avatar
      });
      console.log('User info updated successfully.');
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  /**
   * Updates a user's status and ID in Firestore.
   * @param {string} id - The user's Firestore document ID.
   * @param {string} status - The status to set.
   */
  async updateUserStatus(id: string, status: string): Promise<void> {
    try {
      let userDocRef = this.getSingleUserDocRef('user', id);
      await Promise.all([
        updateDoc(userDocRef, { status }),
        updateDoc(userDocRef, { id }),
      ]);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  /**
   * Logs out the user by setting their status to 'offline' and navigating to login.
   * @param {string} id - The user's Firestore document ID.
   */
  async logoutUser(id: string): Promise<void> {
    try {
      await this.updateUserStatus(id, 'offline');
      this.router.navigate(['']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
