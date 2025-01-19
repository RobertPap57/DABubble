import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    currentChatId:string = '';
    channelChatId:string = '';

    slideOutNavBar:boolean = false;

    chatOpened:string = ''; //channel, directMsg, threadmsg
}