
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../../services/channel.service';
import { ChatService } from '../../../services/chat.service';
import { UserService } from '../../../services/user.service';
import { UserIdService } from '../../../services/user-id.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  channelData = inject(ChannelService);
  addingUsers: boolean = false;
  @ViewChild('createdChannelBox') createdChannelBox!: ElementRef<HTMLDivElement>;
  @ViewChild('createPeopleBox') createPeopleBox!: ElementRef<HTMLDivElement>;
  @ViewChild('focusdropdown') focusDropdown!: ElementRef;
  channelName: string = '';
  channelDescription: string = '';
  chanCreatedByUser: string = '';
  selectedOption: string | null = null;
  dropdownActive: boolean = false;
  usersFromService: string[] = [];
  filteredUsers: string[] = [];
  userImg: string[] = [];
  userOnline = [true, false, false, true, false, true, false,];
  inputPlaceholder = 'Name eingeben';
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  selectedUser: string[] = [];
  searchUser: string = '';
  users: {} = {}

  constructor(public chatService: ChatService, public userService: UserService, public userIdService: UserIdService) {
    this.users = [...this.userService.users];
    for (let i = 0; i < this.userService.users.length; i++) {
      let singelUser = this.userService.users[i];
      this.usersFromService.push(singelUser.name);
      this.userImg.push(singelUser.userImage);
    }
    this.filteredUsers = [...this.usersFromService];
  }

  /**
   * closes the Module if the user clicks outside the input box
   * 
   * @param target The Box with the inputs for the channel
   */
  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.createdChannelBox || this.createPeopleBox) {
      let clickInsideChan = this.createdChannelBox.nativeElement.contains(target);
      let clickInsidePpl = this.createPeopleBox.nativeElement.contains(target);
      if (!clickInsideChan && !clickInsidePpl) this.closeCreateChan();
    }
  }

  @HostListener('document:mousedown', ['$event.target'])
  onClickOutsideDrop(target: HTMLElement): void {
    if (this.createPeopleBox) {
      let clickInsideDrop = this.focusDropdown?.nativeElement.contains(target); {
      } if (!clickInsideDrop) this.dropdownActive = false;;
    }
  }

  selectUser(user: string) {
    this.inputPlaceholder = '';
    if (this.isSelected(user)) {
      this.selectedUser.forEach((element, index) => {
        if (element === user) {
          this.selectedUser.splice(index, 1);
          this.checkInputEmpty();
        }
      });
    } else this.selectedUser.push(user);
  }

  checkInputEmpty() {
    if (this.selectedUser.length === 0) {
      this.inputPlaceholder = 'Name eingeben';
    }
  }

  isSelected(user: string): boolean {
    return this.selectedUser.includes(user);
  }

  createChanel() {
    if (this.selectedUser.length === 0 && this.selectedOption !== 'all') return;
    if (this.selectedOption === 'all') {
      this.channelData.userIds = this.usersFromService;
    } else {
      this.channelData.userIds = this.selectedUser;
    }
    const channel = this.channelData.getCurChanObj();
    this.channelData.createChannel(channel);
    this.closeCreateChan();
  }

  updateField() {
    let input = this.searchUser.toLowerCase();
    if (input.length >= 3) {
      this.filteredUsers = this.usersFromService.filter(user =>
        user.toLowerCase().includes(input));
    } else {
      this.filteredUsers = [...this.usersFromService];
    }
  }

  /**
   * closes the module
   */
  closeCreateChan() {
    this.chatService.createChannel = false;
  }

  closeAddUsers() {
    this.addingUsers = false;
  }

  /**
   * checks if the Channel has a correct name and is no duplicate, if it is create Channel with a number before the name
   */
  checkChanName() {
    if (this.channelName.length > 2) {
      let baseName = this.channelName;
      let newName = baseName;
      let counter = 1;
      // while (this.closeDialog.channels.includes(newName)) {
      newName = `${counter} ${baseName}`;
      counter++;
      // }
      this.channelData.chanName = newName;
      this.channelData.chanDescription = this.channelDescription;
      this.channelData.chanCreatedByUser = this.chanCreatedByUser; // user ID oder Username???
      this.addingUsers = true;
    }
  }
}
