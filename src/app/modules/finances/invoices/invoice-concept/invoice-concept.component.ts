import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { iSede } from 'src/app/modules/admin/stores/sede.model';
import { SedesService } from 'src/app/modules/admin/stores/sedes.service';
import { Invoice, ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { iSalesInvoice } from '../../sales-invoices/sales-invoice.model';
import { SalesService } from '../../sales-invoices/sales.service';
import { InvoiceConceptService } from './invoice-concept.service';

@Component({
  selector: 'app-invoice-concept',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptComponent implements OnInit, OnDestroy {

  @Input() invoice: iSalesInvoice | null = null
  @Input() document: string = ''
  @Input() tipo_concepto: string = ''
  @Input() concept: ProductInvoiceModel | Invoice.concept | null = null
  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | string = ''
  productListEmpty = false
  stores$: Observable<iSede[]>


  formAddProduct: FormGroup = new FormGroup({
    cant: new FormControl(0,),
    unit_price: new FormControl(0,),
  })

  constructor(
    public sales: SalesService,
    public purchase: PurchaseInvoiceService,
    public conceptInvoice: InvoiceConceptService,
    private _cache: MxCache,
    private _stores: SedesService,
  ) {

    this.stores$ = this._stores.listenAll()
  }
  ngOnDestroy(): void {
  }


  ngOnInit(): void {
    if (this.concept) {
      /* validaciones para los conceptos segun el documento en el que este */
      if (this.document == 'sales') {
        if (this.conceptInvoice.details$.value) {
          let details = this.conceptInvoice.details$.value
          details.map(det => {
            if (det.product.UPC === this.concept!.product.UPC) {
              this.formAddProduct.controls.cant.setValidators(Validators.max(det.stock))
            }
          })
        }
      } else 
      if (this.document == 'debit') {
        if (this.conceptInvoice.details_Notes$.value) {
          let details = this.conceptInvoice.details_Notes$.value
          details.map(det => {
            if (det.product.UPC === this.concept!.product.UPC) {
              this.formAddProduct.controls.unit_price.setValidators(Validators.min(this.concept!.unit_price))
            }
          })
        }
      }
      else 
      if (this.document == 'credit') {
        if (this.conceptInvoice.details_Notes$.value) {
          let details = this.conceptInvoice.details_Notes$.value
          details.map(det => {
            if (det.product.UPC === this.concept!.product.UPC) {
              this.formAddProduct.controls.unit_price.setValidators(Validators.max(this.concept!.unit_price))
              this.formAddProduct.controls.cant.setValidators(Validators.max(this.concept!.cant!))
            }
          })
        }
      }
      this.formAddProduct.valueChanges.pipe(
        distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip(1),
        debounceTime(1000),
      ).subscribe(changes => {
        /* Escucha los cambios del formulario de conceptos para realizar los calculos del totales e informar al footer  */
        if (this.formAddProduct.valid) {
          this.conceptInvoice.update(changes, this.concept!, this.document);
        } 
      })

      this.formAddProduct.patchValue(this.concept)
      this.formAddProduct.markAsPristine()
    }

  }

  getValue(product: ProductModel) {
    this.productSelect = product
  }

  deleteConcept(concept: ProductInvoiceModel | Invoice.concept) {
    if (concept) {
      this.conceptInvoice.delete(concept)
    }
  }

}
