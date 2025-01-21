import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';

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
  filteredThreads: string[] = [];
  filteredMsgs: string[] = [];

  constructor(public channelService: ChannelService, public userService: UserService) { }

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
    const input = userInput.toLowerCase();
    if (input.length >= 3) {
      this.filteredUsers = this.userService.users
        .filter(users => users.name.toLowerCase().includes(input))
        .map(user => user.id);
        console.log(this.filteredUsers);

      this.filteredChannels = this.channelService.channels
        .filter(channels => channels.chanName.toLowerCase().includes(input))
        .map(channel => channel.chanId);
        console.log(this.filteredChannels);

    }
    this.checkNoFindings();
  }

  checkNoFindings() {
    if (this.filteredUsers.length === 0) {
      console.log(this.filteredUsers);
    }
  }
}
