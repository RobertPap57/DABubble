import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CreateChannelComponent } from './create-channel/create-channel.component';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [NgStyle, NgClass, CreateChannelComponent],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  @Input() slideOut = false;
  channels = ['Entwicklerteam', 'Kekse essen']
  channelsVisible = true;
  addedUsers = ['Plato', 'Friedrich Nietzsche', 'Carl Jung', 'Sigmund Freud']
  directMsgVisible = true;
  addedUserImg = ['steffen-hoffmann-avatar.png', '01.Charaters.png', '02.Charaters.png', '03.Charaters.png']
  addedUserOnline = [true, false, false, true]
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  openedChannel: string = '';
  createNewChannel = false;

  /**
   * toggles the visibility of the channels
   */
  toggleChannels() {
    this.channelsVisible = !this.channelsVisible;
  }

  /**
   * toggles the visibility of the users in direct messages
   */
  toggleDirectMsgs() {
    this.directMsgVisible = !this.directMsgVisible;
  }

  createChannel(name: string, description: string) {
    let channel = name;
    this.channels.push(channel);
  }

  openCreateChannel() {
    this.createNewChannel = true;
  }

  openNewMsgChannel() {
    //opens a new Msg Box with search bar for #channel or @Alex or Email
  }

  openDirectMsg(i: number) {
    this.openedChannel = this.addedUsers[i];
    // Übergebe Kanal an Chat-box für direkte Nachrcht an User[i]
  }

  opendirecMsgMyself() {}

  openChannel(i: number) {
    this.openedChannel = this.channels[i];
    // Übergebe Kanal an Chat-box Kanal[i]
  }
}
