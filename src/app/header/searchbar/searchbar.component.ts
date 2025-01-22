import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../chat-box/message/message.service';

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
  filteredMsgs: string[] = [];

  constructor(public channelService: ChannelService, public userService: UserService, public messageService: MessageService) { }

  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.searchbarDropdown) {
      let clickInsideChan = this.searchbarDropdown.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closesearchbarDropdown();
    }
  }

  closesearchbarDropdown() {
    this.dropdownActive = false;
    this.searchBar = '';
  }

  searchResults(userInput: string) {
    this.dropdownActive = true;
    const input = userInput.toLowerCase();
    if (input.length >= 3) {
      this.filterUsers(input);
      this.filterChannels(input);
      this.filterMessages(input);
    } else this.checkNoFindings();
  }

  filterUsers(input: string) {
    this.filteredUsers = this.userService.users
      .filter(users => users.name.toLowerCase().includes(input))
      .map(user => user.id);
  }

  filterChannels(input: string) {
    this.filteredChannels = this.channelService.channels
      .filter(channel => {
        const matchesChannelName = channel.chanName.toLowerCase().includes(input);
        const hasMatchingUser = this.filteredUsers.some(userId => channel.userIds.includes(userId));
        return matchesChannelName || hasMatchingUser;
      })
      .map(channel => channel.chanId)
  }

  filterMessages(input: string) {
    this.filteredMsgs = this.messageService.messages
      .filter(message => {
        const messageText = message.text.toLowerCase().includes(input);
        const messageSenderID = this.filteredUsers.some(userId => message.senderId.includes(userId));
        const messageReceiverID = this.filteredUsers.some(userId => message.userId.includes(userId));
        return messageText || messageSenderID || messageReceiverID;
      })
      .map(msg => msg.id);
  }

  checkNoFindings() {
    this.filteredUsers.length = 0;
    this.filteredChannels.length = 0;
    this.filteredMsgs.length = 0;
  }
}
