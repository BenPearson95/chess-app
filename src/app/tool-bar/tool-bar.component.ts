import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Data, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})

export class ToolBarComponent implements OnInit {
  routeData: Data = [];
  pathName: string = '';
  showBackArrowVar: boolean = false;

  constructor(
    private router: Router,
    public location: Location,
  ) { }  

  ngOnInit() {
    
    this.router.events.subscribe(data => {
      if (data instanceof RoutesRecognized) {
        
        if (data.state.root.firstChild) this.routeData = data.state.root.firstChild.data;
        this.showBackArrow(this.routeData)

      }
    });
  }

  showBackArrow(routeData: any) {
    this.showBackArrowVar = (routeData.pathname === 'Login/Signup' || routeData.pathname === 'Dashboard') ? true : false;
  }

}

