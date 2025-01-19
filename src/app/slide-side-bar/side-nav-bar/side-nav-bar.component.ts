import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.model';
import { UserIdService } from '../../services/user-id.service';
import { ChatService } from '../../services/chat.service';

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

  constructor(private route: ActivatedRoute, public userService: UserService, public userIdService: UserIdService, private chatService: ChatService) { }

  /**
   * subscribes to the routeSub and pushes the userID to the useridservice
   */
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.userIdService.id = params['userId'];
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
    this.createNewChannel = true;
  }

  /**
   * opens a new blank message box
   */
  openNewMsgChannel() {
    this.userIdService.isServer = false;
    //opens a new Msg Box with search bar for #channel or @Alex or Email
  }

  /**
   * opens a direct Message with another user
   * 
   * @param id the id of the other user
   */
  openDirectMsg(id: string) {
    this.openedChannel = id;
    this.chatService.currentChatId = id;
    this.chatService.chatOpened = 'directMsg'
    // Geht auch mit self, muss aber gechecked werden mit if
    // Übergebe Kanal an Chat-box für direkte Nachrcht an User[i]
  }

  openChannel(i: number) {
    this.openedChannel = this.channels[i];
    // Übergebe Kanal an Chat-box Kanal[i]
  }
}
