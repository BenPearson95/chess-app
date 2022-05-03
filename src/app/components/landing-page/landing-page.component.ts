import { Component, OnInit } from '@angular/core';
import { fadeInOut } from 'src/app/_animations/animations';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [fadeInOut]
})
export class LandingPageComponent implements OnInit {

  randomNumber: number = 0;
  isLoggedIn: boolean = false;
  imageLoaded: boolean = false;

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

  logoLoaded() {
    this.imageLoaded = true;
  }

}
