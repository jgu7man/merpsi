import { Component, OnInit } from '@angular/core';
import { CreditNoteService } from './credit-note.service';
import { iCreditNote } from './creditNote.model';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

  listCredits: iCreditNote[] = []
  constructor(
    public credit : CreditNoteService
  ) {
    credit.listCredits().subscribe( list => {
      this.listCredits = list
    })
   }

  ngOnInit(): void {
  }

}
