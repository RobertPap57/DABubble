
import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {
  channelName:string = '';
  channelDescription:string = '';
  @Output()

  closeCreateChan() {}

  createChanel() {}

}
