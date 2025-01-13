import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  @Input() slideOut = false;
  channels = ['Entwicklerteam', 'Kekse essen']
  channelsVisible = true;
  addedUsers = ['Plato', 'Friedrich Nietzsche', 'Carl Jung', 'Sigmund Freud']
  directMsgVisible = true;
  addedUserImg = ['Alex1.png', '01.Charaters.png', '02.Charaters.png', '03.Charaters.png']
  addedUserOnline = [true, false, false, true]
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  openedChannel: string = '';

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
  
  addChannel(i: number) {
    //Adding Channel
      i++
      let channel = "Neuer Kanal" + i
      if (this.channels.includes(channel)) {
        this.addChannel(i);
        return
      } else {
        this.channels.push(channel);
      }
  }

  editChannel() { }

  openDirectMsg(i: number) {
    this.openedChannel = this.addedUsers[i];
    // Übergebe Kanal an Chat-box
  }

  openChannel(i: number) {
    this.openedChannel = this.channels[i];
    // Übergebe Kanal an Chat-box
  }
}
