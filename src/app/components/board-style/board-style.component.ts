import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { slideFromLeft } from 'src/app/_animations/animations';
import { UserBoardProfile } from 'src/app/_models/board/user-board-profile';
import { CoordinateLabelEnum } from 'src/app/_models/enums/coordinate-label.enum';
import { BoardService } from 'src/app/_services/board.service';

@Component({
  selector: 'app-board-style',
  templateUrl: './board-style.component.html',
  styleUrls: ['./board-style.component.scss'],
  animations: [slideFromLeft]
})
export class BoardStyleComponent implements OnInit {
  
  boardStyleFormGroup: FormGroup = new FormGroup({
    boardSize: new FormControl(),
    freeMode: new FormControl(),
    coordinateLabel: new FormControl(),
    coordinateSize: new FormControl(),
    darkTileColour: new FormControl(),
    lightTileColour: new FormControl(),
    pieceStyle: new FormControl(),
  });

  public loggedIn: boolean = false;

  get CoordinateLabelEnum(): typeof CoordinateLabelEnum {
    return CoordinateLabelEnum;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {boardProfile: UserBoardProfile, loggedIn: boolean},
    public boardService: BoardService,
    private dialogRef: MatDialogRef<BoardStyleComponent>,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.boardStyleFormGroup.patchValue(this.data.boardProfile);
    this.loggedIn = this.data.loggedIn;
  }

  saveStyle() {
    const boardProfile: UserBoardProfile = this.boardStyleFormGroup.value
    if(this.loggedIn) {
      this.boardService.saveBoardProfile(this.boardStyleFormGroup.value).subscribe(result => {
        this.snackBar.open('This style has been saved to your profile.', null, {duration: 3000});
      }, error => {
        this.snackBar.open('There was an error saving your style to your profile.', null, {duration: 3000});
      }, () => {
        this.dialogRef.close(boardProfile);
      });
    } else {
      this.dialogRef.close(boardProfile);
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
