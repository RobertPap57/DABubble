import { Component } from '@angular/core';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { SearchbarComponent } from '../header/searchbar/searchbar.component';
import { ChatService } from '../services/chat.service';
import { CreateChannelComponent } from './side-nav-bar/create-channel/create-channel.component';


@Component({
  selector: 'app-slide-side-bar',
  standalone: true,
  imports: [SideNavBarComponent, SearchbarComponent, CreateChannelComponent],
  templateUrl: './slide-side-bar.component.html',
  styleUrl: './slide-side-bar.component.scss'
})
export class SlideSideBarComponent {

  constructor(public chatService: ChatService) { }

  /**
   * toggles the sideBar in and out of the screen
   */
  toggleSideBar() {
    this.chatService.slideOutNavBar = !this.chatService.slideOutNavBar;
  }
}
