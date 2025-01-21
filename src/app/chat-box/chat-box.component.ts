import { User } from './../interfaces/user.model';

import { Component, Input, Inject, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { ClickOutsideDirective } from './click-outside.directive';
import { MessageComponent } from './message/message.component';
import { MessageService } from './message/message.service';
import { Message } from '../interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';


















@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [MatIconModule,
    PickerComponent,
    CommonModule,
    FormsModule,
    AutosizeModule,
    ClickOutsideDirective,
    MessageComponent
  ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {
  userService = inject(UserService);
  messageService = inject(MessageService);
  channelService = inject(ChannelService);

  isBrowser: boolean;
  emojiPickerOn: boolean = false;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';
  @Input() channelId: string = '';
  @Input() threadId: string = '';
  @Input() userId: string = '';
  channelName = 'Entwicklerteam';
  senderName: string = '';
  senderImg: string = '';
  loggedUserId: string = '';
  
  users: User[] = this.userService.users;
  messages!: Message[];
  messageText: string = '';
  messagesLoaded = false;

  private unsubChannelMessageList: () => void = () => { };
  private unsubPrivateMessageList: () => void = () => { };





  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }



  ngOnInit(): void {
    if (this.channelId) {
      this.fetchChannelMessages()
    }
    if (this.userId) {
      this.fetchPrivateMessages()
    }
    this.userService.subUserList();
    this.loggedUserId = this.userService.loggedUserId
  }







  fetchChannelMessages(): void {
    this.unsubChannelMessageList = this.messageService.subChannelMessageList(this.channelId, (messages) => {
      this.messages = messages;
      this.messagesLoaded = true;

    });
  }

  fetchPrivateMessages(): void {
    this.unsubPrivateMessageList = this.messageService.subPrivateMessageList(this.userId, (messages) => {
      this.messages = messages;
      this.messagesLoaded = true;

    });
  }

  ngOnDestroy(): void {
    this.unsubChannelMessageList();
    this.unsubPrivateMessageList();
  }


  getUserInfoById(userId: string): void {
    const user = this.userService.users.find((u) => u.id === userId);

    if (user) {
      this.senderName = user.name;
      this.senderImg = user.userImage;
    } else {
      console.log('User not found');
    }

  }



  sendMessage(): void {
    if (this.messageText.trim() !== '') {
      this.getUserInfoById(this.userService.loggedUserId);
      const newMessage: Message = {
        id: '',
        senderId: this.userService.loggedUserId,
        senderImg: this.senderImg,
        senderName: this.senderName,
        text: this.messageText,
        time: Timestamp.now(),
        reactions: [],
        recentEmojis: [],
        channelId: this.channelId,
        userId: '',
        threadMessages: []
      };

      this.messageService.createMessage(newMessage).then(() => {
        this.messageText = '';
      })

    }

  }

  toggleEmojiPicker(): void {
    this.emojiPickerOn = !this.emojiPickerOn;
  }

  addEmoji(event: any): void {
    this.messageText += event.emoji.native;
    this.closeEmojiPicker();
  }

  closeEmojiPicker(): void {
    this.emojiPickerOn = false;
  }

  closeThread(): void {

  }



}
