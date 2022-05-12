import { Component, OnInit } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
// import { createDate } from '../models/firestore.model';
import firebase from 'firebase/app'
import { CreditNoteService } from '../modules/finances/credit-note/credit-note.service';
import { creditNoteModel } from '../modules/finances/credit-note/creditNote.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {


  obj:creditNoteModel = {
    date_emition: firebase.firestore.Timestamp.fromDate( new Date() ),
    invoiceId: 'AB-01',
    noteId: 'NC-001',
    manager: 'Mariana Barrera',
    concept: 'disminucion',
    footer: {
      subtotal: 20,
      discount: 0,
      taxes: [],
      shipping: 0,
      total: 20,
      totalTaxes: 0
    },
    details: [{
      amount: 20,
      cant: 1,
      unit_cost: 20,
      UPC: 'COC001',
      reference: '',
      description: 'paleta de coco',
      brand: 'paletas de mari',
      measure_unit: 0,
      store: 'sdasdasdwesadasdasdasd',
      stock: 0
    }]
  }
  constructor(
    public credit: CreditNoteService,
    public alert: MxAlert,
  ) { }

  ngOnInit(): void {
    
    // this.credit.saveCreditNote(this.obj)
    // this.alert.message("guardado!")
  }

}
