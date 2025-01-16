import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss'
})
export class SearchbarComponent {
  filteredArr: string[] = [];
  dropdownActive: boolean = false;
  searchBar: string = '';
  chatsFromService: string[] = [];
  threadsFromService: string[] = [];
  messageFromService: string[] = [];
  usersFromService: string[] = ['Lars Schumacher', 'Alexander Hardtke', 'Alex2', 'Alex3', 'Alex4', 'Alex5', 'Alex6'];
  filteredUsers: string[] = [];


  constructor() {
    // this.chatsFromService = [...this.importService.getData];
    // this.threadsFromService = [...this.importService.getData];
    // this.privMsgFromService = [...this.importService.getData];
    // this.usersFromService = [...this.importService.getData];
  }

  searchResults(userInput: string) {
    this.dropdownActive = true;
    if (!userInput) this.filteredArr = [];// return empty container user muss sehen das nichts gefunden werden kann
    else {
      const input = userInput.toLowerCase();
      this.filteredArr = [
        ...this.usersFromService.filter(user => user.toLowerCase().includes(input)),
        ...this.messageFromService.filter(message => message.toLowerCase().includes(input)),
        ...this.threadsFromService.filter(threads => threads.toLowerCase().includes(input)),
        ...this.chatsFromService.filter(chats => chats.toLowerCase().includes(input))
      ];
    }
    this.checkNoFindings();
  }

  checkNoFindings() {
    if (this.filteredArr.length === 0) {
      //Show nothing found
      console.log(this.filteredArr);
    }
  }
}
