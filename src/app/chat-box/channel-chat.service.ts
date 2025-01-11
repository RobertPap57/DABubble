import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelChatService {

  constructor() { }


  getMessages(channelId: string) {
    channelId = '123'; // replace with actual channel ID and get mesages from database
    return [
      { sender: 'Alice', text: 'Hello!', time: '12:00', senderImg: '2' },
      { sender: 'Bob', text: 'Hi there!', time: '13:00', senderImg: '1' }
    ];
  }
}
