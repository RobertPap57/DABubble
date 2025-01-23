

import { User } from './../interfaces/user.model';
import { serverTimestamp } from 'firebase/firestore';
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
import { Message, ThreadMessage, Reaction } from '../interfaces/message.interface';
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


  @Input() channelId: string = '';
  @Input() privateChatId: string = '';
  @Input() threadOpen: boolean = false;
  @Input() newMessage: boolean = false;

  isBrowser: boolean;
  emojiPickerOn: boolean = false;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';
  @Input() threadId: string = '';
  @Input() userId: string = '';
  channelName = 'Entwicklerteam';
  senderName: string = '';
  senderImg: string = '';
  loggedUserId: string = '';
  
  users: User[] = this.userService.users;
  messageText: string = '';







  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }


  get filteredChannelMessages(): Message[] {
    return this.messageService.messages.filter(
      message => message.channelId === this.channelService.channelChatId
    );
  }
  get filteredPrivateMessages(): Message[] {
    return this.messageService.messages.filter(
      message =>
        (message.senderId === this.userService.loggedUserId && message.userId === this.userService.privMsgUserId) ||
        (message.senderId === this.userService.privMsgUserId && message.userId === this.userService.loggedUserId)
    );
  }

  determineChatType(): 'private' | 'channel' | 'thread' | 'new' {
    if (this.newMessage) {
      return 'new';
    } else if (this.threadOpen) {
      return 'thread';
    } else if (this.channelService.channelChatId) {
      return 'channel';
    } else if (this.userService.privMsgUserId) {
      return 'private';
    }
    return 'new'; // Default case if no condition is met
  }

  getPlaceholder(): string {
    const chatType = this.determineChatType();
    switch (chatType) {
      case 'private':
        const userName = this.getUserName();
        return `Nachricht an ${userName || 'unbekannter User'}`;
      case 'channel':
        const channelName = this.getChannelName();
      return `Nachricht an #${channelName || 'unbekannter Kanal'}`;
      case 'thread':
        return 'Antworten...';
      case 'new':
      default:
        return 'Starte eine neue Nachricht';
    }
  }



  getChannelName(): string | null {
    const channel = this.channelService.channels.find(
      (channel) => channel.chanId === this.channelService.channelChatId
    );
    return channel ? channel.chanName : null;
  }

  getUserName(): string | null {
    const user = this.userService.users.find(
      (user) => user.id === this.userService.privMsgUserId
    );
    
    if (user) {
      if (this.userService.privMsgUserId === this.userService.loggedUserId) {
        return `${user.name} (Du)`;

      }
      return user.name;
    }
    return null;
  }
  getUserImg(): string | null {
    const user = this.userService.users.find(
      (user) => user.id === this.userService.privMsgUserId
    );
    return user ? user.userImage : null;
  }

  getUserStatus(): string | null {
    const user = this.userService.users.find(
      (user) => user.id === this.userService.privMsgUserId
    );
    return user ? user.status : null;
  }

  getChannelMembers(): [] | any {
    const currentChannel = this.channelService.channels.find(
      (channel) => channel.chanId === this.channelService.channelChatId
    );
    if (!currentChannel || !currentChannel.userIds) {
      return []; // Return an empty array if the channel or its user IDs are not defined
    }
  
    const members = this.userService.users.filter((user) =>
      currentChannel.userIds.includes(user.id)
    );
  
    return members;
    
  }

  sendMessage(): void {
    if (this.messageText.trim() !== '') {
      const newMessage: Message = {
        id: '',
        senderId: this.userService.loggedUserId,
        text: this.messageText,
        time: serverTimestamp(),
        reactions: [],
        recentEmojis: [],
        channelId: this.channelService.channelChatId,
        userId: this.userService.privMsgUserId,
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
