import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LinkCreateComponent } from './link-create/link-create.component';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent, LinkCreateComponent, NgClass, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoginRoute: boolean = false;
  animationPlayed: boolean = false;
  serverOpen: boolean = false;
  server: string = 'Devspace';

  constructor(private router: Router) {
  }

  /**
   * subscribe to an eventListener to check the screensize of the User and checks if the user is on the login Page
   */
  // ngOnInit() {
  //   this.isLoginRoute = this.router.url.endsWith(''); // Wir brauchen hier login vom Router sonst ist der wert immer true
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('resize', this.handleResize.bind(this));
  //     this.handleResize();
  //     setTimeout(() => this.animationPlayed = true, 3000);
  //     console.log(this.isLoginRoute);
  //   }
  // }

  /**
   * unsubscribes the eventListener to check the screensize of the User
   */
  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  /**
   * checks if the servertab is open
   */
  handleResize() {
    if (this.serverOpen) this.serverOpen = window.innerWidth < 1024;
  }

  /**
   * opens back the startScreen in the header for mobile
   */
  backToServer() {
    this.serverOpen = false;
  }
}
