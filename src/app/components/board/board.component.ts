import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;

  @Input() boardSize: number = 650;
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

  ngOnInit() {}

  // Called from the Slider HTML, updates the Chessboard size.
  updateBoardSize(event: any) {
    this.boardSize = event.value;
  }

  // Resets the board.
  reset() {
    this.board?.reset();
  }

  // Swaps the orientation of the board 180 degrees.
  reverse() {
    this.board?.reverse();
  }

  // Undos 1 move.
  undo() {
    this.board?.undo();
  }

  // Toggles on 'FreeMode'.
  freeModeToggle(event: any) {
    this.freeMode = event.checked;
  }

}
