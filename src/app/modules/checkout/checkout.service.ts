import { Injectable } from '@angular/core';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { BehaviorSubject } from 'rxjs';
import { ProductInvoiceModel } from '../finances/invoices/invoice.model';
import { SalesService } from '../finances/sales-invoices/sales.service';
import { ProductModel, StoreReferenceModel } from '../inventory/products/products.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  productList: ProductInvoiceModel[] = []
  businessRef = this._cache.getDataKey('eid')
  productStoresStoks: BehaviorSubject<StoreReferenceModel[]> = new BehaviorSubject<StoreReferenceModel[]> ([])
  
  constructor(
    private _cache: MxCache,
    private _sales: SalesService
  ) { }

  addConcept(concept: ProductModel, stock: number, store: string, unit_price: number) {
    let det = new ProductInvoiceModel(concept, store,stock,null, unit_price)
    det.stock = stock
    this.productList.push(det)
  }
  async findStoresProduct(list: ProductModel[]) {
    this.productStoresStoks.next(await this._sales.getStokProductByStore(list)) 
  }
}
