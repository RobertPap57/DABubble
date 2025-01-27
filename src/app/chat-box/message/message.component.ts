import { EmojiReactionComponent } from './emoji-reaction/emoji-reaction.component';

import { Component, Input, Inject, inject, PLATFORM_ID, viewChild, ElementRef, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ClickOutsideDirective } from '../click-outside.directive';
import { CommonModule } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';
import { ReactionBarComponent } from './reaction-bar/reaction-bar.component';
import { Message } from '../../interfaces/message.interface';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { ChannelService } from '../../services/channel.service';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { EmojiService } from '../../services/emoji.service';
import { Subscription } from 'rxjs';






@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    AutosizeModule,
    ClickOutsideDirective,
    CommonModule,
    ReactionBarComponent,
    FormsModule,
    EmojiReactionComponent

  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class MessageComponent {
  userService = inject(UserService);
  messageService = inject(MessageService);
  channelService = inject(ChannelService);
  emojiService = inject(EmojiService);
  private emojiSubscription!: Subscription;

  isBrowser: boolean;
  @Input() message!: Message;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';
  messageInput: Signal<ElementRef | undefined> = viewChild('messageInput');
  @Input() excludeElements: HTMLElement[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }

  ngOnInit(): void {
    this.emojiSubscription = this.emojiService.emojiSelected$.subscribe(({ event, destination }) => {
      if (destination === 'editMessage') {
        this.addEmojiInEditMessage(event);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.emojiSubscription) {
      this.emojiSubscription.unsubscribe();
    }
  }


  getTimeInHours(timestamp: Timestamp): any {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return time;
    }
  }

  editMessage(): void {
    const editedMessage = this.messageService.editMessage;
    if (editedMessage) {
      this.messageService.updateMessage(editedMessage);
     const threadMessage = this.findMatchingTread(editedMessage.id);

      if (threadMessage) {
        threadMessage.text = editedMessage.text;
        this.messageService.updateMessage(threadMessage);
      }
      this.messageService.editMessage = null;
    }
  }

  findMatchingTread(messageId: string): Message | null {
    // Filter messages where threadId matches the provided messageId
    const matchingMessages = this.messageService.messages.filter(
      (message) => message.threadId === messageId
    );

    if (matchingMessages.length === 0) {
      // No matching messages found
      return null;
    }

    // Find the message with the earliest time
    const earliestMessage = matchingMessages.reduce((earliest, current) =>
      current.time < earliest.time ? current : earliest
    );

    // Return the id of the earliest matching message
    return earliestMessage;
  }


  editMessageCancel(): void {

    if (this.messageService.editMessage) {
      this.messageService.editMessage.text = this.messageService.originalText;
    }
    this.messageService.editMessage = null;
  }

  openThread(message: Message): void {
    const channel = this.channelService.channels.find(
      (channel) => channel.chanId === message.channelId
    );
    this.messageService.threadChannelName = channel?.chanName || '';
    this.messageService.threadId = message.id;
    this.messageService.threadOpen = true;
  }

  countThreadAnswers(messageId: string): number {
    return this.messageService.messages.filter(
      message => message.threadId === messageId
    ).length;
  }

  getLastThreadTime(messageId: string): string | null {
    // Filter messages belonging to the specified thread
    const threadMessages = this.messageService.messages.filter(
      message => message.threadId === messageId
    );

    // Check if there are any messages in the thread
    if (threadMessages.length === 0) {
      return null; // No messages in the thread
    }

    // Find the message with the latest timestamp
    const latestMessage = threadMessages.reduce((latest, current) => {
      return current.time > latest.time ? current : latest;
    });

    // Use the existing getTimeInHours function to format the time
    return this.getTimeInHours(latestMessage.time);
  }






  addEmojiInEditMessage(event: any): void {
    const emoji = event.emoji.native;
    const textarea = this.messageInput()?.nativeElement;

    if (!textarea) {
      return;
    }
    const cursorPosition = textarea.selectionStart || 0;
    const textBeforeCursor = textarea.value.slice(0, cursorPosition);
    const textAfterCursor = textarea.value.slice(cursorPosition);

    if (this.messageService.editMessage) {
      this.messageService.editMessage.text = textBeforeCursor + emoji + textAfterCursor;
    }

    // Restore the cursor position and focus
    setTimeout(() => {
      const newCursorPosition = cursorPosition + emoji.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    });
  }




}



