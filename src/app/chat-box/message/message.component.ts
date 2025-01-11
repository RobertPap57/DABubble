import { Component, Input, PLATFORM_ID, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ClickOutsideDirective } from '../click-outside.directive';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AutosizeModule } from 'ngx-autosize';



@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ 
    MatIconModule,
    AutosizeModule,
    PickerComponent,
    ClickOutsideDirective,
    CommonModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  logedUser: string = 'Me';
  isBrowser: boolean;
  emojiPickerOn: boolean = false;
  recentEmojis: any[] = ['emoji1', 'emoji2', 'emoji3'];
  @Input() message: any;

   constructor(@Inject(PLATFORM_ID) private platformId: any) {
      this.isBrowser = isPlatformBrowser(this.platformId);
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





}
