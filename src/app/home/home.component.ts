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

  slideOutNavBar: boolean = false;
  selectedChannelId: string = '123'; // Aktueller Channel
  selectedThreadId: string = '';    // Aktueller Thread (leer, wenn kein Thread ausgewählt)

  constructor(public channelService: ChannelService) {}

  // Methode zum Ändern des Threads
  openThread(threadId: string) {
    this.selectedThreadId = threadId;
  }
}



