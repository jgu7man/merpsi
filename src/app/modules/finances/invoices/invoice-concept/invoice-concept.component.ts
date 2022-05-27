import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { iSede } from 'src/app/modules/admin/stores/sede.model';
import { SedesService } from 'src/app/modules/admin/stores/sedes.service';
import { Invoice, ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesService } from '../../sales-invoices/sales.service';
import { InvoiceConceptService } from './invoice-concept.service';

@Component({
  selector: 'app-invoice-concept',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptComponent implements OnInit {

  @Input() document: string = ''
  @Input() concept:  ProductInvoiceModel | null = null
  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | string  = ''
  productListEmpty = false
  stores$: Observable<iSede[]>


  formAddProduct: FormGroup = new FormGroup({
    cant: new FormControl(0, ),
    unit_price: new FormControl(0, ),
  })

  @Output() changes = new EventEmitter();
  @Output() delete = new EventEmitter();
  constructor(
    public sales: SalesService,
    public purchase: PurchaseInvoiceService,
    public conceptInvoice: InvoiceConceptService,
    private _cache: MxCache,
    private _stores: SedesService,


  ) { 

    this.stores$ = this._stores.listenAll()
  }

  ngOnInit(): void {

    
    if (this.concept) {
      if ( this.document == 'sales'){
        if (!this.conceptInvoice.details$.value) throw { message: ' No existe los detalles'}
        let details = this.conceptInvoice.details$.value
        details.map(det =>{
          if (det.product.UPC === this.concept!.product.UPC){
            this.formAddProduct.controls.cant.setValidators(Validators.max(det.stock))
          }
        })
      }
      this.formAddProduct.valueChanges.pipe(
        distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip( 1),
        debounceTime(1000),
      ).subscribe(changes => {
        this.conceptInvoice.update(changes,this.concept!);
      })

      this.formAddProduct.patchValue(this.concept)
      this.formAddProduct.markAsPristine()
    }
    //console.log(this.purchase.current$.value)

  }
 
  getValue(product: ProductModel){
    this.productSelect = product  
    console.log(this.productSelect)
    

  }

  getList(product: ProductModel[]){
    this.productListEmpty = product.length ==0 ? true : false
  }

  createProduct(){
    alert("abrir form de crear producto")
  }

  

  deleteConcept(concept: ProductInvoiceModel){
    if (concept){
     this.conceptInvoice.delete(concept)
    }
  }

}
