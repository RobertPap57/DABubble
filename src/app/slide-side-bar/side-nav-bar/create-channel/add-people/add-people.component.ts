import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { SideNavBarComponent } from '../../side-nav-bar.component';
import { CreateChannelComponent } from '../create-channel.component';

@Component({
  selector: 'app-add-people',
  standalone: true,
  imports: [],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss'
})
export class AddPeopleComponent {
  openDialog = inject(CreateChannelComponent);
  closeDialog = inject(SideNavBarComponent);
  @ViewChild('createPeopleBox') createPeopleBox!: ElementRef<HTMLDivElement>;

  @HostListener('document:click', ['$event.target'])
  onClickOutsidePpl(target: HTMLElement): void {
    if (this.createPeopleBox) {
      let clickInsidePpl = this.createPeopleBox.nativeElement.contains(target); {
      } if (!clickInsidePpl) this.openDialog.closeCreateChan();
    }
  }
}
