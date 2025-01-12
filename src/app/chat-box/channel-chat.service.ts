import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {

  constructor() { }


  getMessages(channelId: string) {
    channelId = '123'; 
    return [
      {
        sender: 'Alice',
        text: 'Hello!',
        time: '12:00',
        senderImg: '2',
        thread: [
          { sender: 'Bob', text: 'Hi there!', time: '13:00', senderImg: '1' },
          { sender: 'Alice', text: 'Hi there!', time: '15:00', senderImg: '2' }
        ],
        reactions: [
          { emoji: '🚀', count: 3, users: ['Elena', 'Maria', 'Ionut'] },
          { emoji: '✅', count: 1, users: ['Elena'] },

        ],
      },

    ];
  }
}
