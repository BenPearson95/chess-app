import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HistoryMove } from 'ngx-chess-board';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements OnInit {
  @Input() moveHistoryArray: Array<HistoryMove>;

  // public moveHistoryArray: Array<HistoryMove>;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    // this.moveHistoryArray = this.data.moveHistoryArray;
  }

  moveClick(index: number) {
    
  }

}
