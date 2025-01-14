import { Component, inject } from '@angular/core';
import { SideNavBarComponent } from '../../side-nav-bar/side-nav-bar.component';
import { CreateChannelComponent } from '../../side-nav-bar/create-channel/create-channel.component';

@Component({
  selector: 'app-add-people',
  standalone: true,
  imports: [],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss'
})
export class AddPeopleComponent {
  openDialog = inject(CreateChannelComponent);
  closeDialog = inject(SideNavBarComponent);

}
