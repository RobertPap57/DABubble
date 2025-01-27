

import { User } from './../interfaces/user.model';
import { serverTimestamp } from 'firebase/firestore';
import { Component, Input, Inject, inject, PLATFORM_ID,HostListener, ElementRef, ViewChild, viewChild, Signal, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { ClickOutsideDirective } from './click-outside.directive';
import { MessageComponent } from './message/message.component';
import { MessageService } from '../services/message.service';
import { Message, Reaction } from '../interfaces/message.interface';
import { UserService } from '../services/user.service';
import { ChannelService } from '../services/channel.service';

import { ContactWindowComponent } from '../contacts/contact-window/contact-window.component';
import { EditChannelComponent } from '../slide-side-bar/edit-channel/edit-channel.component';

import { EmojiService } from '../services/emoji.service';
import { Subscription } from 'rxjs';















@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [MatIconModule,
    PickerComponent,
    CommonModule,
    FormsModule,
    AutosizeModule,
    ClickOutsideDirective,
    MessageComponent,
    MessageComponent,
    ContactWindowComponent,
    EditChannelComponent
  ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {
  userService = inject(UserService);
  messageService = inject(MessageService);
  channelService = inject(ChannelService);
  @ViewChild('profileBox') profileBox!: ElementRef<HTMLDivElement>;
  openProfileBox = false;
  openEditChannel = false;
  addUsersToChannel = false;
  usersBoxInChannel = true;

  emojiService = inject(EmojiService);
  private emojiSubscription!: Subscription;
  @Input() threadId: string | null = null;
  @Input() channelId: string = '';
  @Input() privateChatId: string = '';
  @Input() newMessage: boolean = false;

  isBrowser: boolean;
  @Input() chatType: 'private' | 'channel' | 'thread' | 'new' = 'new';
   messageInput: Signal<ElementRef | undefined> = viewChild('messageInput');
   threadMessageInput: Signal<ElementRef | undefined> = viewChild('threadMessageInput');
  @Input() userId: string = '';
  senderName: string = '';
  senderImg: string = '';
  loggedUserId: string = '';
  users: User[] = this.userService.users;
  messageText: string = '';


  threadMessageText: string = '';
  focusedInput: string | null = null;

  @ViewChild('emojiPicker') emojiPicker!: ElementRef<HTMLElement>;
  excludeElements: HTMLElement[] = [];




  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);

  }



  ngAfterViewInit() {
    setTimeout(() => {
      this.excludeElements = [this.emojiPicker.nativeElement];
    }, 0);

  }

  ngOnInit(): void {
    this.emojiSubscription = this.emojiService.emojiSelected$.subscribe(({ event, destination }) => {
      if (destination === 'newMessage') {
        this.addEmojiInMessage(event);
      }
      if(destination === 'threadMessage'){
        this.addEmojiInThread(event);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.emojiSubscription) {
      this.emojiSubscription.unsubscribe();
    }
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

  get filteredThreadMessages(): Message[] {
    return this.messageService.messages.filter(
      message => message.threadId === this.threadId
    );
  }

  /**
   * a listener for mouseup event if the profileBox is active, if you click anywhere on the overlay it closes the profile box
   * 
   * @param target #profileBox
   */
  @HostListener('document:click', ['$event.target'])
  onClickOutsideProfileBox(target: HTMLElement): void {
    if (this.openProfileBox) {
      let clickInsideChan = this.profileBox.nativeElement.contains(target);
      if (!clickInsideChan) { this.closeProfilBox(); }
    }
  }

  closeThread(): void {
    this.messageService.threadId = null;
    this.messageService.threadOpen = false;
  }
  

  countThreadAnswers(): number {
    return this.messageService.messages.filter(
      message => message.threadId === this.messageService.threadId
    ).length;
  }

  determineChatType(): 'private' | 'channel' | 'thread' | 'new' {
    if (this.newMessage) {
      return 'new';
    } else if (this.messageService.threadOpen) {
      return 'thread';
    } else if (this.channelService.channelChatId) {
      return 'channel';
    } else if (this.userService.privMsgUserId) {
      return 'private';
    }
    return 'new'; // Default case if no condition is met
  }

  getPlaceholder(): string {
    const chatType = this.chatType;
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
    if (this.messageText.trim() !== ''|| this.threadMessageText.trim() !== '') {
      if (this.threadId) {
        this.sendThreadMessage();
      } else {
        this.sendMainMessage();
      }
      this.messageText = ''; // Clear input
      this.threadMessageText = ''; // Clear input
    }
  }



  sendMainMessage(): void {
    const newMessage: Message = {
      id: '',
      senderId: this.userService.loggedUserId,
      text: this.messageText,
      time: serverTimestamp(),
      reactions: [],
      recentEmojis: [],
      channelId: this.channelService.channelChatId,
      userId: this.userService.privMsgUserId,
      threadId: ''
    };
    this.messageService.createMessage(newMessage);
  }

  sendThreadMessage(): void {
    const newMessage: Message = {
      id: '',
      senderId: this.userService.loggedUserId,
      text: this.threadMessageText,
      time: serverTimestamp(),
      reactions: [],
      recentEmojis: [],
      channelId: '',
      userId: '',
      threadId: this.threadId
    };
    this.messageService.createMessage(newMessage);
  }

  addEmojiInThread(event: any): void {
    const emoji = event.emoji.native;
    const threadRef = this.threadMessageInput();
    const textarea = threadRef?.nativeElement

    if (textarea) {
      const cursorPosition = textarea.selectionStart || 0;
      const textBeforeCursor = textarea.value.slice(0, cursorPosition);
      const textAfterCursor = textarea.value.slice(cursorPosition);
      this.threadMessageText = textBeforeCursor + emoji + textAfterCursor;

      // Restore the cursor position and focus
      setTimeout(() => {
        const newCursorPosition = cursorPosition + emoji.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      });
    }

  }




  addEmojiInMessage(event: any): void {
    const emoji = event.emoji.native;
    const messageRef = this.messageInput();
      const textarea = messageRef?.nativeElement
      if (textarea) {
        const cursorPosition = textarea.selectionStart || 0;
        const textBeforeCursor = textarea.value.slice(0, cursorPosition);
        const textAfterCursor = textarea.value.slice(cursorPosition);
        this.messageText = textBeforeCursor + emoji + textAfterCursor;

        // Restore the cursor position and focus
        setTimeout(() => {
          const newCursorPosition = cursorPosition + emoji.length;
          textarea.setSelectionRange(newCursorPosition, newCursorPosition);
          textarea.focus();
        });
      }
  }



  /**
  * opens the profile box
  */
  openProfile() {
    this.openProfileBox = true;
  }

  /**
   * closes the profile box
   */
  closeProfilBox() {
    this.openProfileBox = false;
  }

  showEditChannel(){
    this.openEditChannel = true;
  }

  closeEditChannel(){
    this.openEditChannel = false;
  }
}
