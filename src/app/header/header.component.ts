import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LinkCreateComponent } from './link-create/link-create.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent, LinkCreateComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
