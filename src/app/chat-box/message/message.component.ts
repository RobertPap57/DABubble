
import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../click-outside.directive';
import { CommonModule } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';
import { ReactionBarComponent } from './reaction-bar/reaction-bar.component';
import { Message } from '../../interfaces/message.interface';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { ChannelService } from '../../services/channel.service';
import { Timestamp } from '@angular/fire/firestore';





@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    AutosizeModule,
    PickerComponent,
    ClickOutsideDirective,
    CommonModule,
    ReactionBarComponent
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class MessageComponent {
  userService = inject(UserService);
  messageService = inject(MessageService);
  channelService = inject(ChannelService);
  emojiPickerOn: boolean = false;
  @Input() message!: Message;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';



  getTimeInHours(timestamp: Timestamp): any {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return time;
    }
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




  toggleEmojiPicker(): void {
    this.emojiPickerOn = !this.emojiPickerOn;
  }

  addEmoji(event: { emoji: { native: string } }): void {
    if (this.message.reactions) {
      const existingReaction = this.message.reactions.find(
        (reaction: { emoji: string; users: string[] }) => reaction.emoji === event.emoji.native
      );

      if (existingReaction) {
        if (!existingReaction.users.includes(this.userService.loggedUserId)) {
          existingReaction.users.push(this.userService.loggedUserId);
        }
      } else {

        this.message.reactions.push({
          emoji: event.emoji.native,
          users: [this.userService.loggedUserId]
        });
      }
      this.pushToRecentEmojis(event.emoji.native);
      this.closeEmojiPicker();
    }
  }

  pushToRecentEmojis(emoji: string): void {
    if (this.message.recentEmojis) {
      if (this.message.recentEmojis.includes(emoji)) {
        return;
      } else {
        this.message.recentEmojis.push(emoji);
      }
      if (this.message.recentEmojis.length > 2) {
        this.message.recentEmojis.shift();
      }
    }
  }

  closeEmojiPicker(): void {
    this.emojiPickerOn = false;
  }



  addExistingEmoji(existingEmoji: string): void {
    if (this.message.reactions) {
      const existingReaction = this.message.reactions.find(
        (reaction: { emoji: string; users: string[] }) => reaction.emoji === existingEmoji
      );

      if (existingReaction && !this.alreadyReacted(existingEmoji)) {
        existingReaction.users.push(this.userService.loggedUserId);
      } else if (this.alreadyReacted(existingEmoji)) {
        this.removeEmoji(existingEmoji);
      }
    }
  }

  removeEmoji(emoji: string): void {
    if (this.message.reactions) {
      const reactionIndex = this.message.reactions.findIndex(
        (reaction: { emoji: string; users: string[] }) => reaction.emoji === emoji
      );

      if (reactionIndex !== -1) {
        const reaction = this.message.reactions[reactionIndex];

        reaction.users = reaction.users.filter((user: string) => user !== this.userService.loggedUserId);

        if (reaction.users.length === 0) {
          this.message.reactions.splice(reactionIndex, 1);
        }
      }
    }
  }

  alreadyReacted(reactedEmoji: string): boolean {
    return this.message.reactions
      ? this.message.reactions.some(
        (reaction: { emoji: string; users: string[] }) =>
          reaction.users.includes(this.userService.loggedUserId) && reaction.emoji === reactedEmoji
      )
      : false;
  }









}



