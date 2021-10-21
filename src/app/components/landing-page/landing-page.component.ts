import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  randomNumber: number = 0;
  isLoggedIn: boolean = false;

  constructor(
    public authService: AuthService,
  ) { 
    this.authService.loggedIn().subscribe(result => {
      this.isLoggedIn = result;
    });
  }

  ngOnInit() {
    this.randomNumber = Math.floor(Math.random() * 3) + 1 
  }

}
