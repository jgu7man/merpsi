import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { ConceptAvailability, SalesInvoiceReadingModel } from '../../sales-invoice.model';
import { SalesService } from '../../sales.service';

@Component({
  selector: 'app-credit-debit-note-dialog',
  templateUrl: './credit-debit-note.dialog.component.html',
  styleUrls: ['./credit-debit-note.dialog.component.scss']
})
export class CreditDebitNoteDialogComponent implements OnInit {
  businessRef = this.dashboard.CRF
  concept: FormControl = new FormControl()
  products: ProductInvoiceModel[] = []
  productsAvailable: ConceptAvailability[] = []
  taxes: AppliedTaxModel[] = []
  invoice: SalesInvoiceReadingModel | null = null
  constructor(
    public sales: SalesService,
    public footer: FooterService,
    public dashboard: DashboardService,
    private _dialogRef: MatDialogRef<SelectConceptDialogComponent>,
    private _router: Router,
    private _alert: MxAlert,
    private _invoiceConcept: InvoiceConceptService,
    @Inject(MAT_DIALOG_DATA) public document: {invoice: SalesInvoiceReadingModel, document:string, origin:string},

  ) { }

  ngOnInit(): void {
    console.log(this.document);

    if (!this.document) throw { message: 'No se encuentra el document'}
    if (this.document.invoice) {
      if ( this.document.invoice.avalibleConcepts.length > 0 ){
        this.productsAvailable = this.document.invoice.avalibleConcepts
      } else {
        this.products = this.document.invoice.details.map(det => {
          return new ProductNoteModel(det.cant, det.unit_price, det.store, det.product)
        })
      }
    
    }


  }
  addProduct(event: MatCheckboxChange, concept: ConceptAvailability) {
    try {
      if (event.checked) {
        let product = new ProductNoteModel(concept.cant, concept.unit_price, concept.store, concept.concept)
        this.products.push(product);
      } else {
        this.products = this.products.filter(c => c.product.UPC != concept.concept.UPC)
      }
      console.log((this.products.length === 0) || (this.concept.value != 'anulacion'));
      console.log(this.concept.value);
      console.log(this.products);

    } catch (error) {
      console.error(error)
    }
  }
  createCDN() {
    try {
      const id_invoice = this.document.invoice.invoiceId
      Swal.fire({
        title: 'Estas seguro en crear el documento?',
        confirmButtonText: 'aceptar',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.document.document == 'debit') {
            this._invoiceConcept.details_Notes$.next(this.products)
            if (this.document.origin == 'invoice') {
              this._router.navigate([`/business/${this.businessRef}/finances/new-debit-notes/${id_invoice}`])
                .then(() => {
                  this._dialogRef.close()
                })
            } else if (this.document.origin == 'creation'){
              this._dialogRef.close()
            }
          } else if (this.document.document == 'credit') {
            if (this.concept.value == 'anulacion' && this.document.invoice.related_documents.length > 0) {

              Swal.fire('No es posible aplicar una Nota de Credito por concepto de Anulación para este documento')
            } else {
              this._invoiceConcept.details_Notes$.next(this.products)
              if (this.document.origin == 'invoice') {
                this._router.navigate([`/business/${this.businessRef}/finances/new-credit-notes/${this.concept.value}/${id_invoice}`])
                  .then(() => {
                    this._dialogRef.close()
                  })
              } else if (this.document.origin == 'creation'){
                let result = {
                 tipo: this.concept.value,
                 invoiceId: id_invoice,
                 origin: this.document.origin                
                }
                console.log(result);
                
                this._dialogRef.close(result)
              }
            }
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
  changeConcept() {
    this.products = []
    if (this.concept.value == 'anulacion') {
      if (this.document.invoice) {
        this.products = this.document.invoice.details.map(det => {
          return new ProductNoteModel(det.cant, det.unit_price, det.store, det.product)
        })
      } else {
        this.products = []
        if (!this.invoice) throw { message: 'No se ha seleccionado una factura' }
        this.products = this.invoice.details.map(det => {
          return new ProductNoteModel(det.cant, det.unit_price, det.store, det.product)
        })
      }
    }

  }



}
