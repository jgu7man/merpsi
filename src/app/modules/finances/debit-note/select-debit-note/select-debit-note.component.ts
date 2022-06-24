import { Component, Input, OnInit } from '@angular/core';
import { iDebitNote } from '../debit-note.model';

@Component({
  selector: 'app-select-debit-note',
  templateUrl: './select-debit-note.component.html',
  styleUrls: ['./select-debit-note.component.scss']
})
export class SelectDebitNoteComponent implements OnInit {

  @Input() document: iDebitNote | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
