import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,  } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { slideFromBottom, slideFromLeft, slideFromRight, slideFromTop } from 'src/app/_animations/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { AccountType } from 'src/app/_models/enums/account-type.enum';
import { AuthService } from 'src/app/_services/auth.service';
import { FenCollectionsService } from 'src/app/_services/fen-collections.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CollectionsComponent } from '../collections/collections.component';

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

  // fens: Array<String> = [];
  collection: FenCollection = new FenCollection;

  addFenForm = new FormGroup({
    fenString: new FormControl(
      '', [Validators.required, Validators.maxLength(255)]
    ),
  })
  activeFenForm = new FormGroup({
    activeFen: new FormControl(''),
  });
  saveCollectionForm = new FormGroup({
    collectionTitle: new FormControl({value: '', disabled: true}, [Validators.required, Validators.maxLength(255)]
    ),
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ManageFenComponent>,
    private authService: AuthService,
    private fenCollectionsService: FenCollectionsService,
    private snackBar: MatSnackBar,
    private collectionsDialog: MatDialog,
  ) { 
      if (data.parent === 'board') this.collection.fens = data.fens;
      if (data.collection) {
        this.collection = data.collection;
        this.saveCollectionForm.controls.collectionTitle.setValue(this.collection.fenTitle);
        this.saveCollectionForm.updateValueAndValidity();
        this.checkfensLength();
      }
   }

  ngOnInit() {}

  addFen() {
    if (this.addFenForm.valid) {
      if (!this.collection.fens) this.collection.fens = [];
      this.collection.fens.push(this.addFenForm.controls.fenString.value) 
      this.addFenForm.reset();
      this.saveCollectionForm.updateValueAndValidity();
      this.checkfensLength();
    }
    
  }

  removeFen(index: number) {
    this.collection.fens.splice(index, 1);
    console.log(this.collection.fens);
    this.saveCollectionForm.updateValueAndValidity();
    this.checkfensLength();
  }

  drop(event) {
    console.log(this.collection.fens);
    moveItemInArray(
        this.collection.fens, 
        event.previousIndex, 
        event.currentIndex
    );
    console.log(this.collection.fens);
  }

  save() {
    let activeIndex = this.activeFenForm.controls.activeFen.value;
    this.dialogRef.close({
      fens: this.collection.fens,
      fenActiveIndex: activeIndex
    });
  }

  saveCollection() {
    let userId;
    let userAccountType;
    this.authService.currentUser$.subscribe((user) => {
      console.log('user', user);
      userId = user._id;
      userAccountType = user.accountType;
    });
    if(userAccountType === AccountType.Free) {
      console.log('You need to be a Premium User for this feature!');
    } else {
      this.collection.userId = userId;
      this.collection.fenTitle = this.saveCollectionForm.controls.collectionTitle.value;
      console.log('the collection: ', this.collection);
      this.fenCollectionsService.saveCollection(this.collection).subscribe(result => {
        this.snackBar.open('Success!', null, {duration: 2000,});
        this.dialogRef.close({
          collection: this.collection
        });
      }, error => {
        this.snackBar.open('Failure!');
      });
    }
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

  loadCollection() {
    this.openCollectionsDialog();
  }

  openCollectionsDialog() {
    const dialogRef = this.collectionsDialog.open(CollectionsComponent, {
      minWidth: 700,
      data: {
        parent: 'board',
      },
    });

    // dialogRef.updatePosition({
    //   top: '50px'
    // });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      const collection = result.collection;
      this.saveCollectionForm.controls.collectionTitle.setValue(collection.fenTitle);
      this.collection.fens = collection.fens
      this.saveCollectionForm.updateValueAndValidity();
      this.checkfensLength();
    });
  }
  

}
