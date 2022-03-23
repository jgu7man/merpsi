import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-provider-new.dialog',
  templateUrl: './provider-new.dialog.html',
  styleUrls: ['./provider-new.dialog.scss']
})
export class ProviderNewDialog implements OnInit {

  constructor(
    public dialog: MatDialogRef<ProviderNewDialog>,
    @Inject( MAT_DIALOG_DATA ) public crf: string
  ) { }

  ngOnInit(): void {
    
  }

}
