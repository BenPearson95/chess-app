import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './_animations/animations';
import { AuthUser } from './_models/user/auth-user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider
  ]
})
export class AppComponent {
  title = 'chess-app';

  constructor(
    private AuthService: AuthService,
    ) {}

    ngOnInit() {
      this.setCurrentUser();
    }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  // Sets the currently logged in User for the App.
  setCurrentUser() {
    const user: AuthUser = JSON.parse(localStorage.getItem('user'));
    if (user) this.AuthService.setCurrentUser(user);
  }
}


