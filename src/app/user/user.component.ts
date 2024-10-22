import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserEntry } from '../shared/user-entry.model';
import { UserDataService } from '../shared/user-data.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  userEntry: UserEntry

constructor(private userDataService : UserDataService ,private route: ActivatedRoute){}

ngOnInit() : void{

  this.route.params.subscribe(params => {
        
    console.log(this.route.snapshot.params)
    const username = params['username'];
    console.log('test: '+username);

    if(username == null){
      console.log('empty');
      this.userEntry = this.userDataService.GetUserById('admin');
    }else{
      try{
        this.userEntry = this.userDataService.GetUserById(username);
        
      }catch(e){
        this.userEntry = this.userDataService.GetUserById('admin');
      }
    }
      //this.restaurantDataService.GetResturauntsById(this.id).subscribe( restaurantEntry => {
      //this.restaurantEntry = restaurantEntry
      //}
      
  })

}

}
