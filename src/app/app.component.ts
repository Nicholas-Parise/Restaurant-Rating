import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HeaderComponent } from "./header/header.component";
import { Meta } from "@angular/platform-browser"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'restaurant-rating';

  constructor(private metaTageService:Meta){}

  ngOnInit(): void {
    
    this.metaTageService.addTags([
      {name:'keywords',content:'Nicholas Parise, keywords'},
      {name:'robots',content:'index,follow'},
      {name:'author',content:'Nicholas Parise'},
      {name:'description',content:'A more personalised way to rate and manage the restaurants you and your friends have gone to'},
      {name:'viewport',content:'width=device-width, initial-scale=1'},
      {name:'date',content:'2024-10-17', scheme:'YYYY-MM-DD'},
      {charset:'UTF-8'}
    ]);

  }

}
