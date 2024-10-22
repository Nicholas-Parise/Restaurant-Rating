import { Injectable } from '@angular/core';
import { UserEntry } from './user-entry.model';

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

    userEntry: UserEntry[] = [
      new UserEntry(0,'admin','assets/placeholder-avatar.png','description',false,true),
      new UserEntry(1,'treasureHound','assets/placeholder-avatar.png','description',false,false),
      new UserEntry(2,'nickpar03','assets/placeholder-avatar.png','description',false,false),
      new UserEntry(3,'jesus','assets/placeholder-avatar.png','description',false,false)  
  ];
  
  constructor() { }

  GetUsers() : UserEntry[]{
    return this.userEntry;
  }

  GetUserById(username:string) : UserEntry{
    let temp = this.userEntry.find(userEntry => userEntry.username == username);
    
    if(temp === undefined){
      throw new TypeError('index Does not exist');
    }
    
    return temp;
  }

}
