import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iScannerUI } from '../mx-scanner.model';

@Component({
  templateUrl: './mx-scanner.dialog.html',
  styleUrls: ['./mx-scanner.dialog.scss']
})
export class MxScannerDialog implements OnInit {

  constructor (
    public dialog: MatDialogRef<MxScannerDialog>,
    @Inject( MAT_DIALOG_DATA ) public scannerUI: iScannerUI
  ) { }

  ngOnInit(): void {
  }

}
