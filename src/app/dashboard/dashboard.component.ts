import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Link To Crowborough Chess?', cols: 1, rows: 1 },
          { title: 'Browse Saved Games', cols: 1, rows: 1 },
          { title: 'A New, Fresh Board', cols: 1, rows: 1 },
          { title: 'Info', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Link To Crowborough Chess?', cols: 2, rows: 1 },
        { title: 'Browse Saved Games', cols: 1, rows: 1 },
        { title: 'A New, Fresh Board', cols: 1, rows: 2 },
        { title: 'Info', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {}
}
