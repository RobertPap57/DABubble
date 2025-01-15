import { Injectable, inject } from '@angular/core';
import { Channel } from '../interfaces/channel.model';
import { addDoc, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels: Channel[] = [];
  firestore: Firestore = inject(Firestore);
  chanId: string = '';
  chanName: string = '';
  chanDescription: string = '';
  chanCreatedByUser: string = '';
  userIds: string[] = [];
  textId: {} = {};
  threadIDs: [] = [];
  
  
  unsubChannelList;

  constructor() {
    this.unsubChannelList = this.subChannelList();
  }

  subChannelList() {
    return onSnapshot(this.getallChannelsdocRef(),
      (list: QuerySnapshot<DocumentData>) => {
        this.channels = [];
        list.forEach(element => {
          console.log(this.setChannelObject(element.data(), element.id));
          this.channels.push(this.setChannelObject(element.data(), element.id));
        });
      });
  }

  setChannelId(id: string) {
    this.chanId = id;
  }

  ngOnDestroy() {
    this.unsubChannelList;
  }

  async createChannel(channel: Channel) {
    await addDoc(this.getallChannelsdocRef(), channel).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with ID: ", docRef); }
    )
  }

  async updateChannel(channel: Channel) {
    if (channel.chanId) {
      let docRef = this.getSingleChannelDocRef('channel', channel.chanId);
      await updateDoc(docRef, this.getCleanJSON(channel)).catch(
        (err) => { console.error(err); }
      ).then(
        () => { } //Hier Update Funktioniert Modul
      );
    }
  }

  async deleteChannel(docId: string) {
    await deleteDoc(this.getSingleChannelDocRef('channel', docId)).catch(
      (err) => { console.error(err); }
    ).then(
      () => { } //Hier Update Funktioniert Modul
    );
  }

  getCleanJSON(channel: Channel): {} {
    return {
      chanId: channel.chanId,
      chanName: channel.chanName,
      chanDescription: channel.chanDescription,
      chanCreatedByUser: channel.chanCreatedByUser,
      userIds: channel.userIds,
      textId: channel.textId,
    }
  }

  setChannelObject(obj: any, id: string): Channel {
    return {
      chanId: id || '',
      chanName: obj.chanName,
      chanDescription: obj.chanDescription,
      chanCreatedByUser: obj.chanCreatedByUser,
      userIds: obj.userIds,
      textId: obj.textId,
      threadIDs: obj.threadIDs,
    }
  }

  getallChannelsdocRef() {
    return collection(this.firestore, 'channel');
  }

  getSingleChannelDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}