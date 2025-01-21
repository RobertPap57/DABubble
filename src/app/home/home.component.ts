
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from "../chat-box/chat-box.component";
import { SlideSideBarComponent } from '../slide-side-bar/slide-side-bar.component';
import { ChannelService } from '../services/channel.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChatBoxComponent, SlideSideBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  channelService = inject(ChannelService);
  slideOutNavBar: boolean = false;
  threadOpen: boolean = false;    



}



