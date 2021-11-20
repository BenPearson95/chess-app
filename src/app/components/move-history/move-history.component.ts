import { Component, Input, IterableDiffers, OnInit } from '@angular/core';
import { HistoryMove } from 'ngx-chess-board';

@Component({
  selector: 'app-move-history',
  templateUrl: './move-history.component.html',
  styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements OnInit {

  @Input() moveHistoryArray: Array<HistoryMove>
  @Input() freeMode: boolean;

  algebraicMoveHistory: Array<DuoHistoryMove> = [];

  iterableDiffer;

  constructor(
    private iterableDiffers: IterableDiffers
  ) { 
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }

  ngDoCheck() {
    let changes = this.iterableDiffer.diff(this.moveHistoryArray);
    if (changes && !this.freeMode) {this.buildAlgebraicNotation()}
  }

  ngOnInit() {}

  buildAlgebraicNotation() {
    this.algebraicMoveHistory = [];
    this.moveHistoryArray.forEach((move: HistoryMove) => {
      let moveString = '';
      moveString = (move.piece === 'Knight') ? moveString.concat('N') : moveString.concat('');
      moveString = (move.piece !== 'Pawn' && move.piece !== 'Knight') ? moveString.concat(move.piece.charAt(0)) : moveString.concat('');
      moveString = (move.x) ? moveString.concat('x') : moveString.concat('');
      moveString = moveString.concat(move.move.slice(-2));
      moveString = ((move.move === 'e1g1' && move.piece === 'King') || (move.move === 'e8g8' && move.piece === 'King')) ? '0-0' : moveString.concat('');
      moveString = ((move.move === 'e1c1' && move.piece === 'King') || (move.move === 'e8c8' && move.piece === 'King')) ? '0-0-0' : moveString.concat('');
      moveString = (move.check && !move.mate) ? moveString = moveString.concat('+') : moveString = moveString.concat('');
      moveString = (move.mate) ? moveString = '1/2-1/2' : moveString = moveString.concat('');
      moveString = (move.mate) ? moveString = moveString.concat('#') : moveString = moveString.concat('');

      let duoHistoryMove: DuoHistoryMove = {
        whiteMove: null,
        blackMove: null,
      }

      if (move.color === 'white') {
        duoHistoryMove.whiteMove = moveString;
        this.algebraicMoveHistory.push(duoHistoryMove);
      } else {
        this.algebraicMoveHistory[this.algebraicMoveHistory.length - 1].blackMove = moveString
      }
    });
  }
}

interface DuoHistoryMove {
  whiteMove: string;
  blackMove: string;
}
