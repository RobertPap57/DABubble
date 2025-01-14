import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LinkCreateComponent } from './link-create/link-create.component';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent, LinkCreateComponent, NgClass, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoginRoute: boolean = false;
  isHomeRoute:boolean = false;
  animationPlayed: boolean = false;
  serverOpen: boolean = false;
  server: string = 'Devspace';

  constructor(private router: Router) {
    this.ngOnInit();
  }

  ngOnInit() {
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.isHomeRoute = event.url.endsWith('/home');
      this.isLoginRoute = event.url.endsWith('/login');
      setTimeout(() => this.animationPlayed = true, 3000);
    });
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
