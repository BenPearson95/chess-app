import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { NgxChessBoardService, NgxChessBoardView, PieceIconInput } from 'ngx-chess-board';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop, uncoverPiecesFromLeft } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AdditionalPiece } from 'src/app/_models/board/additional-piece';
import { BoardService } from 'src/app/_services/board.service';
import { HelpComponent } from '../help/help.component';
import { CollectionsComponent } from '../collections/collections.component';
import { Leipzig } from 'src/app/_models/board/piece-models/leipzig';
import { Cburnett } from 'src/app/_models/board/piece-models/cburnett';
import { Merida } from 'src/app/_models/board/piece-models/merida';
import { MeridaNew } from 'src/app/_models/board/piece-models/merida-new';
import { UserBoardProfile } from 'src/app/_models/board/user-board-profile';
import { CoordinateLabelEnum } from 'src/app/_models/enums/coordinate-label.enum';
import { AuthService } from 'src/app/_services/auth.service';
import { BoardStyleComponent } from 'src/app/components/board-style/board-style.component';
import { MoveHistoryComponent } from '../move-history/move-history.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fen } from 'src/app/_models/fens/fen';
import { ImportSingleFenComponent } from '../import-single-fen/import-single-fen.component';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [
    slideFromTop, 
    slideFromBottom, 
    slideFromLeft,
    slideFromRight,
    uncoverPiecesFromLeft,
  ],
})
export class BoardComponent implements AfterViewInit {

  @HostListener('window:mousemove', ['$event'])
  
  onMouseMove(event: MouseEvent){
     this.changeBoardSize(event.clientX);
  }

  @ViewChild('pageContainer') pageContainer: ElementRef;
  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;

  public boardProfile: UserBoardProfile = {
    boardSize: 1100,
    freeMode: true,
    coordinateLabel: CoordinateLabelEnum.Inside,
    coordinateSize: 16,
    darkTileColour: '#1565c0',
    lightTileColour: '#ffffff',
    pieceStyle: 'cburnett',
  };

  // Board Resizing vars
  private maxBoardSize: number;
  public boardContainerSize: number = this.boardProfile.boardSize;
  private resizingDifference: number = 0;
  public resizingHold: boolean = false;
  public mouseXCoord: number;

  public reversed: boolean = false;

  public outsideCoordNumbers: Array<number> = [8,7,6,5,4,3,2,1];
  public outsideCoordLetters: Array<string> = ['a','b','c','d','e','f','g','h'];

  get CoordinateLabelEnum(): typeof CoordinateLabelEnum {
    return CoordinateLabelEnum;
  }
  
  // Fen variables.
  public collection: FenCollection;
  private activeFen: Fen;
  public activeFenPosition: number;

  // Piece Dragging variables.
  public piece: AdditionalPiece = {
    pieceID: null, piece: null, colour: null, pieceImgSrc: ''
  }

  public additionalWhitePieces: Array<AdditionalPiece> = [
    {pieceID: 'wk', piece: 1, colour: 1, pieceImgSrc: '♔'},
    {pieceID: 'wq', piece: 2, colour: 1, pieceImgSrc: '♕'},
    {pieceID: 'wb', piece: 3, colour: 1, pieceImgSrc: '♗'},
    {pieceID: 'wn', piece: 4, colour: 1, pieceImgSrc: '♘'},
    {pieceID: 'wr', piece: 5, colour: 1, pieceImgSrc: '♖'},
    {pieceID: 'wp', piece: 6, colour: 1, pieceImgSrc: '♙'}
  ];
  public additionalBlackPieces: Array<AdditionalPiece> = [
    {pieceID: 'bk', piece: 1, colour: 2, pieceImgSrc: '♚'},
    {pieceID: 'bq', piece: 2, colour: 2, pieceImgSrc: '♛'},
    {pieceID: 'bb', piece: 3, colour: 2, pieceImgSrc: '♝'},
    {pieceID: 'bn', piece: 4, colour: 2, pieceImgSrc: '♞'},
    {pieceID: 'br', piece: 5, colour: 2, pieceImgSrc: '♜'},
    {pieceID: 'bp', piece: 6, colour: 2, pieceImgSrc: '♟'},
  ];

  public pieces: PieceIconInput = null;

  // Var toggle for when piece is being dragged onto board in freemode.
  public dragging: boolean = false;

  public moveHistoryArray = [];

  public loggedIn: boolean = false; 

  constructor(
    private ngxChessBoardService: NgxChessBoardService,
    public boardService: BoardService,
    public matDialog: MatDialog,
    private authService: AuthService,
    public moveHistoryComponent: MoveHistoryComponent,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
  ) {
    this.boardService.initGrids();
    this.authService.loggedIn().subscribe(result => {this.loggedIn = (result) ?  true : false});
    this.setBoardProfile(this.activatedRoute.snapshot.data.resolvedData);
    this.changePieces(this.boardProfile.pieceStyle);
  }

  ngAfterViewInit() {
    this.processBoardSize();

    let elements: NodeList = this.elementRef.nativeElement.querySelectorAll('.board-row');
    (elements[0].childNodes[0] as HTMLElement).style.borderTopLeftRadius = '4px';
    (elements[0].childNodes[7] as HTMLElement).style.borderTopRightRadius = '4px';
    (elements[7].childNodes[0] as HTMLElement).style.borderBottomLeftRadius = '4px';
    (elements[7].childNodes[7] as HTMLElement).style.borderBottomRightRadius = '4px';
  }

  ngAfterContentChecked(): void {
    
  }

  // Resize of the page container.
  pageContainerResize(event) {
    this.maxBoardSize = (event.target.innerHeight - 64 - 32);
    if (this.maxBoardSize <= this.boardProfile.boardSize && this.maxBoardSize >= 500) {
      this.boardProfile.boardSize = this.maxBoardSize;

      if (this.boardProfile.coordinateLabel === this.CoordinateLabelEnum.Outside) {
        this.boardProfile.boardSize = this.boardProfile.boardSize - ((this.boardProfile.coordinateSize + 4) * 2);
      } else {
        this.boardProfile.boardSize = this.boardProfile.boardSize;
      }
    }
  }

  // General process of setting the Board size.
  processBoardSize() {
    this.maxBoardSize = this.pageContainer.nativeElement.offsetHeight;
    if (this.boardProfile.boardSize > this.maxBoardSize) {
      setTimeout(() => {
        this.boardProfile.boardSize = this.pageContainer.nativeElement.offsetHeight;
      });
    }
  }

  changeBoardSize(mouseXCoord: number) {
    
    if (this.resizingHold) {
      if(!this.mouseXCoord) {
        this.mouseXCoord = mouseXCoord;
      } else {
        // This counts up the coords
        this.resizingDifference = this.resizingDifference + (mouseXCoord - this.mouseXCoord)
        // When we hit +20, we resize the board by +10 pixels.
        if(this.resizingDifference >= 20) {
          if(((this.boardProfile.boardSize + (this.resizingDifference / 2)) <= this.maxBoardSize) &&
          ((this.boardProfile.boardSize + (this.resizingDifference / 2)) >= 500)) {
            this.boardProfile.boardSize = this.boardProfile.boardSize + (this.resizingDifference / 2);
            this.resizingDifference = 0;
          }
          // When we hit -20, we resize the board by -10 pixels.
        } else if(this.resizingDifference <= -20) {
          if(((this.boardProfile.boardSize + (this.resizingDifference / 2)) <= this.maxBoardSize) &&
          ((this.boardProfile.boardSize + (this.resizingDifference / 2)) >= 500)) {
            this.boardProfile.boardSize = this.boardProfile.boardSize + (this.resizingDifference / 2);
            this.resizingDifference = 0;
          }
        } 
      }
      this.mouseXCoord = mouseXCoord;
      // Reset the resizing difference to 0 if it is more than 21 or less than -21, this is for when the above two ifs() are not hit.
      if (this.resizingDifference >= 21 || this.resizingDifference <= -21) this.resizingDifference = 0;
    }
  }

  openBoardStyleModal() {
    const dialogRef = this.matDialog.open(BoardStyleComponent, {
      minWidth: 400,
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      },
      data: {
        boardProfile: this.boardProfile,
        loggedIn: this.loggedIn,
      }
    });

    dialogRef.afterClosed().subscribe((result: UserBoardProfile) => {
      if(result) {
        this.changePieces(result.pieceStyle);
        this.boardProfile = result;

        if (this.boardProfile.coordinateLabel === this.CoordinateLabelEnum.Outside) {
          this.processBoardSize();
        }

        this.setFen();
      }
    });
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
    this.moveHistoryArray.pop();
  }

  // Sets the board position using the current activeFen variable.
  setFen() {
    if (this.activeFen) {
      this.moveHistoryArray = [];
      this.board?.setFEN(this.activeFen.fenString.toString());
    }
  }

  // Saves the current Fen to the users Clipboard
  savedFenToClipboard(fen: string) {    
    this.snackBar.open(fen + ' has been saved to the clipboard', null, {duration: 3000});
  }

  // Opens the Fen Collection Modal. Manages return data.
  openFenCollectionsDialog(parent: string) {
    let fenString: string = null;
    if (parent === 'board-save') {
      fenString = this.board?.getFEN();
    }
    
    const dialogRef = this.matDialog.open(CollectionsComponent, {
      minWidth: 900,
      position: {
        top: '',
        bottom: '',
        left: '',
        right: '',
      },
      data: {
        parent: parent,
        collection: this.collection,
        fenString: fenString,
      },
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

  openVideoPlayer() {
    this.matDialog.open(VideoPlayerComponent, {
      minWidth: 1250,
      minHeight: 750,
      position: {
        top: '',
        bottom: '',
        left: '',
        right: '',
      }
    });
  }

  // Fen Navigation after a collection has been loaded in.
  navigateFen(direction: string) {
    let activeFenIndex = 0;
    if (direction === 'previous' || direction === 'next') activeFenIndex = this.collection.fens.findIndex(fen => fen._id === this.activeFen._id);
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
    this.activeFenPosition = this.collection.fens.findIndex(fen => fen._id === this.activeFen._id) + 1;
    this.setFen();
  }

  clearFens() {
    this.activeFen = null;
    this.collection.fens = [];
    this.reset();
  }

  // Toggled when a mouse click up event has fired on the overlay grid for piece dragging.
  mouseUpEvent(event) {
    const path = event.path || (event.composedPath && event.composedPath());
    if (this.boardProfile.freeMode) {
      this.board?.addPiece(this.piece.piece, this.piece.colour, path[1].id);
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
    const dialogRef = this.matDialog.open(HelpComponent, {
      minWidth: 700,
      minHeight: 700,
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  openImportSingleFen() {
    const dialogRef = this.matDialog.open(ImportSingleFenComponent, {
      minWidth: 500,
      minHeight: 'auto',
      position: {
        top: '',
        bottom: '',
        left: '',
        right: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.activeFen = { fenString: result };
      this.setFen();
    });
  }

  changePieces(pieceStyleString: string) {
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

  setBoardProfile(boardProfileRouteData: UserBoardProfile) {
    if (boardProfileRouteData) {
      this.boardProfile = boardProfileRouteData;
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
  
  pieceMoved() {
    this.moveHistoryArray = this.board.getMoveHistory();
  }
}
