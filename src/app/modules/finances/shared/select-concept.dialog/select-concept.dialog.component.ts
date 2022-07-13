import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { ProductFormDialog } from 'src/app/modules/inventory/product-single/product-form/product-form.component';
import { ProductModel } from 'src/app/modules/inventory/products/products.model';
import { PurchaseInvoiceService } from '../../purchase-invoices/puchase-invoice.service';
import { InvoiceService } from '../invoice-service.service';

@Component({
  selector: 'app-select-concept.dialog',
  templateUrl: './select-concept.dialog.component.html',
  styleUrls: ['./select-concept.dialog.component.scss']
})
export class SelectConceptDialogComponent implements OnInit {

  businessRef = this._cache.getDataKey('eid')
  productSelect: ProductModel | null = null;
  productListEmpty: boolean = false;

  constructor(
    public purchase: PurchaseInvoiceService,
    public invoice: InvoiceService,
    private _cache: MxCache,
    private _dialog: MatDialogRef<SelectConceptDialogComponent>,
    private _dialogProduct: MatDialog,


  ) { }

  ngOnInit(): void {
  }


  getValue(product: ProductModel) {
    this.productSelect = product
    this._dialog.close(product)
  }

  getList(product: ProductModel[]) {
    this.productListEmpty = product.length == 0 ? true : false
  }

  createProduct() {
    this._dialogProduct.open(ProductFormDialog, {
      width: '100% ',
      data: 'purchase'
    }).afterClosed().subscribe(product => {
      console.log('select-concept');
      console.log(product);
      
      this._dialog.close(product)
    })
  }
}
