import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { ProductNoteModel } from '../../../credit-note/creditNote.model';
import { FooterService } from '../../../invoices/footer-invoice/footer.service';
import { InvoiceConceptService } from '../../../invoices/invoice-concept/invoice-concept.service';
import { ProductInvoiceModel } from '../../../invoices/invoice.model';
import { SelectConceptDialogComponent } from '../../../invoices/select-concept.dialog/select-concept.dialog.component';
import { AppliedTaxModel } from '../../../taxes/taxes.model';
import { ConceptAvailability } from '../../sales-invoice.model';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-credit-debit-note.dialog',
  templateUrl: './credit-debit-note.dialog.component.html',
  styleUrls: ['./credit-debit-note.dialog.component.scss']
})
export class CreditDebitNoteDialogComponent implements OnInit {
  businessRef = this._dashboard.CRF
  concept: FormControl = new FormControl()
  products: ProductInvoiceModel[] = []
  productsAvailable: ConceptAvailability[] = []
  taxes: AppliedTaxModel[] = []
  constructor(
    public sales: SalesService,
    public footer: FooterService,
    private _dashboard: DashboardService,
    private _dialogRef: MatDialogRef<SelectConceptDialogComponent>,
    private _router: Router,
    private _alert: MxAlert,
    private _invoiceConcept: InvoiceConceptService,
    @Inject(MAT_DIALOG_DATA) public document: any
  ) { }

  ngOnInit(): void {
    
    this.productsAvailable = this.document.invoice.avalibleConcepts.length > 0 ?  this.document.invoice.avalibleConcepts : this.document.invoice.details
    
  }
  addProduct(event: MatCheckboxChange, concept: ConceptAvailability) {
    try {
      if (event.checked) {
        let product = new ProductNoteModel(concept.cant,concept.unit_price,concept.store,concept.concept)
        this.products.push(product);
      } else {
        this.products= this.products.filter(c => c.product.UPC != concept.concept.UPC)
      }
    } catch (error) {
      console.error(error)
    }
  }
  createCDN(){
    try {
      const id_invoice= this.document.invoice.invoiceId
      Swal.fire({
        title: 'Estas seguro en crear el documento?',
        confirmButtonText:'aceptar',
        showCancelButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.document.document == 'debit') {
            this._invoiceConcept.details_Notes$.next(this.products)
            this._router.navigate([`/business/${this.businessRef}/finances/new-debit-notes/${id_invoice}`])
            .then(() => {
              this._dialogRef.close()
            })    
          } else {
            if (this.products.length<=0){
              this.products = this.document.invoice.avalibleConcepts.map((concept:ConceptAvailability) => {
                return new ProductNoteModel(concept.cant,concept.unit_price,concept.store,concept.concept)
              })
            }
            this._invoiceConcept.details_Notes$.next(this.products)
            console.log(this.products);
            this._router.navigate([`/business/${this.businessRef}/finances/new-credit-notes/${this.concept.value}/${id_invoice}`])
              .then(() => {
                this._dialogRef.close()
              })
          }
        }
          
      })
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
