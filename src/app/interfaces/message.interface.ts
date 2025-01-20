import { Timestamp } from "@angular/fire/firestore";



export interface Message {
    id: string; 
    senderId: string; 
    senderName: string; 
    senderImg: string; 
    text: string; 
    time: Timestamp | string;
    reactions: Reaction[]; 
    recentEmojis: string[];
    channelId: string;
    userId: string;
    threadMessages: ThreadMessage[];
}



export interface Reaction {
  emoji: string; 
  users: string[];
}

  export interface ThreadMessage {
    id: string; 
    sender: string; 
    text: string; 
    time: number; 
    reactions: Reaction[]; 
    recentEmojis: string[];
  }



