import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { HistoryMove, NgxChessBoardService, NgxChessBoardView, PieceIconInput } from 'ngx-chess-board';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop, uncoverFromLeft } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AdditionalPiece } from 'src/app/_models/board/additional-piece';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardService } from 'src/app/_services/board.service';
import { HelpComponent } from '../help/help.component';
import { CollectionsComponent } from '../collections/collections.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';
import { Leipzig } from 'src/app/_models/board/piece-models/leipzig';
import { Cburnett } from 'src/app/_models/board/piece-models/cburnett';
import { Merida } from 'src/app/_models/board/piece-models/merida';
import { MeridaNew } from 'src/app/_models/board/piece-models/merida-new';
import { PgnManagementComponent } from 'src/app/components/pgn-management/pgn-management.component';
import { UserBoardProfile } from 'src/app/_models/board/user-board-profile';
import { CoordinateLabelEnum } from 'src/app/_models/enums/coordinate-label.enum';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    slideFromTop, 
    slideFromBottom, 
    slideFromLeft,
    slideFromRight,
    uncoverFromLeft,
  ],
})
export class BoardComponent implements OnInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;
  @ViewChild('boardRef', {static: true}) boardRef: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('moveHistoryToggle') moveHistoryToggle: MatSlideToggle;
  @Output('cdkDragStarted') started: EventEmitter<CdkDragStart>
  @Input() boardSize: number;
  @Input() freeMode: boolean;

  // General board variables
  showCoords: boolean = true;
  showCoordsOutside: boolean = false;
  showCoordsInside: boolean = false;
  showLastMove: boolean = false;
  showLegalMove: boolean = false;
  showMoveHistory: boolean = false;
  moveHistoryString: string = null;
  reversed: boolean = false;
  moveHistoryArray: Array<HistoryMove>;
  outsideCoordNumbers: Array<Number> = [8,7,6,5,4,3,2,1];
  outsideCoordLetters: Array<string> = ['a','b','c','d','e','f','g','h'];
  outsideCoordDiameter: number;
  coordFontSizes: Array<Number> = [12, 16, 20, 24, 28, 32, 36, 40];
  pieceStyle: string;
  saveBtnDisabled: boolean = false;

  isLoggedIn: boolean = false;

  get CoordinateLabelEnum(): typeof CoordinateLabelEnum {
    return CoordinateLabelEnum;
  }

  boardProfileFormGroup: FormGroup = new FormGroup({
    boardSize: new FormControl(),
    freeMode: new FormControl(),
    coordinateLabel: new FormControl(),
    coordinateSize: new FormControl(),
    darkTileColour: new FormControl(),
    lightTileColour: new FormControl(),
    pieceStyle: new FormControl()
  });
  
  // Fen variables.
  collection: FenCollection;
  activeFen: string;
  activeFenPosition: number;

  // Piece Dragging variables.
  grids: Array<number> = [];
  piece: AdditionalPiece = {
    pieceID: null, piece: null, colour: null, pieceImgSrc: ''
  }

  additionalWhitePieces: Array<AdditionalPiece> = [
    {pieceID: 'wk', piece: 1, colour: 1, pieceImgSrc: '♔'},
    {pieceID: 'wq', piece: 2, colour: 1, pieceImgSrc: '♕'},
    {pieceID: 'wb', piece: 3, colour: 1, pieceImgSrc: '♗'},
    {pieceID: 'wn', piece: 4, colour: 1, pieceImgSrc: '♘'},
    {pieceID: 'wr', piece: 5, colour: 1, pieceImgSrc: '♖'},
    {pieceID: 'wp', piece: 6, colour: 1, pieceImgSrc: '♙'}
  ];
  additionalBlackPieces: Array<AdditionalPiece> = [
    {pieceID: 'bk', piece: 1, colour: 2, pieceImgSrc: '♚'},
    {pieceID: 'bq', piece: 2, colour: 2, pieceImgSrc: '♛'},
    {pieceID: 'bb', piece: 3, colour: 2, pieceImgSrc: '♝'},
    {pieceID: 'bn', piece: 4, colour: 2, pieceImgSrc: '♞'},
    {pieceID: 'br', piece: 5, colour: 2, pieceImgSrc: '♜'},
    {pieceID: 'bp', piece: 6, colour: 2, pieceImgSrc: '♟'},
  ];

  // Var toggle for when piece is being dragged onto board in freemode.
  dragging: boolean;

  // Vars for Piece Styles
  pieceOptions: Array<any> = [
    {value: 'cburnett', viewValue: 'cBurnett'},
    {value: 'leipzig', viewValue: 'Leipzig'},
    {value: 'merida', viewValue: 'Merida'},
    {value: 'merida-new', viewValue: 'Merida New'}
  ]

  pieces: PieceIconInput = null;

  pageLoading: boolean = true;

  constructor(
    private ngxChessBoardService: NgxChessBoardService,
    private fenAndPgnDialog: MatDialog,
    private moveHistoryDialog: MatDialog,
    public boardService: BoardService,
    public helpDialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    this.initBoard();
    this.boardService.initGrids();
  }

  ngOnInit() {
    // A change has been detected, allow a save.
    this.boardProfileFormGroup.valueChanges.subscribe(value => {
      this.saveBtnDisabled = false;
    });
  }

  initBoard() {
    this.authService.loggedIn().subscribe(result => {
      if (result) {
        this.isLoggedIn = true;
        this.getBoardProfile();
      } else {
        this.isLoggedIn = false;
        this.setBoardProfileDefault();
      }
    });
  }
  
  // Called from the Slider HTML, updates the Chessboard size.
  updateBoardSize(eventValue) {
    this.boardProfileFormGroup.controls.boardSize.setValue(eventValue);
    this.outsideCoordDiameter = (this.boardProfileFormGroup.controls.boardSize.value / 8);
  }

  // Resets the board.
  reset() {
    this.reversed = false;
    this.board?.reset();
  }

  // Clears the board.
  clearPieces() {
    this.board?.setFEN('8/8/8/8/8/8/8/8 w - - 0 1');
  }

  // We remove the markers, to do so need to also remove the pieces and place them back again.
  clearMarkers() {
    const currentFen = this.board?.getFEN();
    this.board?.reset();
    this.board?.setFEN(currentFen);
  }

  // Swaps the orientation of the board 180 degrees.
  reverse() {
    this.board?.reverse();
    this.reversed = !this.reversed;
  }

  // Undos 1 move.
  undo() {
    this.board?.undo();
  }

  // Sets the board position using the current activeFen variable.
  setFen() {
    if (this.activeFen) {
      this.board?.setFEN(this.activeFen.toString());
    }
  }

  // Gets & displays Move History
  moveHistory(event) {
    if(this.board?.getMoveHistory().length > 0) {
      this.showMoveHistory = (event.checked) ? true : false;
    } else {
      this.snackBar.open('No History To Show!', 'Close' ,{duration: 3000});
      this.moveHistoryToggle.checked = false;
    }    
  }

  // Opens the Fen Collection Modal. Manages return data.
  openFenCollectionsDialog() {
    const dialogRef = this.fenAndPgnDialog.open(CollectionsComponent, {
      minWidth: 900,
      data: {
        parent: 'board',
        collection: this.collection,
      },
    });

    dialogRef.updatePosition({
      top: '50px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(!this.collection || !this.collection.fens) {
          this.collection = new FenCollection;
          this.collection.fens = [];
        }
  
        this.collection = result.collection
  
        if (this.collection.fens.length > 0) this.activeFen = this.collection.fens[0];
        this.activeFenPosition = 1;
        this.setFen();
      }
    });
  }

  // Handles import a PGN into the board.
  openPGNDialog() {
    const dialogRef = this.fenAndPgnDialog.open(PgnManagementComponent, {
      minWidth: 900,
      
    });

    dialogRef.updatePosition({
      top: '50px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.board.setPGN(result.pgn);
      }
    });
  }

  // Fen Navigation after a collection has been loaded in.
  navigateFen(direction: string) {
    let activeFenIndex = 0;
    if (direction === 'previous' || direction === 'next') activeFenIndex = this.collection.fens.findIndex(fa => fa === this.activeFen);
    switch (direction) {
      case 'first':
        this.activeFen = this.collection.fens[0];
        break;
      case 'previous':
        if (activeFenIndex > 0) this.activeFen = this.collection.fens[activeFenIndex - 1];
        break;
      case 'next':
        if (this.collection.fens.length !== this.activeFenPosition ) this.activeFen = this.collection.fens[activeFenIndex + 1];
        
        break;
      case 'last':
        const lastIndex = this.collection.fens.length - 1;
        this.activeFen = this.collection.fens[lastIndex];
        break;
      default:
        break;
    }
    this.activeFenPosition = this.collection.fens.findIndex(fen => fen === this.activeFen) + 1;
    this.setFen();
  }

  // Toggled when a mouse click up event has fired on the overlay grid for piece dragging.
  mouseUpEvent(event) {
    if (this.boardProfileFormGroup.controls.freeMode.value) {
      this.board?.addPiece(this.piece.piece, this.piece.colour, event.path[1].id);
    }
  }

  // Turns dragging true when a piece has been clicked and dragged.
  dragStarted(piece: AdditionalPiece) {
    this.dragging = true;
    this.piece.piece = piece.piece;
    this.piece.colour = piece.colour;
  }

  // Turns dragging false when a piece has been dropped from a drag, waits 50ms because
  // when it needs to be true when dropping a piece onto the board.
  dragStopped() {
    setTimeout(() => {
      this.dragging = false;
    }, 50);
  }

  openHelp() {
    const dialogRef = this.helpDialog.open(HelpComponent, {
      minWidth: 700,
      minHeight: 700
    });

    dialogRef.updatePosition({
      top: '50px',
    });

    dialogRef.afterClosed().subscribe();
  }

  saveBoardProfile() {
    this.saveBtnDisabled = true;
    const userBoardProfile: UserBoardProfile = {
      boardSize: this.boardProfileFormGroup.controls.boardSize.value,
      freeMode: this.boardProfileFormGroup.controls.freeMode.value,
      coordinateLabel: this.boardProfileFormGroup.controls.coordinateLabel.value,
      coordinateSize: this.boardProfileFormGroup.controls.coordinateSize.value,
      darkTileColour: this.boardProfileFormGroup.controls.darkTileColour.value,
      lightTileColour: this.boardProfileFormGroup.controls.lightTileColour.value,
      pieceStyle: this.boardProfileFormGroup.controls.pieceStyle.value,
    }
    this.boardService.saveBoardProfile(userBoardProfile).subscribe(result => {
      this.snackBar.open('Board Style successfully saved.', null, {duration: 2000});
    }, (error) => {
      this.saveBtnDisabled = false;
      this.snackBar.open('Error saving your Board Style!', null, {duration: 2000});
      console.log(error);
    });
  }

  getBoardProfile() {
    this.boardService.getBoardProfile(this.authService.getUserId()).subscribe((result: UserBoardProfile) => {
      if(result) {
        this.boardProfileFormGroup.setValue(result);
      } else {
        let boardValues: UserBoardProfile = {
          boardSize: 800,
          freeMode: true,
          coordinateLabel: CoordinateLabelEnum.None,
          coordinateSize: 24,
          darkTileColour: '#1565c0',
          lightTileColour: '#ffffff',
          pieceStyle: 'cburnett',
        }
        this.boardProfileFormGroup.patchValue(boardValues);
      }

      this.updateBoardSize(this.boardProfileFormGroup.controls.boardSize.value);
      this.changePieces(this.boardProfileFormGroup.controls.pieceStyle.value);
    }, (err) => {
      // if there was an error getting API board data, show default.
      console.log(err);
      this.setBoardProfileDefault();
    }, () => {
      this.pageLoading = false;
    });
  }

  setBoardProfileDefault() {
    let boardValues: UserBoardProfile = {
      boardSize: 800,
      freeMode: true,
      coordinateLabel: CoordinateLabelEnum.None,
      coordinateSize: 24,
      darkTileColour: '#1565c0',
      lightTileColour: '#ffffff',
      pieceStyle: 'cburnett',
    }
    this.boardProfileFormGroup.patchValue(boardValues);
    this.updateBoardSize(this.boardProfileFormGroup.controls.boardSize.value);
    this.changePieces(this.boardProfileFormGroup.controls.pieceStyle.value);
    this.pageLoading = false;
  }

  changePieces(pieceStyleString: string) {
    this.boardProfileFormGroup.value.pieceStyle = pieceStyleString;
    this.pieceStyle = pieceStyleString;
    switch (pieceStyleString) {
      case 'leipzig':
        this.pieces = new Leipzig;
        this.updateDraggableIcons();
        break;
      case 'cburnett':
        this.pieces = new Cburnett;
        this.updateDraggableIcons();
        break;
      case 'merida':
        this.pieces = new Merida;
        this.updateDraggableIcons();
        break;
      case 'merida-new':
        this.pieces = new MeridaNew;
        this.updateDraggableIcons();
        break;
    
      default:
        this.pieces = null;

        this.additionalWhitePieces  = [
          {pieceID: 'wk', piece: 1, colour: 1, pieceImgSrc: '♔'},
          {pieceID: 'wq', piece: 2, colour: 1, pieceImgSrc: '♕'},
          {pieceID: 'wb', piece: 3, colour: 1, pieceImgSrc: '♗'},
          {pieceID: 'wn', piece: 4, colour: 1, pieceImgSrc: '♘'},
          {pieceID: 'wr', piece: 5, colour: 1, pieceImgSrc: '♖'},
          {pieceID: 'wp', piece: 6, colour: 1, pieceImgSrc: '♙'}
        ];
        this.additionalBlackPieces = [
          {pieceID: 'bk', piece: 1, colour: 2, pieceImgSrc: '♚'},
          {pieceID: 'bq', piece: 2, colour: 2, pieceImgSrc: '♛'},
          {pieceID: 'bb', piece: 3, colour: 2, pieceImgSrc: '♝'},
          {pieceID: 'bn', piece: 4, colour: 2, pieceImgSrc: '♞'},
          {pieceID: 'br', piece: 5, colour: 2, pieceImgSrc: '♜'},
          {pieceID: 'bp', piece: 6, colour: 2, pieceImgSrc: '♟'},
        ];
        break;
    }
  }

  updateDraggableIcons() {
    Object.entries(this.pieces).forEach(piece => {
      let newPieceID: string = piece[1].substring(piece[1].length - 6, piece[1].length - 4);

      this.additionalWhitePieces.forEach(additionalPiece => {
        if (newPieceID === additionalPiece.pieceID) {
          additionalPiece.pieceImgSrc = piece[1];
        }
      });

      this.additionalBlackPieces.forEach(additionalPiece => {
        if (newPieceID === additionalPiece.pieceID) {
          additionalPiece.pieceImgSrc = piece[1];
        }
      });
    })
  }

  // moveChange(event: MoveChange) {
  //   // this.moveHistoryString = event.pgn.pgn

  //   console.log(event);

  //   const pgnString = event.pgn.pgn;

  //   console.log(pgnString);

  //   let moveHistoryArray: Array<string> = [];
  // }

  
}
