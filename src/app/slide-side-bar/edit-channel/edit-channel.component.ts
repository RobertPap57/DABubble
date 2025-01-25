import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { UserService } from '../../services/user.service';
import { Channel } from '../../interfaces/channel.model';


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
  @Input({required: true}) channelId!: string;

  channel!: Channel;
  channelCreatorName: string = '';

  constructor(private userService: UserService ,private channelService: ChannelService) {

  }

  ngOnInit(): void {
    this.channelService.channels.forEach(element => {
      if (element.chanId === this.channelId) {
        this.channel = {
          ...element
        }
      }
    });
    this.channelCreatorName = this.userService.getUserById(this.channel.chanCreatedByUser).name;
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

  /**
   * closes the module Create Channel
   */
  closeEditChannel() {
    this.channelService.createChannelBox = false;
  }

  updateChannel() {
    this.channelService.updateChannel(this.channel);
  }
}
