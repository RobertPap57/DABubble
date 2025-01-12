import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewChatService {

  constructor() { }


  getMessages(channelId: string) {
    channelId = '123'; // replace with actual channel ID and get mesages from database
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
          { emoji: '🚀', count: 2, users: ['Elena', 'Maria'] },
          { emoji: '✅', count: 1, users: ['Elena'] },

        ],
      },

    ];
  }
}
