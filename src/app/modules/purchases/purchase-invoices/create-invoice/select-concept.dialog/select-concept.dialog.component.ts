import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ProductModel } from 'src/app/models/products.model';
import { InvoiceService } from 'src/app/services/invoice-service.service';
import { PurchaseInvoiceService } from 'src/app/services/puchase-invoice.service';
import { SalesService } from 'src/app/services/sales.service';
import { ProductNewDialogComponent } from '../../product-new-dialog/product-new.dialog.component';

@Component({
  selector: 'app-select-concept.dialog',
  templateUrl: './select-concept.dialog.component.html',
  styleUrls: ['./select-concept.dialog.component.scss']
})
export class SelectConceptDialogComponent implements OnInit {

  businessRef = this._cache.getDataKey( 'eid' )
  productSelect: ProductModel | null = null;
  productListEmpty: boolean = false;

  constructor(
    private _cache: MxCache,
    private _dialog: MatDialogRef<SelectConceptDialogComponent>,
    public purchase: PurchaseInvoiceService,
    public sales: SalesService,
    private _dialogProduct: MatDialog,
    public invoice: InvoiceService

    
  ) { }

  ngOnInit(): void {
  }

  
  getValue(product: ProductModel){
    this.productSelect = product  
    console.log(this.productSelect)
    this.invoice.addConcept(product)
    this._dialog.close()
  }

  getList(product: ProductModel[]){
    this.productListEmpty = product.length ==0 ? true : false
  }

  createProduct(){
    this._dialogProduct.open(ProductNewDialogComponent, {
      width: '100% ',
    } )
  }
}
