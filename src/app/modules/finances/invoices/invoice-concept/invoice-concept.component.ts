import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { ProductInvoiceModel } from 'src/app/modules/finances/invoices/invoice.model';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesService } from '../../sales-invoices/sales.service';

@Component({
  selector: 'app-invoice-concept',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptComponent implements OnInit {

  @Input() concept: ProductInvoiceModel | null = null
  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | string  = ''
  productListEmpty = false

  formAddProduct: FormGroup = new FormGroup({
    product: new FormControl('', ),
    cant: new FormControl(0, ),
    unit_cost: new FormControl(0, ),
    UPC: new FormControl('', ),
    reference: new FormControl('', ),
    description: new FormControl('', ),
    brand: new FormControl('', ),
    measure_unit: new FormControl('', ),
    amount  : new FormControl(null, ),
  })

  

  
  constructor(
    private _cache: MxCache,
    public purchase: PurchaseInvoiceService,
    public sales: SalesService

  ) { }

  ngOnInit(): void {
    
    console.log('estoy en el componente')
    if ((this.purchase.current$.value || this.sales.current$.value)  && this.concept) {
      this.disableForm()
      console.log('pase por aqui')
      this.formAddProduct.valueChanges.pipe(
        distinctUntilChanged((x, y) =>
          typeof x != 'object' ? x === y : JSON.stringify(x) === JSON.stringify(y)
        ),
        skip( 1),
        debounceTime(3000),
      ).subscribe(changes => {
        let details = this.purchase.current$.value ? 
        this.purchase.current$.value!.details : 
        this.sales.current$.value!.details
        details = details.map(d => {
          let details
          if (d.UPC ===this.concept!.UPC){
            changes.amount = changes.cant * changes.unit_cost
              details = {
                ...this.concept,
            ...changes
              }
          } else {
            details = d
          }
          return details
        }
        )
        console.log(details)
        this.purchase.current$.value ? this.purchase.updateCurrent('details', details) : this.sales.updateCurrent('details',details)
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

  disableForm() {
    this.formAddProduct.controls.UPC.disable()
    this.formAddProduct.controls.description.disable()
    this.formAddProduct.controls.amount.disable()
    
  }

  deleteConcept(concept: ProductInvoiceModel | null ){
    if (concept)
  this.purchase.deleteConcept(concept.UPC)
  }

}
