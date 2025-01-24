import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {
  @ViewChild('searchbarDropdown') searchbarDropdown!: ElementRef<HTMLDivElement>;
  dropdownActive: boolean = false;
  searchBar: string = '';
  filteredUsers: string[] = [];
  filteredChannels: string[] = [];
  filteredMessagesWithChannels: { messageId: string; channelId: string; threadId: string | null; userId: string; senderId: string; }[] = [];
  filteredMsgs: string[] = [];
  filteredMsgsThread: string[] = [];
  filteredMsgsChannel: string[] = [];
  filteredMsgsUser: string[] = [];
  filteredMsgsUserSender: string[] = [];

  
  constructor(public channelService: ChannelService, public userService: UserService, public messageService: MessageService) { }

  /**
   * a listener for mouseup event if the searchbarDropdown is active, if you click anywhere on the overlay it closes the logout box
   * 
   * @param target #searchbarDropdown
   */
  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.searchbarDropdown) {
      let clickInsideChan = this.searchbarDropdown.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closesearchbarDropdown();
    }
  }

  /**
   * closes the searchbar dropdown and clears the search bar
   */
  closesearchbarDropdown() {
    this.dropdownActive = false;
    this.searchBar = '';
  }

  /**
   * filters all the search result for the input
   * 
   * @param userInput the input the user types in the searchbar
   */
  searchResults(userInput: string) {
    this.dropdownActive = true;
    const input = userInput.toLowerCase();
    if (input.length >= 3) {
      this.filterUsers(input);
      this.filterChannels(input);
      this.filterMessages(input);
      this.splitFilter();
      console.log(this.filteredMessagesWithChannels, 'Alles');
    } else this.checkNoFindings();
  }

  /**
   * filters all users and check if the input matches one of them or includes the input
   * 
   * @param input the input the user types in the searchbar
   */
  filterUsers(input: string) {
    this.filteredUsers = this.userService.users
      .filter(users => users.name.toLowerCase().includes(input))
      .map(user => user.id);
  }

  /**
   * filters all channels and check if the input matches one of them or includes the input,
   * then checks if the input matches the users that are included on the channel
   * only return if the logged in user is also in the channel
   * 
   * @param input the input the user types in the searchbar
   */
  filterChannels(input: string) {
    this.filteredChannels = this.channelService.channels
      .filter(channel => {
        const matchesChannelName = channel.chanName.toLowerCase().includes(input);
        const hasMatchingUser = this.filteredUsers.some(userId => channel.userIds.includes(userId && this.userService.loggedUserId));
        return matchesChannelName || hasMatchingUser;
      })
      .map(channel => channel.chanId)
  }

  /**
   * filters all messages and check if the input matches one of them or includes the input,
   * then checks if the input matches the users that are included on the messages
   * 
   * @param input the input the user types in the searchbar
   */
  filterMessages(input: string) {
    this.filteredMessagesWithChannels = this.messageService.messages
      .filter(message => {
        const messageText = message.text.toLowerCase().includes(input);
        const messageSenderID = this.filteredUsers.some(userId => message.senderId.includes(userId));
        const messageReceiverID = this.filteredUsers.some(userId => message.userId.includes(userId));
        const channel = this.channelService.channels.find(chan => chan.chanId === message.channelId);
        if (channel) {
          return messageText || messageSenderID || messageReceiverID || channel.userIds.includes(this.userService.loggedUserId);
        } else return false
        })
      .map(message => ({
        messageId: message.id,
        channelId: message.channelId,
        threadId: message.threadId,
        userId: message.userId,
        senderId: message.senderId
      }));
  }

  splitFilter() {
    this.filteredMessagesWithChannels.forEach(item => {
      this.filteredMsgs.push(item.messageId || "");
      this.filteredMsgsThread.push(item.threadId || "");
      this.filteredMsgsChannel.push(item.channelId || "");
      this.filteredMsgsUser.push(item.userId || "");
      this.filteredMsgsUserSender.push(item.senderId || "");
    });
  }

  filterThreads() { }


  /**
   * sets the filtered arrays empty if nothing matches the input from the searchbar
   */
  checkNoFindings() {
    this.filteredUsers.length = 0;
    this.filteredChannels.length = 0;
    this.filteredMessagesWithChannels.length = 0;
  }

  /**
   * opens a direct Message with another user
   * 
   * @param id the id of the other user selected
   */
  opendirectMsg(id: string) {
    this.userService.privMsgUserId = id;
    this.channelService.channelChatId = '';
    this.searchBar = '';
  }

  /**
   * opens a new channeltab
   * 
   * @param id the id of the channel selected
   */
  openChannel(id: string) {
    this.channelService.channelChatId = id;
    this.userService.privMsgUserId = '';
    this.searchBar = '';
    this.messageService.threadOpen = false;
  }

  /**
   * opens a new threadTab
   * 
   * @param id the id of the thread selected
   */
  openThread(id: string | null) {
    if (id) {
      this.messageService.threadOpen = true;
      this.channelService.channelChatId = '';
      this.userService.privMsgUserId = '';
      this.searchBar = '';
      this.messageService.threadId = id;
    }
  }

  openMessage() { }// hier noch etwas hinzufügen was ich genau suchen soll
}
