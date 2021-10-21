import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { welcomeAnimation } from '../../_animations/animations';
import { AuthService } from '../../_services/auth.service';
import { filter } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignupComponent } from '../login-signup/login-signup.component';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  animations: [
    welcomeAnimation
  ]
})

export class ToolBarComponent implements OnInit {
  routeData: Data = [];
  pathName: string = '';
  showBackButtonVar: boolean = false;
  welcomePrefix: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public location: Location,
    public authService: AuthService,
    private loginSignupDialog: MatDialog,
  ) { }  

  ngOnInit() {
    // This function gets the Page Title and Boolean to display back button.
    this.router.events.pipe(  
      filter(event => event instanceof NavigationEnd),  
    ).subscribe(() => {  
      const rt = this.getChild(this.activatedRoute);  
      rt.data.subscribe((data: any) => { 
        this.pathName = data.name;
        this.showBackButtonVar = data.showBackButton;
      });  
    });

    this.timeOfDayMessage();

    // Checks every minute for the time of day to update automatically, 
    // not requiring a browser refresh (Toolbar is never init twice).
    setInterval(() => {
      this.timeOfDayMessage();
    }, 60000);
  }

  // Used in the retrieval of page title. Gets child routes.
  getChild(activatedRoute: ActivatedRoute): any {  
    if (activatedRoute.firstChild) {  
      return this.getChild(activatedRoute.firstChild);  
    } else {  
      return activatedRoute;  
    }  
  } 

  // Works out and returns a string based on the time of day.
  timeOfDayMessage() {
    const hour: number = +new Date().toString().split(' ')[4].substring(0,2);
    if (hour >= 4 && hour <= 11) this.welcomePrefix = 'Good Morning,'
    if (hour >= 12 && hour <= 16) this.welcomePrefix = 'Good Afternoon,'
    if (hour >= 17 && hour <= 23 || hour >= 0 && hour <= 3) this.welcomePrefix = 'Good Evening,'
  }

  openLoginSignupModal() {
    const dialogRef = this.loginSignupDialog.open(LoginSignupComponent, {
      maxWidth: 600,
      minWidth: 300,
      minHeight: 300,
    });

    dialogRef.updatePosition({
      top: '50px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Calls the User Service to logout.
  logout() {
    this.authService.logout();
  }

}

