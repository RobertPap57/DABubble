import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../services/channel.service';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  private routeSub!: Subscription;
  channels = ['Entwicklerteam', 'Kekse essen']
  channelsVisible = true;
  directMsgVisible = true;
  onlineColor = '#92c73e';
  offlineColor = '#696969';

  constructor(private route: ActivatedRoute, public userService: UserService, public channelService: ChannelService) { }

  /**
   * subscribes to the routeSub and pushes the userID to the userService
   */
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userService.loggedUserId = params['userId'];
    });
  }

  /**
   * unsubscribes from the routeSub
   */
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  /**
   * gets all Users from the userservice
   * 
   * @returns all users on the server
   */
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

  /**
   * opens the create Channel Box
   */
  openCreateChannel() {
    this.channelService.createChannelBox = true;
  }

  /**
   * opens a new blank message box
   */
  openNewMsgChannel() {
    this.channelService.isServer = false;
    //opens a new Msg Box with search bar for #channel or @Alex or Email
  }

  /**
   * opens a direct Message with another user
   * 
   * @param id the id of the other user
   */
  openDirectMsg(id: string) {
    this.userService.privMsgUserId = id;
    this.channelService.channelChatId = '';
  }

  /**
   * opens a new channeltab
   * 
   * @param id the id of the channel
   */
  openChannel(id: string) {
    this.channelService.channelChatId = id;
    this.userService.privMsgUserId = '';
  }
}
