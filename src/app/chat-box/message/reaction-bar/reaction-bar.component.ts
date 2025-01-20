import { Component, Input, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../../click-outside.directive';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
    ClickOutsideDirective,
    CommonModule,
  ],
  templateUrl: './reaction-bar.component.html',
  styleUrl: './reaction-bar.component.scss'
})
export class ReactionBarComponent {

  @Input() message: any;
  @Input() loggedUser: string = '';
  optionsOpen: boolean = false;
  emojiPickerOn: boolean = false;


  toggleEmojiPicker(): void {
    this.emojiPickerOn = !this.emojiPickerOn;
  }

  addEmoji(event: { emoji: { native: string } }): void {
    const existingReaction = this.message.reactions.find(
      (reaction: { emoji: string; users: string[] }) => reaction.emoji === event.emoji.native
    );

    if (existingReaction && !this.alreadyReacted(event.emoji.native)) {

      if (!existingReaction.users.includes(this.loggedUser)) {
        existingReaction.users.push(this.loggedUser);
      }
    } else if (!this.alreadyReacted(event.emoji.native)) {

      this.message.reactions.push({
        emoji: event.emoji.native,
        users: [this.loggedUser]
      });
    }
    this.pushToRecentEmojis(event.emoji.native);
    this.closeEmojiPicker();
  }

  pushToRecentEmojis(emoji: string): void {
    if (this.message.recentEmojis.includes(emoji)) {
      return;
    } else {
      this.message.recentEmojis.push(emoji);
    }
    if (this.message.recentEmojis.length > 2) {
      this.message.recentEmojis.shift();
    }
  }
  closeEmojiPicker(): void {
    this.emojiPickerOn = false;
  }

  toggleOptions(): void {
    this.optionsOpen = !this.optionsOpen;
  }

  closeOptions(): void {
    this.optionsOpen = false;
  }

  addRecentEmoji(recentEmoji: string): void {
    const existingReaction = this.message.reactions.find(
      (reaction: { emoji: string; users: string[] }) => reaction.emoji === recentEmoji
    );
  
    if (existingReaction && !this.alreadyReacted(recentEmoji)) {
      existingReaction.users.push(this.loggedUser);
    } else if (!existingReaction) {
      this.message.reactions.push({
        emoji: recentEmoji,
        users: [this.loggedUser]
      });
    } else if (this.alreadyReacted(recentEmoji)) {
      this.removeEmoji(recentEmoji);
    }
  }


removeEmoji(emoji: string): void {
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


  alreadyReacted(reactedEmoji: string): boolean {
    return this.message.reactions.some(
      (reaction: { emoji: string; users: string[] }) =>
        reaction.users.includes(this.loggedUser) && reaction.emoji === reactedEmoji
    );
  }




}











