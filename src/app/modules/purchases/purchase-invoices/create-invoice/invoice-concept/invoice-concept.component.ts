import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { FireDoc } from 'src/app/models/firestore.model';
import { ProductInvoiceModel } from 'src/app/models/invoice.model';
import { ProductModel } from 'src/app/models/products.model';
import { PurchaseInvoiceService } from 'src/app/services/puchase-invoice.service';

@Component({
  selector: 'app-invoice-concept',
  templateUrl: './invoice-concept.component.html',
  styleUrls: ['./invoice-concept.component.scss']
})
export class InvoiceConceptComponent implements OnInit {

  @Input() concept: FireDoc<ProductInvoiceModel> | null = null
  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | string  = ''
  productListEmpty = false

  formAddProduct: FormGroup = new FormGroup({
    product: new FormControl('', [Validators.required]),
    cant: new FormControl('', [Validators.required]),
    unit_cost: new FormControl('', [Validators.required]),
  })

  
  constructor(
    private _cache: MxCache,
    public purchase: PurchaseInvoiceService,

  ) { }

  ngOnInit(): void {
    if (this.concept) {
      this.formAddProduct.patchValue(this.concept)
      this.formAddProduct.markAsPristine()
    }

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

}
