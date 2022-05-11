import { L } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { CreditNoteComponent } from '../../../credit-note/credit-note.component';
import { FormCreditNoteComponent } from '../../../credit-note/form-credit-note/form-credit-note.component';
import { SelectConceptDialogComponent } from '../../../invoices/select-concept.dialog/select-concept.dialog.component';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-credit-debit-note.dialog',
  templateUrl: './credit-debit-note.dialog.component.html',
  styleUrls: ['./credit-debit-note.dialog.component.scss']
})
export class CreditDebitNoteDialogComponent implements OnInit {
  businessRef = this._dashboard.CRF
  concept: FormControl = new FormControl()
  constructor(
    private _cache: MxCache,
    private _dashboard: DashboardService,
    private _dialogRef: MatDialogRef<SelectConceptDialogComponent>,
    private _dialog: MatDialog,
    public sales: SalesService,
    private _alert: MxAlert,
    private _router: Router

  ) { }

  ngOnInit(): void {
  }

  createCN(){
    let id_invoice= this.sales.current$.value!.invoice_ID
    Swal.fire({
      title: 'Estas seguro en crear una nota de Credito?',
      confirmButtonText:'aceptar',
      showCancelButton:true
    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate([`/business/${this.businessRef}/finances/new-credit-notes/${this.concept.value}/${id_invoice}`]).then((result) => {
          this._dialogRef.close()
        })
      } 
    })
  }

}
