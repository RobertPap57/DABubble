import { NgClass, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.model';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [NgStyle, NgClass, CreateChannelComponent],
  templateUrl: './side-nav-bar.component.html',
  styleUrl: './side-nav-bar.component.scss'
})
export class SideNavBarComponent {
  private routeSub!: Subscription;
  private userSub!: Subscription;
  id: string = '';
  @Input() slideOut = false;
  channels = ['Entwicklerteam', 'Kekse essen']
  channelsVisible = true;
  users: User[] = [];
  directMsgVisible = true;
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  openedChannel: string = '';
  createNewChannel = false;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['userId'];
      console.log(this.userService.users);
    });
    this.userSub = this.userService.usersUpdated.subscribe((users) => {
      this.users = users;
      console.log('Benutzer geladen:', this.users);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  getUserList() {
    console.log(this.userService.users);
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
