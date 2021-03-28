import { Component, Inject, OnInit, Optional } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FenCollection } from 'src/app/_models/board/fen-collection';
import { FenCollectionTableData } from 'src/app/_models/board/fen-collection-table-data';
import { ActivatedRoute } from '@angular/router';
import { FenCollectionsService } from 'src/app/_services/fen-collections.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { ManageFenComponent } from '../manage-fen/manage-fen.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CollectionsComponent implements OnInit {
  
  fenCollections: Array<FenCollection> = [];
  dataSource: Array<FenCollectionTableData> = [];
  columnsToDisplay = ['fenTitle', 'numOffens', 'createdDate', 'options'];
  expandedElement: FenCollectionTableData | null;
  parent: string = '';

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<CollectionsComponent>,
    private activatedRoute: ActivatedRoute,
    private fenCollectionsService: FenCollectionsService,
    private authService: AuthService,
    public ManageFenDialog: MatDialog,
  ) {}

  ngOnInit(){
    if (this.data) {
      this.parent = this.data.parent;
      if (this.data.parent === 'board') this.getCollectionsByUserID();
    } else {
      this.getRouteData(this.activatedRoute.snapshot.data.resolvedData);
    }
  }


  getRouteData(data: Array<FenCollection>) {
    this.fenCollections = [];
    data.forEach(collection => {
      this.fenCollections.push(collection);
    });
    this.populateTable();
  }

  populateTable() {
    this.dataSource = [];
    this.fenCollections.forEach(collection => {
      let row: FenCollectionTableData = {
        _id: collection._id,
        userId: collection.userId,
        fenTitle: collection.fenTitle,
        numOffens: collection.fens.length,
        createdDate: collection.createdDate,
        updatedDate: new Date(Date.now()),
        fens: collection.fens,
      }
      this.dataSource.push(row);
    })
  }

  removeCollection(element) {
    this.fenCollectionsService.deleteCollectionById(element._id).subscribe(result => {
      const indexToRemove = this.fenCollections.findIndex(collection => collection._id === element._id);
      this.fenCollections.splice(indexToRemove, 1);
      this.populateTable();
    }, error => {
      console.log(error);
    })
  }

  getCollectionsByUserID() {
    let userId;
    this.authService.currentUser$.subscribe(user => {
      userId = user._id
    })
    this.fenCollectionsService.getCollectionsUserById(userId).subscribe(result => {
      this.fenCollections = [];
      result.forEach(collection => {
        this.fenCollections.push(collection);
        this.populateTable();
      });
    }, error => {
      console.log(error);
    })
  }

  openManageFenDialog(collection?: FenCollection) {
    const dialogRef = this.ManageFenDialog.open(ManageFenComponent, {
      minWidth: 700,
      data: {
        parent: 'collections',
        collection: collection,
      },
    });

    dialogRef.updatePosition({
      top: '50px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCollectionsByUserID();
    });
  }

  loadCollection(collection) {
    this.dialogRef.close({
      collection: collection,
    });
  }
}
