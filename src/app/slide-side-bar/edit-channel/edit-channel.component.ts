import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent {
  inputPlaceholder = 'Name eingeben';
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  @ViewChild('createdChannelBox') createdChannelBox!: ElementRef<HTMLDivElement>;
  @ViewChild('createPeopleBox') createPeopleBox!: ElementRef<HTMLDivElement>;
  @ViewChild('focusdropdown') focusDropdown!: ElementRef;

  addingUsers: boolean = false;
  dropdownActive: boolean = false;

  channelName: string = '';
  channelDescription: string = '';
  selectedUserId: string[] = [];
  selectedOption: string | null = null;

  searchInput: string = '';
  searchUser: string = '';
  searchIds: string[] = [];

  constructor(public userService: UserService, private channelService: ChannelService) {
    this.searchIds = this.userService.users.map(user => user.id);
  }

  /**
   * closes the Module if the user clicks outside the input box
   * 
   * @param target The Box with the inputs for the channela
   */
  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.createdChannelBox || this.createPeopleBox) {
      let clickInsideChan = this.createdChannelBox.nativeElement.contains(target);
      let clickInsidePpl = this.createPeopleBox.nativeElement.contains(target);
      if (!clickInsideChan && !clickInsidePpl) this.closeEditChannel();
    }
  }

  @HostListener('document:mousedown', ['$event.target'])
  onClickOutsideDrop(target: HTMLElement): void {
    if (this.createPeopleBox) {
      let clickInsideDrop = this.focusDropdown?.nativeElement.contains(target); {
      } if (!clickInsideDrop) this.dropdownActive = false;;
    }
  }

  /**
   * closes the module Create Channel
   */
  closeEditChannel() {
    this.channelService.createChannelBox = false;
  }
}
