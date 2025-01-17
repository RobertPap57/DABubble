import { NgStyle } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserIdService } from '../../services/user-id.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  @ViewChild('logoutBox') logoutBox!: ElementRef<HTMLDivElement>;
  @ViewChild('profileBox') profileBox!: ElementRef<HTMLDivElement>;
  onlineColor:string = '#92c73e';
  offlineColor:string = '#696969';
  openLogoutBox = false;
  openProfileBox = false;

  constructor(public userIdService: UserIdService, public userService: UserService) { }

    @HostListener('document:mouseup', ['$event.target'])
    onClickOutsideLogoutBox(target: HTMLElement): void {
      if (this.logoutBox) {
        let clickInsideChan = this.logoutBox.nativeElement.contains(target); {
        } if (!clickInsideChan) this.closeLogoutBox();
      }
    }

    @HostListener('document:click', ['$event.target'])
    onClickOutsideProfileBox(target: HTMLElement): void {
      if (this.profileBox) {
        let clickInsideChan = this.profileBox.nativeElement.contains(target); {
        } if (!clickInsideChan) this.closeLogoutBox();
      }
    }

  openLogoutUser() {
    this.openLogoutBox = true;
  }

  closeLogoutBox() {
    this.openLogoutBox = false;
  }

  openProfile(id: string) {
    this.openProfileBox = true;
  }
}
