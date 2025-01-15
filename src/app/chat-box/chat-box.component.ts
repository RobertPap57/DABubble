import { Component, Input, Inject, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChannelChatService } from './channel-chat.service';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { ClickOutsideDirective } from './click-outside.directive';
import { MessageComponent } from './message/message.component';









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

  isBrowser: boolean;
  emojiPickerOn: boolean = false;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';
  @Input() chatId: string = '';
  channelName = 'Entwicklerteam';
  users: any[] = [
    { name: 'Noah Braun', avatar: '3' },
    { name: 'Sofia Müller', avatar: '2' },
    { name: 'Frederik Beck', avatar: '1' },
  ];
  userName = 'Sofia Müller';
  messages: any[] = [];
  message: string = '';

  private channelChatService = inject(ChannelChatService);



  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadMessages();
  }

  sendMessage(): void {
    if (this.message.trim() !== '') {
      this.messages.push(
        {
          sender: 'Me',
          text: this.message,
          time: new Date().toLocaleTimeString
            ('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          senderImg: '1',
          thread: [
            { sender: 'Bob', text: 'Hi there!', time: '13:00', senderImg: '1' },
            { sender: 'Alice', text: 'Hi there!', time: '15:00', senderImg: '2' }
          ],
          reactions: [],
          recentEmojis: [],
        },

      );
    }
    this.message = '';
    console.log(this.messages);

  }

  toggleEmojiPicker(): void {
    this.emojiPickerOn = !this.emojiPickerOn;
  }

  addEmoji(event: any): void {
    this.message += event.emoji.native;
    this.closeEmojiPicker();
  }

  closeEmojiPicker(): void {
    this.emojiPickerOn = false;
  }

  closeThread(): void {

  }

  loadMessages() {
    this.messages = this.channelChatService.getMessages(this.chatId);

  }
}
