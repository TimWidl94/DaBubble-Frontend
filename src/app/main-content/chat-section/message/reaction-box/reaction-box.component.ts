import { UsersService } from './../../../../services/users.service';
import { Component, Input } from '@angular/core';
import { Message } from '../../../../models/message.model';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-reaction-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaction-box.component.html',
  styleUrl: './reaction-box.component.scss'
})
export class ReactionBoxComponent {

@Input() message!: Message;
user: User | null = null;
loggedInUser: boolean = false;
editMessageBox: boolean = false;


constructor(private usersService: UsersService){
}

ngOnInit(){
  console.log(this.message);
  this.checkIfMessageUser();
}

checkIfMessageUser(){
  this.usersService.user$.subscribe((user) => {
    this.user = user;
  });
  if(this.user!.id == this.message.sender){
    this.loggedInUser = !this.loggedInUser;
  }
}

isHoveredEditMessageBox(hovered:boolean){
  this.editMessageBox = hovered;
}


}
