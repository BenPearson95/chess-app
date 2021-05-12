import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { HistoryMove, NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop, uncoverFromLeft } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AdditionalPiece } from 'src/app/_models/board/additional-piece';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardService } from 'src/app/_services/board.service';
import { HelpComponent } from '../help/help.component';
import { CollectionsComponent } from '../collections/collections.component';
import { MoveHistoryComponent } from '../move-history/move-history.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAccordion } from '@angular/material/expansion';

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
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;
  @ViewChild('boardRef', {static: true}) boardRef: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Output('cdkDragStarted') started: EventEmitter<CdkDragStart>
  @Input() boardSize: number = 745;
  @Input() freeMode: boolean = true;

  // Board specific variables.
  boardSizeLocal: number = this.boardSize;
  showCoordsOutside: boolean = false;
  showCoordsInside: boolean = false;
  showLastMove: boolean = false;
  showLegalMove: boolean = false;
  reversed: boolean = false;
  moveHistoryArray: Array<HistoryMove>;
  outsideCoordNumbers: Array<Number> = [8,7,6,5,4,3,2,1];
  outsideCoordLetters: Array<string> = ['a','b','c','d','e','f','g','h'];
  outsideCoordDiameter: number = (this.boardSize / 8);
  coordFontSizes: Array<Number> = [12, 16, 20, 24, 28, 32, 36, 40];
  coordFontSize: Number = 20;
  coordPositions: Array<any> = [
    {value: 'none-2', viewValue: 'None'},
    {value: 'inside-0', viewValue: 'Inside'},
    {value: 'outside-1', viewValue: 'Outside'},
  ]
  
  // Fen variables.
  collection: FenCollection;
  activeFen: String;
  activeFenPosition: number;

  // Piece Dragging variables.
  grids: Array<number> = [];
  piece: AdditionalPiece = {
    piece: null, colour: null, pieceImgSrc: ''
  }
  additionalPieces: Array<AdditionalPiece> = [
    {piece: 1, colour: 1, pieceImgSrc: '♔'},
    {piece: 2, colour: 1, pieceImgSrc: '♕'},
    {piece: 3, colour: 1, pieceImgSrc: '♗'},
    {piece: 4, colour: 1, pieceImgSrc: '♘'},
    {piece: 5, colour: 1, pieceImgSrc: '♖'},
    {piece: 6, colour: 1, pieceImgSrc: '♙'}
  ];
  additionalWhitePieces: Array<AdditionalPiece> = [
    {piece: 1, colour: 1, pieceImgSrc: '♔'},
    {piece: 2, colour: 1, pieceImgSrc: '♕'},
    {piece: 3, colour: 1, pieceImgSrc: '♗'},
    {piece: 4, colour: 1, pieceImgSrc: '♘'},
    {piece: 5, colour: 1, pieceImgSrc: '♖'},
    {piece: 6, colour: 1, pieceImgSrc: '♙'}
  ];
  additionalBlackPieces: Array<AdditionalPiece> = [
    {piece: 1, colour: 2, pieceImgSrc: '♚'},
    {piece: 2, colour: 2, pieceImgSrc: '♛'},
    {piece: 3, colour: 2, pieceImgSrc: '♝'},
    {piece: 4, colour: 2, pieceImgSrc: '♞'},
    {piece: 5, colour: 2, pieceImgSrc: '♜'},
    {piece: 6, colour: 2, pieceImgSrc: '♟'},
  ];
  dragging: boolean;
  
  // Form Group for colours.
  colourFormGroup: FormGroup = new FormGroup({
    darkColour: new FormControl('#1565c0'),
    lightColour: new FormControl('#ffffff'),
  })

  constructor(
    private ngxChessBoardService: NgxChessBoardService,
    public FenCollectionsDialog: MatDialog,
    public moveHistoryDialog: MatDialog,
    public boardService: BoardService,
    public helpDialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.boardService.initGrids();
  }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
  }
  
  // Called from the Slider HTML, updates the Chessboard size.
  updateBoardSize(event: any) {
    this.boardSize = event.value;
    this.outsideCoordDiameter = (this.boardSize / 8);
  }

  // Resets the board.
  reset() {
    this.board?.reset();
  }

  // Clears the board.
  clearPieces() {
    this.board?.setFEN('8/8/8/8/8/8/8/8 w - - 0 1');
  }

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
  moveHistory() {

    this.moveHistoryArray = this.board?.getMoveHistory();
    if (this.moveHistoryArray.length > 0) {
      const dialogRef = this.moveHistoryDialog.open(MoveHistoryComponent, {
        maxWidth: 600,
        minWidth: 300,
        minHeight: 300,
        data: {
          moveHistoryArray: this.moveHistoryArray
        },
      });
  
      dialogRef.updatePosition({
        top: '50px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    } else {
      this.snackBar.open('No History To Show!', 'Close' ,{duration: 3000});
    }
    
  }

  // Toggles on/off 'FreeMode'.
  freeModeToggle(event: any) {
    this.freeMode = event.checked;
  }

  // Changes the label positioning / visibility.
  coordLabelChange(event: any) {
    
    switch (event.value) {
      case 'inside-0':
        this.showCoordsInside = true;
        this.showCoordsOutside = false;
        break;
      case 'outside-1':
        this.showCoordsInside = false;
        this.showCoordsOutside = true;
        break;
    
      default:
        this.showCoordsInside = false;
        this.showCoordsOutside = false;
        break;
    }
  }

  // Change the font-size of the label.
  labelSizeChange(event: any) {
    this.coordFontSize = event.value;
  }

  // Opens the Fen Collection Modal. Manages return data.
  openFenCollectionsDialog() {
    console.log(this.collection);
    const dialogRef = this.FenCollectionsDialog.open(CollectionsComponent, {
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

  // Fen Navigation after a collection has been loaded in.
  navigateFen(direction: String) {
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
    console.log(event);
    console.log(event.srcElement.offsetParent.id)
    if (this.freeMode) {
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
}
