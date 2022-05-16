import { Component, OnInit } from '@angular/core';
import { createDate } from 'src/app/models/firestore.model';
import { CreditNoteService } from '../credit-note/credit-note.service';
import { CreditNoteModel } from '../credit-note/creditNote.model';

@Component({
  selector: 'app-test-finance',
  templateUrl: './test-finance.component.html',
  styleUrls: ['./test-finance.component.scss']
})
export class TestFinanceComponent implements OnInit {


  constructor(
   public credit: CreditNoteService
  ) { }

  ngOnInit(): void {

  }

}
