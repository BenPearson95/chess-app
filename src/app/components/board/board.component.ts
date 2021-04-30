import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AdditionalPiece } from 'src/app/_models/board/additional-piece';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { BoardService } from 'src/app/_services/board.service';
import { CollectionsComponent } from '../collections/collections.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    slideFromTop, 
    slideFromBottom, 
    slideFromLeft,
    slideFromRight,
  ],
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;
  @ViewChild('boardRef', {static: true}) boardRef: ElementRef;
  @Output('cdkDragStarted') started: EventEmitter<CdkDragStart>
  @Input() boardSize: number = 650;
  @Input() freeMode: boolean = false;

  // Board specific variables.
  boardSizeLocal: number = this.boardSize;
  freeModeLocal: boolean = this.freeMode;
  showCoordsOutside: boolean = false;
  showCoordsInside: boolean = false;
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
    // lightColour: new FormControl('#ffa000'),
    lightColour: new FormControl('#ffffff'),
  })

  constructor(
    private ngxChessBoardService: NgxChessBoardService,
    public FenCollectionsDialog: MatDialog,
    public boardService: BoardService,
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

  // Swaps the orientation of the board 180 degrees.
  reverse() {
    this.board?.reverse();
  }

  // Undos 1 move.
  undo() {
    this.board?.undo();
  }

  setFen() {
    if (this.activeFen) {
      this.board?.setFEN(this.activeFen.toString());
    }
  }

  // Toggles on 'FreeMode'.
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
      if(!this.collection || !this.collection.fens) {
        this.collection = new FenCollection;
        this.collection.fens = [];
      } 
      this.collection = result.collection
      if (this.collection.fens.length > 0) this.activeFen = this.collection.fens[0];
      this.setFen();
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
        console.log(activeFenIndex);
        if (activeFenIndex > 0) this.activeFen = this.collection.fens[activeFenIndex - 1];
        break;
      case 'next':
        console.log(activeFenIndex);
        if(this.collection.fens.length !== (this.activeFenPosition - 1) ) this.activeFen = this.collection.fens[activeFenIndex + 1];
        
        break;
      case 'last':
      
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
    console.log(event.path[1].id);
    console.log(this.freeMode);
    if (this.freeMode) {
      console.log(this.piece.piece);
      console.log(this.piece.colour);
      console.log(event.path[1].id);

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
}
