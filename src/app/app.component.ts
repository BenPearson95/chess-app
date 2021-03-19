import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './_animations/animations';
import { AuthUser } from './_models/user/auth-user';
import { UserService } from './_services/user.service';

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

  constructor(
    private userService: UserService,
    ) {}

    ngOnInit() {
      this.setCurrentUser();
    }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  setCurrentUser() {
    const user: AuthUser = JSON.parse(localStorage.getItem('user'));
    if (user) this.userService.setCurrentUser(user);
  }
}


