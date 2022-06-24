import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { iCreditNote } from '../../credit-note/creditNote.model';
import { SelectCreditNoteComponent } from '../../credit-note/select-credit-note/select-credit-note.component';
import { iDebitNote } from '../../debit-note/debit-note.model';
import { SalesInvoiceReadingModel } from '../sales-invoice.model';
import { SelectDocumentDialogComponent } from './select-document.dialog/select-document.dialog.component';

@Component({
  selector: 'app-linked-documents',
  templateUrl: './linked-documents.component.html',
  styleUrls: ['./linked-documents.component.scss']
})
export class LinkedDocumentsComponent implements OnInit {

  @Input() linked_documents?: SalesInvoiceReadingModel 
  businessRef = this._dashboard.CRF

  constructor(
    private _router: Router,
    private _dashboard: DashboardService,
    private _dialog: MatDialog,


  ){

  }

  ngOnInit(): void {
  }

  openCreditDebit(doc: iCreditNote | iDebitNote){
    if (Object.keys(doc).indexOf('context') === -1){
      //Nota de Debito
      this._dialog.open(
        SelectDocumentDialogComponent,{
          width: '100%',
          data: {document: doc, type: 'debit'}
        }
      )

    }else{
      //Nota de Credito
      this._dialog.open(
        SelectDocumentDialogComponent,{
          width: '100%',
          data: {document: doc, type: 'credit'}

        }
      )
    }
  }

}
