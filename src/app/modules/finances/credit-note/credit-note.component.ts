import { Component, OnInit } from '@angular/core';
import { mxIndexCenterMessage } from 'libs/@marxa/index/src/lib/mx-index.model';
import { MxIndex } from 'libs/@marxa/index/src/lib/mx-index.service';
import { FooterCreditoDebitoService } from '../shared/footer-note/footer-notes.service';
import { DetailsConceptService } from '../shared/invoice-details/invoice-details.service';
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
    private _index: MxIndex,
    private _invoiceConcept: DetailsConceptService,
    private _footer: FooterCreditoDebitoService,


  ) {
    this._index.collection = `/businesses/${this.credit.businessCRF}/credit_notes`
    this._index.field = 'id'
    this._index.initIndex(this._index.collection, this._index.field, 10)
    this._index.page$.subscribe(data => {
      this.listCredits = data
    })
   }

  ngOnInit(): void {
  }

  create(){
  this._invoiceConcept.details_Notes$.next([])
  this._footer.footer$.next(null)
  this.credit.invoiceRef$.next(null)

  }

 

}
