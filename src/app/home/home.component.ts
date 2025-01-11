import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from "../chat-box/chat-box.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChatBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  selectedChannelId: string = '123'; // Aktueller Channel
  selectedThreadId: string = '13';    // Aktueller Thread (leer, wenn kein Thread ausgewählt)

  // Methode zum Ändern des Threads
  openThread(threadId: string) {
    this.selectedThreadId = threadId;
  }
}



