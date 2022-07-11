import { Component, OnInit } from '@angular/core';
import { CreditNoteService } from '../credit-note/credit-note.service';

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
