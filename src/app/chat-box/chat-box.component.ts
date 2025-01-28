import { user } from '@angular/fire/auth';


import { User } from './../interfaces/user.model';
import { serverTimestamp } from 'firebase/firestore';
import { Component, Input, Inject, inject, PLATFORM_ID, HostListener, ElementRef, ViewChild, viewChild, Signal, AfterViewInit } from '@angular/core';
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
import { SearchbarComponent } from '../header/searchbar/searchbar.component';
import { ContactWindowComponent } from '../contacts/contact-window/contact-window.component';
import { EditChannelComponent } from '../slide-side-bar/edit-channel/edit-channel.component';
import { Channel } from '../interfaces/channel.model';
import { EmojiService } from '../services/emoji.service';
import { Subscription } from 'rxjs';
import { AddUsersComponent } from './add-users/add-users.component';



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
    EditChannelComponent,
    SearchbarComponent,
    AddUsersComponent
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
  usersBoxInChannel = false;
  suggestedUsers: User[] = []; // Assuming user objects
  suggestedChannels: Channel[] = []; // Assuming channel obje
  showSuggestions: boolean = false;
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
      if (destination === 'threadMessage') {
        this.addEmojiInThread(event);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.emojiSubscription) {
      this.emojiSubscription.unsubscribe();
    }
  }


  onInput(event: any): void {
    const inputText = event.target.value;
    const cursorPosition = event.target.selectionStart;

    // Find the position of the last @ or # character
    const lastAtIndex = inputText.lastIndexOf('@');
    const lastHashIndex = inputText.lastIndexOf('#');
    const lastIndex = Math.max(lastAtIndex, lastHashIndex);

    // If there's an @ or # in the input
    if (lastIndex !== -1) {
      const searchTerm = inputText.slice(lastIndex + 1, cursorPosition); // Get text after @ or #

      if (inputText[lastIndex] === '@') {
        this.searchUsers(searchTerm); // Search users
      } else if (inputText[lastIndex] === '#') {
        this.searchChannels(searchTerm); // Search channels
      }


    } else {
      this.showSuggestions = false; 
      this.suggestedUsers = [];
      this.suggestedChannels = [];
    }
  }

  searchUsers(input: string): void {
    this.suggestedUsers = this.userService.users
      .filter(user => user.name.toLowerCase().includes(input.toLowerCase()));
    this.showSuggestions = this.suggestedUsers.length > 0;
  }

  searchChannels(input: string): void {
    this.suggestedChannels = this.channelService.channels
      .filter(channel => 
          channel.userIds.includes(this.userService.loggedUserId) && // Check if the logged user is in the channel
          channel.chanName.toLowerCase().includes(input.toLowerCase()) // Filter by channel name
      );

    this.showSuggestions = this.suggestedChannels.length > 0; // Show suggestions if any channels match
}

selectSuggestion(suggestion: any): void {
  // Determine which textarea to use based on chatType
  const textareaRef = this.chatType === 'thread' ? this.threadMessageInput() : this.messageInput();
  const textarea = textareaRef?.nativeElement;

  if (!textarea) {
      console.error('Textarea is undefined'); // Log an error if textarea is not found
      return; // Exit the function if textarea is not defined
  }

  const cursorPosition = textarea.selectionStart;

  const textBeforeCursor = textarea.value.slice(0, cursorPosition);
  const textAfterCursor = textarea.value.slice(cursorPosition);

  // Determine the last @ or # position
  const lastAtIndex = textBeforeCursor.lastIndexOf('@');
  const lastHashIndex = textBeforeCursor.lastIndexOf('#');
  const lastIndex = Math.max(lastAtIndex, lastHashIndex);

  // Determine the tag and name based on the last character
  let tag: string;
  let name: string;

  if (lastAtIndex > lastHashIndex) {
      tag = '@';
      name = suggestion.name; // Assuming suggestion is a user object
  } else {
      tag = '#';
      name = suggestion.chanName; // Assuming suggestion is a channel object
  }

  if (!name) {
      console.error('Name is undefined'); // Log if name is not found
      return; // Exit if name is undefined
  }

  // Create new text
  const updatedText = textBeforeCursor.slice(0, lastIndex) + tag + name + ' ' + textAfterCursor;

  // Update the bound model
  if (this.chatType === 'thread') {
    this.threadMessageText = updatedText; // For thread messages
  } else {
    this.messageText = updatedText; // For main messages
  }

  // Restore the cursor position
  setTimeout(() => {
      const newCursorPosition = lastIndex + name.length + 2; // +2 for @ or # and the space
      textarea.value = updatedText; // Update the textarea value
      textarea.setSelectionRange(newCursorPosition, newCursorPosition); // Set cursor position
      textarea.focus();
  });

  this.showSuggestions = false; // Hide suggestions after selection
  this.suggestedUsers = []; // Clear suggested users
  this.suggestedChannels = []; // Clear suggested channels

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
    if (this.messageText.trim() !== '' || this.threadMessageText.trim() !== '') {
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

  showEditChannel() {
    this.openEditChannel = true;
  }

  closeEditChannel() {
    this.openEditChannel = false;
  }

  closeDisplayUsersBox() {
    this.addUsersToChannel = false;
  }

  openDisplayUsersBox() {
    this.addUsersToChannel = true;
  }

  toggleDisplayAddBox() {
    this.usersBoxInChannel = !this.usersBoxInChannel;
  }
}
