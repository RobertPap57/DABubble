
import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideNavBarComponent } from '../side-nav-bar.component';
import { AddPeopleComponent } from './add-people/add-people.component';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule, CommonModule, AddPeopleComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  creatingChannel: boolean = false;
  @ViewChild('createdChannelBox') createdChannelBox!: ElementRef<HTMLDivElement>;
  channelName: string = '';
  channelDescription: string = '';
  closeDialog = inject(SideNavBarComponent);



  @HostListener('document:click', ['$event.target'])
  onClickOutsideChan(target: HTMLElement): void {
    if (this.createdChannelBox) {
      let clickInsideChan = this.createdChannelBox.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closeCreateChan();
    }
  }

  closeCreateChan() {
    this.closeDialog.createNewChannel = false;
  }

  createChanel() {
    let baseName = this.channelName;
    let newName = baseName;
    let counter = 1;
    while (this.closeDialog.channels.includes(newName)) {
      newName = `${counter} ${baseName}`;
      counter++;
    }
    this.creatingChannel = true;

  }

  finalizeChannel() {
    this.closeCreateChan();
    // this.closeDialog.createChannel(newName, this.channelDescription);
    // check if empty
  }
}
