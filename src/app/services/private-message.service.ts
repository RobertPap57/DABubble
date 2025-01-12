import { Injectable, inject } from '@angular/core';
import { PrivateMessage } from '../interfaces/private-message.model';
import { addDoc, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessageService {
  privMsg: PrivateMessage[] = [];
  firestore: Firestore = inject(Firestore);
  privMsgId: string = '';
  unsubPrivMsgList;

  constructor() {
    this.unsubPrivMsgList = this.subPrivMsgList();
  }

  subPrivMsgList() {
    return onSnapshot(this.getallPrivMsgdocRef(),
      (list: QuerySnapshot<DocumentData>) => {
        this.privMsg = [];
        list.forEach(element => {
          console.log(this.setPrivMsgObject(element.data(), element.id));
          this.privMsg.push(this.setPrivMsgObject(element.data(), element.id));
        });
      });
  }

  setPrivMsgId(id: string) {
    this.privMsgId = id;
  }

  ngOnDestroy() {
    this.unsubPrivMsgList;
  }

  async createPrivMsg(privMsg: PrivateMessage) {
    await addDoc(this.getallPrivMsgdocRef(), privMsg).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef); }
    )
  }

  async updatePrivMsg(privMsg: PrivateMessage) {
    if (privMsg.privMsgId) {
      let docRef = this.getSinglePrivMsgDocRef('privateMsg', privMsg.privMsgId);
      await updateDoc(docRef, this.getCleanJSON(privMsg)).catch(
        (err) => { console.error(err); }
      ).then(
        () => { } //Hier Update Funktioniert Modul
      );
    }
  }

  async deletePrivMsg(docId: string) {
    await deleteDoc(this.getSinglePrivMsgDocRef('privateMsg', docId)).catch(
      (err) => { console.error(err); }
    ).then(
      () => { } //Hier Update Funktioniert Modul
    );
  }

  getCleanJSON(privMsg: PrivateMessage): {} {
    return {
      privMsgId: privMsg.privMsgId,
      userIds: privMsg.userIds,
      textId: privMsg.textId,
      // text: privMsg.textId.text,
      // timestamp: privMsg.textId.timestamp,
      // addedFiles: privMsg.textId.addedFiles,
      // addedReactions: privMsg.textId.addedReactions,
      // emoticon: privMsg.textId.addedReactions.emoticon,
      // iconURL: privMsg.textId.addedReactions.emoticon.iconURL,
    }
  }

  setPrivMsgObject(obj: any, id: string): PrivateMessage {
    return {
      privMsgId: id || '',
      userIds: obj.userIds,
      textId: obj.textId,
    }
  }

  getallPrivMsgdocRef() {
    return collection(this.firestore, 'privateMsg');
  }

  getSinglePrivMsgDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}