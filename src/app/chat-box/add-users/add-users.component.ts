import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ChatBoxComponent } from '../chat-box.component';
import { UserService } from '../../services/user.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [NgStyle, FormsModule, CommonModule],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})
export class AddUsersComponent {
  dropdownActive: boolean = false;
  selectedUserId: string[] = [];
  searchInput: string = '';
  searchUser: string = '';
  searchIds: string[] = [];
  inputPlaceholder = 'Name eingeben';
  onlineColor = '#92c73e';
  offlineColor = '#696969';
  @ViewChild('createPeopleBox') createPeopleBox!: ElementRef<HTMLDivElement>;
  @ViewChild('focusdropdown') focusDropdown!: ElementRef;

  constructor(public chatBox: ChatBoxComponent, public userService: UserService) { }


  @HostListener('document:mousedown', ['$event.target'])
  onClickOutsideDrop(target: HTMLElement): void {
    if (this.createPeopleBox) {
      let clickInsideDrop = this.focusDropdown?.nativeElement.contains(target); {
      } if (!clickInsideDrop) this.dropdownActive = false;;
    }
  }



  /**
 * checks if no user is selected and changes the placeholder of the input
 */
  checkInputEmpty() {
    if (this.selectedUserId.length === 0) {
      this.inputPlaceholder = 'Name eingeben';
    }
  }

  /**
    * checks if the user is already selected
    * 
    * @param id user id
    * @returns true if User is already selected
    */
  isSelected(id: string): boolean {
    return this.selectedUserId.includes(id);
  }

  /**
   * adds the User to the channel that is created
   * 
   * @param id the user id that is to be added
   */
  selectUser(id: string) {
    this.inputPlaceholder = '';
    if (this.isSelected(id)) {
      this.selectedUserId.forEach((element, index) => {
        if (element === id) {
          this.selectedUserId.splice(index, 1);
          this.checkInputEmpty();
        }
      });
    } else this.selectedUserId.push(id);
  }

  /**
 * checks the inputfield and updates the dropwdownmenu for the result
 */
  updateField() {
    const input = this.searchInput.toLowerCase();
    if (input.length >= 3) {
      this.searchIds = this.userService.users
        .filter(user => user.name.toLowerCase().includes(input))
        .map(user => user.id);
    } else this.searchIds = this.userService.users.map(user => user.id);
  }
}
