import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { iSede } from 'src/app/modules/admin/stores/sede.model';
import { SedesService } from 'src/app/modules/admin/stores/sedes.service';
import { iProductInvoice } from 'src/app/modules/finances/invoices/invoice.model';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesInvoiceModel } from '../sales-invoice.model';
import { SalesService } from '../sales.service';

@Component({
  selector: 'app-invoice-concept-sales',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptSalesComponent implements OnInit {

  @Input() concept: iProductInvoice | null = null
  @Input() stock: number = 0
  @Input() invoice: SalesInvoiceModel | null= null

  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | null  = null
  productListEmpty = false
  stores$: Observable<iSede[]>


  formAddProduct: FormGroup = new FormGroup({
    store: new FormControl(''),
    product: new FormControl('', ),
    cant: new FormControl(0, ),
    unit_cost: new FormControl(0, ),
    UPC: new FormControl('', ),
    reference: new FormControl('', ),
    description: new FormControl('', ),
    brand: new FormControl('', ),
    measure_unit: new FormControl('', ),
    amount  : new FormControl(0, ),
  })

  

  @Output() changes = new EventEmitter();
  @Output() delete = new EventEmitter();
  constructor(
    private _cache: MxCache,
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
    private _stores: SedesService,
    private _alert: MxAlert,



  ) { 

    this.stores$ = this._stores.listenAll()
  }

  ngOnInit(): void {

    
    if (this.concept) {
      this.formAddProduct.controls.cant.setValidators(Validators.max(this.concept!.stock))
      this.disableForm()
      this.formAddProduct.valueChanges.pipe(
        distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip( 1),
        debounceTime(1000),
      ).subscribe(changes => {
      changes.UPC = this.formAddProduct.getRawValue().UPC
        this.changes.emit( changes )
      })

      console.log('-----invoice concept-----');
      
      console.log(this.concept);
      
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

  disableForm() {
    this.formAddProduct.controls.UPC.disable()
    this.formAddProduct.controls.description.disable()
    this.formAddProduct.controls.amount.disable()
    
  }

  deleteConcept(concept: iProductInvoice | null ){
    if (concept){
     this.delete.emit(concept)
    }
  }

}
