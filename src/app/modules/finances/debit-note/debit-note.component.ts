import { Component, OnInit } from '@angular/core';
import { iDebitNote } from './debit-note.model';
import { DebitNoteService } from './debit-note.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {

  listDebits: iDebitNote[] = []
  constructor(
    private _debit: DebitNoteService
  ) {
    this._debit.listDebits().subscribe( list =>{
      this.listDebits = list
    })
   }

  ngOnInit(): void {
  }

}
