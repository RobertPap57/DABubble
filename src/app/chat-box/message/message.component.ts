import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../click-outside.directive';
import { CommonModule } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';
import { ReactionBarComponent } from './reaction-bar/reaction-bar.component';
import { Message } from '../../interfaces/message.interface';
import { UserService } from '../../services/user.service';




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
  loggedUser= inject(UserService).loggedUserId;
  emojiPickerOn: boolean = false;
  @Input() message!: Message;
  





  toggleEmojiPicker(): void {
    this.emojiPickerOn = !this.emojiPickerOn;
  }

  addEmoji(event: { emoji: { native: string } }): void {
    if (this.message.reactions) {
      const existingReaction = this.message.reactions.find(
        (reaction: { emoji: string; users: string[] }) => reaction.emoji === event.emoji.native
      );

      if (existingReaction) {
        if (!existingReaction.users.includes(this.loggedUser)) {
          existingReaction.users.push(this.loggedUser);
        }
      } else {

        this.message.reactions.push({
          emoji: event.emoji.native,
          users: [this.loggedUser]
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
        existingReaction.users.push(this.loggedUser);
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

        reaction.users = reaction.users.filter((user: string) => user !== this.loggedUser);

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
          reaction.users.includes(this.loggedUser) && reaction.emoji === reactedEmoji
      )
      : false; 
  }









}



