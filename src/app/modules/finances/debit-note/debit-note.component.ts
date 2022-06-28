import { Component, OnInit } from '@angular/core';
import { MxIndex } from 'libs/@marxa/index/src/lib/mx-index.service';
import { mxIndexCenterMessage } from 'libs/@marxa/index/src/public-api';
import { iDebitNote } from './debit-note.model';
import { DebitNoteService } from './debit-note.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {

  listDebits: iDebitNote[] = []

  centerMessage: mxIndexCenterMessage ={
    showing: 'Mostrando',
    from: 'del',
    to: 'al'
  }
  constructor(
    private _index: MxIndex,
    private debit: DebitNoteService
  ) {
    // this._debit.listDebits().subscribe( list =>{
    //   this.listDebits = list
    // })
    this._index.collection = `/businesses/${this.debit.businessCRF}/debit_notes`
    this._index.field = 'id'
    this._index.initIndex(this._index.collection, this._index.field, 10)
    this._index.page$.subscribe(data => {
      this.listDebits = data
    })
   }

  ngOnInit(): void {
  }

}
