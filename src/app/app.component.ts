import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation, slider } from './_animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // slideInAnimation
    slider
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'chess-app';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}


