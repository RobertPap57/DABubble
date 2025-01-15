
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar.component';
import { AddPeopleComponent } from './add-people/add-people.component';
import { ChannelService } from '../../../services/channel.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddPeopleComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  channelData = inject(ChannelService);
  closeDialog = inject(SideNavBarComponent);
  creatingChannel: boolean = false;
  @ViewChild('createdChannelBox') createdChannelBox!: ElementRef<HTMLDivElement>;
  channelName: string = '';
  channelDescription: string = '';



/**
 * closes the Module if the user clicks outside the input box
 * 
 * @param target The Box with the inputs for the channel
 */
  @HostListener('document:click', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.createdChannelBox) {
      let clickInsideChan = this.createdChannelBox.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closeCreateChan();
    }
  }

  /**
   * closes the module
   */
  closeCreateChan() {
    this.closeDialog.createNewChannel = false;
  }

  /**
   * checks if the Channel has a correct name and is no duplicate, if it is create Channel with a number before the name
   */
  checkChanName() {
    if (this.channelName.length > 2) {
      let baseName = this.channelName;
      let newName = baseName;
      let counter = 1;
      while (this.closeDialog.channels.includes(newName)) {
        newName = `${counter} ${baseName}`;
        counter++;
      }
      this.channelData.chanName = newName;
      this.channelData.chanDescription = this.channelDescription;
      this.creatingChannel = true;
    }
  }

  finalizeChannel() {
    this.closeCreateChan();
    // this.closeDialog.createChannel(newName, this.channelDescription);
    // check if empty
  }
}
