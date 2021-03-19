import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { welcomeAnimation } from '../_animations/animations';
import { UserService } from '../_services/user.service';
import { filter } from 'rxjs/operators';


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
    public userService: UserService,
  ) { }  

  ngOnInit() {
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
  }

  getChild(activatedRoute: ActivatedRoute): any {  
    if (activatedRoute.firstChild) {  
      return this.getChild(activatedRoute.firstChild);  
    } else {  
      return activatedRoute;  
    }  
  } 

  timeOfDayMessage() {
    const hour: number = +new Date().toString().split(' ')[4].substring(0,2);
    if (hour >= 4 && hour <= 11) this.welcomePrefix = 'Good Morning,'
    if (hour >= 12 && hour <= 16) this.welcomePrefix = 'Good Afternoon,'
    if (hour >= 17 && hour <= 23 || hour >= 0 && hour <= 3) this.welcomePrefix = 'Good Evening,'
  }

  logout() {
    this.userService.logout();
  }

}

