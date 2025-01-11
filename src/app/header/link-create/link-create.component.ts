import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link-create',
  standalone: true,
  imports: [],
  templateUrl: './link-create.component.html',
  styleUrl: './link-create.component.scss',
})
export class LinkCreateComponent {
  constructor(private router: Router) {}

  openCreateAccount(): void {
    this.router.navigate(['/register']);
  }
}
