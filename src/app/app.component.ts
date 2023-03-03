import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { slideFromLeft, slider } from './_animations/animations';
import { AuthUser } from './_models/user/auth-user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider,
    slideFromLeft
  ]
})
export class AppComponent {
  title = 'chess-app';

  constructor(
    public AuthService: AuthService,
    public feedbackDialog: MatDialog,
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

  openFeedback() {
    const dialogRef = this.feedbackDialog.open(FeedbackComponent, {
      minWidth: 700,
      autoFocus: false
    });

    dialogRef.updatePosition({
      top: '50px'
    });

    dialogRef.afterClosed().subscribe();
  }
}


