import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ProductFormDialog } from 'src/app/modules/inventory/product-single/product-form/product-form.component';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { ProductNewDialogComponent } from '../../purchase-invoices/product-new-dialog/product-new.dialog.component';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { SalesService } from '../../sales-invoices/sales.service';
import { InvoiceService } from '../invoice-service.service';

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
    //this.invoice.addConcept(product)
    this._dialog.close(product)
  }

  getList(product: ProductModel[]){
    this.productListEmpty = product.length ==0 ? true : false
  }

  createProduct(){
    this._dialogProduct.open(ProductFormDialog, {
      width: '100% ',
    } )
  }
}
