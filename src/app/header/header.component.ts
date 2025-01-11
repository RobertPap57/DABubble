import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LinkCreateComponent } from './link-create/link-create.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent, LinkCreateComponent, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoginRoute: boolean = false;
  serverOpen: boolean = true;
  animationActive: boolean = true;
  animationTriggered: boolean = false;
  server: string = 'Devspace';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url.endsWith('');
    });
  }

  /**
   * subscribe to an eventListener to check the screensize of the User
   */
  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.handleResize();
    }
  }

  /**
   * unsubscribes the eventListener to check the screensize of the User
   */
  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  /**
   * checks if the the window is below 1024px and checks if the server
   * tab is open and plays the startAnimation just once
   */
  handleResize() {
    if (this.serverOpen) this.serverOpen = window.innerWidth < 1024;
    if (!this.animationTriggered && window.innerWidth < 1024) {
      this.animationTriggered = true;
      this.animationActive = true;
      setTimeout(() => this.animationActive = false, 5000);
    }
  }

  /**
   * opens back the startScreen in the header for mobile
   */
  backToServer() {
    this.serverOpen = false;
  }
}
