import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AuthService } from 'src/app/_services/auth.service';
import { FenCollectionsService } from 'src/app/_services/fen-collections.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-manage-fen',
  templateUrl: './manage-fen.component.html',
  styleUrls: ['./manage-fen.component.scss'],
  animations: [
    slideFromTop,
    slideFromBottom,
    slideFromRight,
    slideFromLeft,
  ],
})
export class ManageFenComponent implements OnInit {

  collection: FenCollection = new FenCollection;

  // Saving a Fen Collection Form
  saveCollectionForm = new FormGroup({
    collectionTitle: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    fenString: new FormControl('', [Validators.required, Validators.maxLength(255)]),
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ManageFenComponent>,
    private authService: AuthService,
    private fenCollectionsService: FenCollectionsService,
    private snackBar: MatSnackBar,
  ) { 
      // How should we load in data, depending on where this modal is being openned.
      if (data.parent === 'board') {
        if (data.collection) {
          this.collection = data.collection;
        }
      } 
      if (data.collection) {
        this.collection = data.collection;
        this.saveCollectionForm.controls.collectionTitle.setValue(this.collection.fenTitle);
        this.saveCollectionForm.updateValueAndValidity();
        this.checkfensLength();
      }
   }

  ngOnInit() {}

  // Adds a fen to the fenString Array.
  addFen() {
    if (this.saveCollectionForm.controls.fenString.valid) {
      if (!this.collection.fens) this.collection.fens = [];
      this.collection.fens.push(this.saveCollectionForm.controls.fenString.value) 
      this.saveCollectionForm.controls.fenString.reset();
      this.saveCollectionForm.updateValueAndValidity();
      this.checkfensLength();
    }
    
  }

  // Remoives a Fen from the fenString array.
  removeFen(index: number) {
    this.collection.fens.splice(index, 1);
    console.log(this.collection.fens);
    this.saveCollectionForm.updateValueAndValidity();
    this.checkfensLength();
  }

  // Handles moving items around in the Array from the Drag/Drop functionality.
  drop(event) {
    console.log(this.collection.fens);
    moveItemInArray(
        this.collection.fens, 
        event.previousIndex, 
        event.currentIndex
    );
    console.log(this.collection.fens);
  }

  // Imports a FenCollection into the board.
  import() {
    this.dialogRef.close({
      collection: this.collection,
    });
  }

  // Saves a collection to the DB.
  saveCollection() {
    let userId;
    let userAccountType;
    this.authService.currentUser$.subscribe((user) => {
      userId = user._id;
      userAccountType = user.accountType;
    });
    // if(userAccountType === AccountType.Free) {
    //   console.log('You need to be a Premium User for this feature!');
    // } else {
      this.collection.userId = userId;
      this.collection.fenTitle = this.saveCollectionForm.controls.collectionTitle.value;
      this.fenCollectionsService.saveCollection(this.collection).subscribe(result => {
        this.snackBar.open('Success!', null, {duration: 2000,});
        this.dialogRef.close({
          collection: this.collection
        });
      }, error => {
        this.snackBar.open('Failure!');
      });
    // }
  }

  updateCollection() {
    this.fenCollectionsService.updateCollectionByID(this.collection).subscribe(result => {
      this.snackBar.open('Success!', null, {duration: 2000,});
      this.dialogRef.close({
        collection: this.data.collection,
      });
    }, error => {
      console.log(error);
    });
    
  }

  checkfensLength() {
    const length = this.collection.fens.length;

    if(length > 1) {
      this.saveCollectionForm.controls.collectionTitle.enable();
    } else {
      this.saveCollectionForm.controls.collectionTitle.disable();
    }
  }
}
