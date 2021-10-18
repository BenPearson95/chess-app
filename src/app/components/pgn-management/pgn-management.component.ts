import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pgn-management',
  templateUrl: './pgn-management.component.html',
  styleUrls: ['./pgn-management.component.scss']
})
export class PgnManagementComponent implements OnInit {

  pgnFormGroup = new FormGroup({
    pgnData: new FormControl('', [Validators.required]),
  });
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PgnManagementComponent>,
  ) { }

  ngOnInit(): void {
    
  }

  pgnImportSubmit() {
    this.dialogRef.close({
      pgn: this.pgnFormGroup.controls.pgnData.value
    });
  }


}
