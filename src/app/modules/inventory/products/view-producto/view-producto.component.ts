import { MatDialog } from '@angular/material/dialog';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
// import { DeleteStoreProductoDialog } from '../delete-store-producto/delete-store-producto.dialog';
import { InventoryProductsService } from '../../services/products.service';
import { ProductModel } from 'src/app/models/products.model';

@Component({
  selector: 'app-view-producto',
  templateUrl: './view-producto.component.html',
  styleUrls: ['./view-producto.component.scss']
})
export class ViewProductoComponent implements OnInit {

  @Input() product!: ProductModel.DataReference
  @Output() close: EventEmitter<ProductModel.DataReference> = new EventEmitter();
  @Output() deleted: EventEmitter<ProductModel.DataReference> = new EventEmitter();
  constructor (
    private _dialog: MatDialog,
    private _products: InventoryProductsService
  ) { }

  ngOnInit(): void {
  }

  productUpdated( patch: ProductModel.StockReference) {
    this.product = {...this.product, ...patch.product};
    console.log( this.product )
    this._products.set( patch.product )
    patch.stores.forEach( store => {
      this._products.patchStoreRef(store)
    })
  }

  // onDelete(): void {
  //   this._dialog.open( DeleteStoreProductoDialog, {
  //     minWidth: '50%',
  //     maxWidth: '80%',
  //   } ).afterClosed().subscribe( confirm => {
  //     if ( confirm ) {
  //       this._products.delete(this.product.product_code)
  //       this.deleted.emit(this.product);
  //     }
  //   })
  // }



}
