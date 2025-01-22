import { NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProfileWindowComponent } from "../../contacts/profile-window/profile-window.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgStyle, ProfileWindowComponent, NgClass, ProfileWindowComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @ViewChild('logoutBox') logoutBox!: ElementRef<HTMLDivElement>;
  @ViewChild('profileBox') profileBox!: ElementRef<HTMLDivElement>;
  openLogoutBox: boolean = false;
  openProfileBox: boolean = false;
  slideOut: boolean = false;

  constructor(public userService: UserService) { }

  @HostListener('document:mouseup', ['$event.target'])
  onClickOutsideLogoutBox(target: HTMLElement): void {
    if (this.logoutBox && !this.openProfileBox) {
      let clickInsideChan = this.logoutBox.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closeLogoutBox();
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutsideProfileBox(target: HTMLElement): void {
    if (this.profileBox) {
      let clickInsideChan = this.profileBox.nativeElement.contains(target); {
      } if (!clickInsideChan) this.closeProfilBox();
    }
  }

  openLogoutUser() {
    this.openLogoutBox = true;
    this.slideOut = false;
  }

  closeLogoutBox() {
    this.openLogoutBox = false;
  }

  closeProfilBox() {
    this.openProfileBox = false;
  }

  openProfile() {
    this.openProfileBox = true;
  }
}
