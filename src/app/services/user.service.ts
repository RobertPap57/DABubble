import { Injectable, inject } from '@angular/core';
import { User } from '../interfaces/user.model';
import { addDoc, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = [];
  firestore: Firestore = inject(Firestore);
  userId: string = '';
  unsubUserList;

  constructor() {
    this.unsubUserList = this.subUserList();
  }

  subUserList() {
    return onSnapshot(this.getallUsersdocRef(),
      (list: QuerySnapshot<DocumentData>) => {
        this.users = [];
        list.forEach(element => {
          console.log(this.setUserObject(element.data(), element.id));
          this.users.push(this.setUserObject(element.data(), element.id));
        });
      });
  }

  /**
   * sets the User id for the specific array
   * 
   * @param id the specific User ID
   */
  setUserId(id: string) {
    this.userId = id;
  }

  /**
   * unsubscribe the onsnapshotFunction
   */
  ngOnDestroy() {
    this.unsubUserList;
  }

  /**
   * Add a new document with a generated id to the firestore
   * 
   * @param user the User Array
   */
  async createUser(user: User) {
    await addDoc(this.getallUsersdocRef(), user).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef); }
    )
  }

  /**
   * updates one or more specific keys for the User
   * 
   * @param 'user' the id of the collection i.e. 'user'
   * @param docId the document id
   * @param user the keys that get changed
   */
  async updateUser(user: User) {
    if (user.id) {
      let docRef = this.getSingleUserDocRef('user', user.id);
      await updateDoc(docRef, this.getCleanJSON(user)).catch(
        (err) => { console.error(err); }
      ).then(
        () => { } //Hier Update Funktioniert Modul
      );
    }
  }

  /**
   * deletes the User from the database
   */
  async deleteUser(docId: string) {
    await deleteDoc(this.getSingleUserDocRef('user', docId)).catch(
      (err) => { console.error(err); }
    ).then(
      () => { } //Hier Update Funktioniert Modul
    );
  }

  /**
   * get a clean JSON for the user
   * 
   * @param user the object from the input
   * @returns a complete user-object
   */
  getCleanJSON(user: User): {} {
    return {
      id: user.id,
      name: user.name,
      userImage: user.userImage,
      email: user.email,
      status: user.status,
      lastSeen: user.lastSeen,
    }
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
      status: obj.status,
      lastSeen: obj.lastSeen,
    }
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
}