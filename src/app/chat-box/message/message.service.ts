
import { ChannelService } from '../../services/channel.service';
import { Injectable, inject } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { addDoc, query, Timestamp, where, orderBy, limit, updateDoc, deleteDoc, collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot, } from '@angular/fire/firestore';
import { UserService } from '../../services/user.service';


@Injectable({
    providedIn: 'root'
})
export class MessageService {
    userService = inject(UserService);
    channelService = inject(ChannelService);
    firestore: Firestore = inject(Firestore);
    messages: Message[]=[];



 unsubMessageList;

    constructor() {
        this.unsubMessageList = this.subMessageList();
       
    }



    subMessageList() {
        const q = query(
          collection(this.firestore, 'messages'),
        );
        return onSnapshot(q, (list) => {
            this.messages = [];
            list.forEach((doc) => {
                const messageData = doc.data();
                const message = this.setMessageObject(messageData, doc.id);
          
                this.messages.push(message);
              });
          
              // Sort messages based on the 'time' field before converting to string
              this.messages.sort((a, b) => {
                const timeA = a.time instanceof Timestamp ? a.time.toMillis() : new Date(a.time).getTime();
                const timeB = b.time instanceof Timestamp ? b.time.toMillis() : new Date(b.time).getTime();
                return timeB - timeA; // Ascending order: oldest to newest
              });
          
              // Convert the 'time' to string after sorting
              this.messages.forEach(message => {
                if (message.time instanceof Timestamp) {
                  const date = message.time.toDate();
                  message.time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });  
                }
              });
          
              console.log(this.messages);
          });
      }
    

    ngOnDestroy() {
        this.unsubMessageList;

    }

    async createMessage(message: Message) {
        try {
            const docRef = await addDoc(this.getMessagesDocRef(), message);
            console.log("Document written with ID: ", docRef.id);
    
            // Update the message with the auto-generated ID
            await updateDoc(docRef, { id: docRef.id });
    
            return docRef.id; // Return the ID for further usage, if needed
        } catch (err) {
            console.error("Error creating message: ", err);
            throw err; // Optional: Re-throw the error for higher-level handling
        }
    }

    async updateMessage(message: Message) {
        if (message.id) {
            let docRef = this.getSingleMessageDocRef('messages', message.id);
            await updateDoc(docRef, this.getCleanJSON(message)).catch(
                (err) => { console.log(err); }
            ).then(
                () => { } //Hier Update Funktioniert Modul
            );
        }
    }

    async deleteMessage(docId: string) {
        await deleteDoc(this.getSingleMessageDocRef('messages', docId)).catch(
            (err) => { console.log(err); }
        ).then(
            () => { } //Hier Update Funktioniert Modul
        );
    }

    getCleanJSON(message: Message): {} {
        return {
            id: message.id || '', 
            senderId: message.senderId,
            text: message.text,
            time: message.time,
            reactions: message.reactions, 
            recentEmojis: message.recentEmojis,
            channelId: message.channelId,
            userId: message.userId,
            threadMessages: message.threadMessages
            
           
        }
    }

    setMessageObject(obj: any, id: string): Message {
        return {
            id: id ,
            senderId: obj.senderId,
            text: obj.text,
            time: obj.time,
            reactions: obj.reactions,
            recentEmojis: obj.recentEmojis,
            channelId: obj.channelId,
            userId: obj.userId,
            threadMessages: obj.threadMessages

        }
    }

    getMessagesDocRef() {
        return collection(this.firestore, 'messages');
    }


    getSingleMessageDocRef(colId: string, docId: string) {
        return doc(collection(this.firestore, colId), docId);
    }
}



