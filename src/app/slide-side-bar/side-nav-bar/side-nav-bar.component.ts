import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.model';
import { UserIdService } from '../../services/user-id.service';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [NgStyle, NgClass, CreateChannelComponent],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  private routeSub!: Subscription;
  @Input() slideOut = false;
  channels = ['Entwicklerteam', 'Kekse essen']
  channelsVisible = true;
  users: User[] = [];
  directMsgVisible = true;
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  openedChannel: string = '';
  createNewChannel = false;

  constructor(private route: ActivatedRoute, public userService: UserService, public userIdService: UserIdService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userIdService.id = params['userId'];
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  getUserList() {
    return this.userService.users;
  }

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

  openDirectMsg(id: string) {
    this.openedChannel = id;
    // this.openedChannel = id;
    // Geht auch mit self, muss aber gechecked werden mit if
    // Übergebe Kanal an Chat-box für direkte Nachrcht an User[i]
  }

  openChannel(i: number) {
    this.openedChannel = this.channels[i];
    // Übergebe Kanal an Chat-box Kanal[i]
  }
}
