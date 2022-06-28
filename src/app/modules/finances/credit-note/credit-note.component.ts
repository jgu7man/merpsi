import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mxIndexCenterMessage } from 'libs/@marxa/index/src/lib/mx-index.model';
import { MxIndex } from 'libs/@marxa/index/src/lib/mx-index.service';
import { CreditDebitNoteDialogComponent } from '../sales-invoices/create-invoice-sales/credit-debit-note.dialog/credit-debit-note.dialog.component';
import { CreditNoteService } from './credit-note.service';
import { iCreditNote } from './creditNote.model';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {
  centerMessage: mxIndexCenterMessage ={
    showing: 'Mostrando',
    from: 'del',
    to: 'al'
  }
  listCredits: iCreditNote[] = []
  constructor(
    public credit : CreditNoteService,
    private _index: MxIndex

  ) {
    // credit.listCredits().subscribe( list => {
    //   this.listCredits = list
    // })

    this._index.collection = `/businesses/${this.credit.businessCRF}/credit_notes`
    this._index.field = 'id'
    this._index.initIndex(this._index.collection, this._index.field, 10)
    this._index.page$.subscribe(data => {
      this.listCredits = data
    })
   }

  ngOnInit(): void {
  }

 

}
