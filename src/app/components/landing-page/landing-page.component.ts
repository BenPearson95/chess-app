import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  randomNumber: number = 0;

  constructor() { }

  ngOnInit() {
    this.randomNumber = Math.floor(Math.random() * 2) + 1 
  }

}
