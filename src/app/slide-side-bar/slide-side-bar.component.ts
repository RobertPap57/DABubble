import { Component } from '@angular/core';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';

@Component({
  selector: 'app-slide-side-bar',
  standalone: true,
  imports: [SideNavBarComponent],
  templateUrl: './slide-side-bar.component.html',
  styleUrl: './slide-side-bar.component.scss'
})
export class SlideSideBarComponent {
  sideNavOpen = true;

  toggleSideBar() {
    this.sideNavOpen = !this.sideNavOpen;
  }
}
