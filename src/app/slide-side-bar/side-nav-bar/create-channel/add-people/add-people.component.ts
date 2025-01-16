import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateChannelComponent } from '../create-channel.component';
import { ChannelService } from '../../../../services/channel.service';

@Component({
  selector: 'app-add-people',
  standalone: true,
  imports: [NgStyle, CommonModule, FormsModule],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss'
})
export class AddPeopleComponent {
  channelService = inject(ChannelService);
  openDialog = inject(CreateChannelComponent);
  @ViewChild('createPeopleBox') createPeopleBox!: ElementRef<HTMLDivElement>;
  @ViewChild('focusdropdown') focusDropdown!: ElementRef;
  selectedOption: string | null = null;
  dropdownActive: boolean = false;
  usersFromService: string[] = ['Lars Schumacher', 'Alexander Hardtke', 'Alex2', 'Alex3', 'Alex4', 'Alex5', 'Alex6'];
  filteredUsers: string[] = [];
  userImg = ['steffen-hoffmann-avatar.png', '01.Charaters.png', '02.Charaters.png', '01.Charaters.png', '02.Charaters.png', '01.Charaters.png', '02.Charaters.png'];
  userOnline = [true, false, false, true, false, true, false,];
  inputPlaceholder = 'Name eingeben';
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  selectedUser: string[] = [];
  searchUser: string = '';

  constructor() {
    this.filteredUsers = [...this.usersFromService];
  }

  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsidePpl(target: HTMLElement): void {
    if (this.createPeopleBox) {
      let clickInsidePpl = this.createPeopleBox.nativeElement.contains(target); {
      } if (!clickInsidePpl) this.openDialog.closeCreateChan();
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
      this.channelService.userIds = this.usersFromService;
    } else {
      this.channelService.userIds = this.selectedUser;
    }
    const channel = this.channelService.getCurChanObj();
    this.channelService.createChannel(channel);
    this.openDialog.closeCreateChan();
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
}