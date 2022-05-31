import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { CreditNoteService } from '../../../credit-note/credit-note.service';
import { CreditNoteModel } from '../../../credit-note/creditNote.model';
import { DebitNoteService } from '../../../debit-note/debit-note.service';
import { FooterService } from '../../../invoices/footer-invoice/footer.service';
import { Invoice, ProductInvoiceModel } from '../../../invoices/invoice.model';
import { SelectConceptDialogComponent } from '../../../invoices/select-concept.dialog/select-concept.dialog.component';
import { AppliedTaxModel } from '../../../taxes/taxes.model';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-credit-debit-note.dialog',
  templateUrl: './credit-debit-note.dialog.component.html',
  styleUrls: ['./credit-debit-note.dialog.component.scss']
})
export class CreditDebitNoteDialogComponent implements OnInit {
  businessRef = this._dashboard.CRF
  concept: FormControl = new FormControl()
  products: Invoice.concept[] = []
  taxes: AppliedTaxModel[] = []
  constructor(
    private _dashboard: DashboardService,
    private _dialogRef: MatDialogRef<SelectConceptDialogComponent>,
    private _router: Router,
    private _credit: CreditNoteService,
    private _debit: DebitNoteService,
    private _alert: MxAlert,
    public sales: SalesService,
    public footer: FooterService,
    @Inject(MAT_DIALOG_DATA) public document: string
  ) { }

  ngOnInit(): void {
    

  }
  addProduct(event: MatCheckboxChange, concept: Invoice.concept) {
    if (event.checked) {
      this.products.push(concept);
    } else {
      this.products= this.products.filter(c => c.product.UPC != concept.product.UPC)
    }
  }
  createCDN(){
    try {
      // if (!this.sales.current$.value) throw { message: 'No existe sales '}
      // const id_invoice= this.sales.current$.value.invoiceId
      // Swal.fire({
      //   title: 'Estas seguro en crear el documento?',
      //   confirmButtonText:'aceptar',
      //   showCancelButton:true
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     if (this.document == 'debit') {
      //       this._debit.details$.next(this.products)
      //       this._router.navigate([`/business/${this.businessRef}/finances/new-debit-notes/${id_invoice}`])
      //       .then((result) => {
      //         this._dialogRef.close()
      //       })    
      //     } else {
      //       if (this.concept.value == 'anulacion') {
      //         if (!this.sales.current$.value) throw { message: 'No existe el current de sales' }
      //        // this.products = this.sales.current$.value.details
      //         this._credit.currentNC$.next(new CreditNoteModel(id_invoice, '', '', this.concept.value, this.products, this.sales.current$.value.footer))
      //         //this.footer.currentfoot$.next(this.sales.current$.value.footer)
      //         console.log(this._credit.currentNC$.value);

      //       } else {
      //         this._credit.currentNC$.next(new CreditNoteModel(id_invoice, '', '', this.concept.value, this.products))
      //       }

      //       this._router.navigate([`/business/${this.businessRef}/finances/new-credit-notes/${this.concept.value}/${id_invoice}`])
      //         .then((result) => {
      //           this._dialogRef.close()
      //         })
      //     }
      //   }
          
      // })
    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
    
    

  }

}
