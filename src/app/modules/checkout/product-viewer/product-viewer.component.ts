import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductInvoiceModel } from '../../finances/invoices/invoice.model';
import { Product } from '../../inventory/products/products.model';


@Component( {
  selector: 'app-product-viewer',
  templateUrl: './product-viewer.component.html',
  styleUrls: ['./product-viewer.component.scss']
})
export class ProductViewerComponent implements OnInit {

  @Input() product?: Product.MainData
  saleProduct?: ProductInvoiceModel
  @Output() close: EventEmitter<ProductInvoiceModel | void> = new EventEmitter();

  constructor () {
  }

  ngOnInit(): void {
    if ( this.product )
      this.saleProduct = new ProductInvoiceModel(
        this.product, '', 1
    )
  }

  addProduct() {
    this.close.emit(this.saleProduct)
    delete this.product
  }
}
