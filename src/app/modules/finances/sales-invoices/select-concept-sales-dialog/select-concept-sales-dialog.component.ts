import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ProductModel, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { SelectConceptDialogComponent } from '../../invoices/select-concept.dialog/select-concept.dialog.component';
import { SalesService } from '../sales.service';

@Component({
  selector: 'app-select-concept-sales-dialog',
  templateUrl: './select-concept-sales-dialog.component.html',
  styleUrls: ['./select-concept-sales-dialog.component.scss']
})
export class SelectConceptSalesDialogComponent implements OnInit {
  businessRef = this._cache.getDataKey( 'eid' )
  productStoresStoks: StoreReferenceModel[] | null = null
  products: ProductModel[] = []

  constructor(
    private _cache: MxCache,
    private _dialog: MatDialogRef<SelectConceptDialogComponent>,
    public sales: SalesService,
    private _dialogProduct: MatDialog,
    // public invoice: InvoiceService
  ) { }

  ngOnInit(): void {
  }

  getValue(store: StoreReferenceModel){
   let p = this.products.find(p => p.UPC==store.UPC)!
   this.sales.addConcept(p)
    this._dialog.close(p)
  }

  getList(product: ProductModel[]){
    this.products = product
    product.forEach(async p => {
      let productStore = await this.sales.getStokProductByStore(p.UPC)
      if (productStore) {
        this.productStoresStoks = []
        this.productStoresStoks.push(productStore)
      }
    })    
   // this.productListEmpty = product.length ==0 ? true : false
  }


}
