import { Component } from '@angular/core';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { SearchbarComponent } from '../header/searchbar/searchbar.component';

@Component({
  selector: 'app-slide-side-bar',
  standalone: true,
  imports: [SideNavBarComponent, SearchbarComponent],
  templateUrl: './slide-side-bar.component.html',
  styleUrl: './slide-side-bar.component.scss'
})
export class SlideSideBarComponent {
  sideNavOpen = true;
  slideOut = false;

  toggleSideBar() {
    if (this.sideNavOpen) {
      this.slideOut = true;
      setTimeout(() => {
        this.sideNavOpen = !this.sideNavOpen;
        this.slideOut = false;
      }, 200);
    } else { this.sideNavOpen = !this.sideNavOpen; }
  }
}
