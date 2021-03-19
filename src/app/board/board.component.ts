import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;

  @Input() boardSize: number = 500;
  @Input() freeMode: boolean = false;

  boardSizeLocal: number = this.boardSize;
  freeModeLocal: boolean = this.freeMode;
  showCoordsLocal: boolean = false;

  colourFormGroup: FormGroup = new FormGroup({
    darkColour: new FormControl('#1565c0'),
    lightColour: new FormControl('#ffa000'),
  })

  constructor(
    private ngxChessBoardService: NgxChessBoardService,
  ) { }

  ngOnInit() {

      
  }

  updateBoardSize(event: any) {
    this.boardSize = event.value;
    console.log(event);
  }

  reset() {
    this.board?.reset();
  }

  reverse() {
    this.board?.reverse();
  }

  undo() {
    this.board?.undo();
  }

  freeModeToggle(event: any) {
    console.log(event.checked);
    this.freeMode = event.checked;
  }

}
