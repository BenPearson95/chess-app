import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-single-fen',
  templateUrl: './import-single-fen.component.html',
  styleUrls: ['./import-single-fen.component.scss']
})
export class ImportSingleFenComponent implements OnInit {

  public importFenFormGroup: FormGroup = new FormGroup({
    fenString: new FormControl('', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<ImportSingleFenComponent>
    ) { }

  ngOnInit(): void {
  }

  importFenSubmit() {
    this.dialogRef.close(this.importFenFormGroup.controls.fenString.value);
  }

  close() {
    this.dialogRef.close();
  }

}
