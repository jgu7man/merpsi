import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iCreditNote } from '../../../credit-note/creditNote.model';

@Component({
  selector: 'app-select-document.dialog',
  templateUrl: './select-document.dialog.component.html',
  styleUrls: ['./select-document.dialog.component.scss']
})
export class SelectDocumentDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public document: any

  ) { }

  ngOnInit(): void {
  }

}
