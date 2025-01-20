import { Injectable, inject } from '@angular/core';
import { Channel } from '../interfaces/channel.interface';
import { addDoc, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {


  channels: Channel[] = [];
  firestore: Firestore = inject(Firestore);


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
    if (channel.id) {
      let docRef = this.getSingleChannelDocRef('channel', channel.id);
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
      id: channel.id,
      name: channel.name,
      description: channel.description,
      createdBy: channel.createdBy,
      users: channel.users,
    }
  }

  setChannelObject(obj: any, id: string): Channel {
    return {
      id: id || '',
      name: obj.name,
      description: obj.description,
      createdBy: obj.createdBy,
      users: obj.users,
    }
  }


  getallChannelsdocRef() {
    return collection(this.firestore, 'channels');
  }

  getSingleChannelDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}

//   getMessages(channelId: string) {
//     channelId = '123'; 
//     return [
//       {
//         sender: 'Alice',
//         text: 'Hello!',
//         time: '12:00',
//         senderImg: '2',
//         thread: [
//           { sender: 'Bob', text: 'Hi there!', time: '13:00', senderImg: '1' },
//           { sender: 'Alice', text: 'Hi there!', time: '15:00', senderImg: '2' }
//         ],
//         reactions: [
//           { emoji: '🚀', users: ['Elena', 'Maria', 'Ionut'] },
//           { emoji: '✅', users: ['Elena'] },

//         ],
//         recentEmojis: ['✅', '🙌'],

//       },

//     ];
//   }






