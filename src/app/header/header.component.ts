import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
