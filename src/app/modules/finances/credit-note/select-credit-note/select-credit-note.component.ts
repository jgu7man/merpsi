import { Component, Input, OnInit } from '@angular/core';
import { iCreditNote } from '../creditNote.model';

@Component({
  selector: 'app-select-credit-note',
  templateUrl: './select-credit-note.component.html',
  styleUrls: ['./select-credit-note.component.scss']
})
export class SelectCreditNoteComponent implements OnInit {

  @Input() document: iCreditNote | null = null
  constructor() { }

  ngOnInit(): void {
    console.log(this.document);
    
  }

}
