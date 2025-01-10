import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { LinkCreateComponent } from './link-create/link-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileComponent, SearchbarComponent, LinkCreateComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoginRoute: boolean = false;
  serverOpen: boolean = true;
  server: string = 'Devspace';

  // constructor(private router: Router) {
  //   this.router.events.subscribe(() => {
  //     this.isLoginRoute = this.router.url.endsWith('');
  //   });
  // }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
      this.handleResize();
    }
  }
  
  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }
  
  handleResize() {
    if (this.serverOpen) {
      this.serverOpen = window.innerWidth < 1024;
    }
  }

  backToServer() {
    // deactivate animation
    this.serverOpen = false;
  }
}
