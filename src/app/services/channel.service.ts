import { Injectable, inject } from '@angular/core';
import { Channel } from '../interfaces/channel.model';
import { addDoc, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels: Channel[] = [];
  isServer: boolean = true;
  slideOutNavBar: boolean = false;
  createChannelBox: boolean = false;
  channelChatId: string = '123';

  firestore: Firestore = inject(Firestore);
  chanId: string = '';
  chanName: string = '';
  chanDescription: string = '';
  chanCreatedByUser: string = '';
  userIds: string[] = [];


  unsubChannelList;

  constructor() {
    this.unsubChannelList = this.subChannelList();
  }

  /**
   * Subscribes to changes in the 'channel' Firestore collection and updates the channels in the list
   *
   * @returns A function to unsubscribe from the snapshot listener
   */
  subChannelList() {
    return onSnapshot
      (this.getallChannelsdocRef(),
        (snapshot: QuerySnapshot<DocumentData>) => {
          this.channels = snapshot.docs.map((doc) =>
            this.setChannelObject(doc.data(), doc.id)
          );
        }
      );
  }

  /**
   * sets the channel id
   * 
   * @param id the id from the channel
   */
  setChannelId(id: string) {
    this.chanId = id;
  }

  /**
   * unsubsribes the channels
   */
  ngOnDestroy() {
    this.unsubChannelList;
  }

  /**
   * Adds a new channel document to firestore with a generated ID
   * 
   * @param channel the channel data to add
   */
  async createChannel(channel: Channel): Promise<void> {
    try {
      const docRef = await addDoc(this.getallChannelsdocRef(), channel);
      this.finalizeChannel(docRef.id);
    } catch (err) {
      console.error(err);
    }
  }

  async finalizeChannel(chanId: string): Promise<void> {
    try {
      let channelDocRef = this.getSingleChannelDocRef('channel', chanId);
      await updateDoc(channelDocRef, { chanId });
    } catch (error) {
      console.error('Error updating channel status:', error);
    }
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

  /**
   * deletes the channel from the firestore
   * 
   * @param docId 
   */
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
    }
  }

  setChannelObject(obj: any, id: string): Channel {
    return {
      chanId: id || '',
      chanName: obj.chanName,
      chanDescription: obj.chanDescription,
      chanCreatedByUser: obj.chanCreatedByUser,
      userIds: obj.userIds,
    }
  }

  getCurChanObj() {
    return {
      chanId: '',
      chanName: this.chanName,
      chanDescription: this.chanDescription,
      chanCreatedByUser: this.chanCreatedByUser,
      userIds: this.userIds,
    }
  }

  getallChannelsdocRef() {
    return collection(this.firestore, 'channel');
  }

  getSingleChannelDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}