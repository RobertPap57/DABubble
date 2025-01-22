import { Timestamp } from "@angular/fire/firestore";



export interface Message {
    id: string; 
    senderId: string; 
    text: string; 
    time: Timestamp | any;
    reactions: Reaction[]; 
    recentEmojis: string[];
    channelId: string;
    userId: string;
    threadMessages: ThreadMessage[];
}

export interface Sender {
    id: string; 
    name: string; 
    img: string;
}



export interface Reaction {
  emoji: string; 
  users: string[];
}

  export interface ThreadMessage {
    id: string; 
    senderId: string; 
    text: string; 
    time: Timestamp | any;
    reactions: Reaction[]; 
    recentEmojis: string[];
  }



