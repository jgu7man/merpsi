import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { sumBy } from 'lodash';
import { ClientCreationModel } from '../../clients/clients.model';
import { ProductInvoiceModel } from '../../finances/invoices/invoice.model';
import { SalesService } from '../../finances/sales-invoices/sales.service';
import { Product, ProductModel, StoreReferenceModel } from '../../inventory/products/products.model';
import { CheckoutService } from '../checkout.service';
import { ClientSearcherComponent } from '../client-searcher/client-searcher.component';
import { ScanProductBottom } from '../scan-product/scan-product.bottom';

@Component({
  selector: 'app-checkout-panel',
  templateUrl: './checkout-panel.component.html',
  styleUrls: ['./checkout-panel.component.scss']
})
export class CheckoutPanelComponent implements OnInit {

  client?: ClientCreationModel
  product?: Product.DataReference
  productoCtrl: FormControl = new FormControl()


  @ViewChild('clientPanel') clientPanel!: MatDrawer
  @ViewChild('productPanel') productPanel!: MatDrawer
  products: ProductModel[] = [];

  constructor(
    private _bottom: MatBottomSheet,
    private _dialog: MatDialog,
    public checkout: CheckoutService,
    private _sales: SalesService
  ) {
    this.checkout.productList = [];
  }

  ngOnInit(): void {


  }


  openScanner() {
    this._bottom.open(ScanProductBottom)
      .afterDismissed().subscribe((product: any) => {
        // console.log(result)
        // Simulación de búsqueda
        // let product: iAccountProduct = {
        //   referencia: 'HORN DC',
        //   codigo: 'JW501600',
        //   unidades: 0,
        //   existencias:10,
        //   unitarioVenta: 28000,
        //   costoUnitario: 20000,
        //   categorias: [],
        //   unidad_medida: 'Unidad'
        // }
        if (product) {
          this.product = product
          this.productPanel.open()
        }
      })
  }

  setUnidades(act: 'sum' | 'rest', index: number) {
    this.checkout.productList[index].cant = act == 'rest'
      ? this.checkout.productList[index].cant! > 0
        ? this.checkout.productList[index].cant! - 1
        : 0
      : this.checkout.productList[index].cant! < this.checkout.productList[index].stock
        ? this.checkout.productList[index].cant! + 1
        : this.checkout.productList[index].cant!
  }


  onCloseClientPanel(cliente: ClientCreationModel) {
    this.client = cliente || this.client
  }

  onCloseProductPanel(product: ProductInvoiceModel | void) {
    this.productPanel.close()
    if (product) {
      product.cant = 1
      this.checkout.productList.push(product as ProductInvoiceModel)
    }
  }

  deleteProduct(index: number) {
    this.checkout.productList.splice(index, 1)
  }

  get Balance() {
    return sumBy<ProductInvoiceModel>(this.checkout.productList, product => {
      return (product.cant || 1) * product.unit_price
    })
  }

 

  async getList(list: ProductModel[]) {
   
    this._dialog.open(checkoutConcept,{
      data: list
    })
    // this.checkout.findStoresProduct(list)
  }

  // getValue(store: StoreReferenceModel) {
  //   let p = this.products.find(p => p.UPC == store.UPC)!
  //   this.checkout.addConcept(p, store.stock, store.store_id)

  // }
}

@Component({
  selector: 'app-checkout-concept',
  template: `<ng-container *ngIf="checkout.productStoresStoks as products">
              <ng-container *ngIf="products.value.length > 0; else emptyStock">
                <span>Seleccione el concepto</span>
              <ng-container *ngFor="let product of products | async">
              <div class="row">
                  <div class="col s3"><b>{{product.UPC}}</b><br></div>
                  <div class="col s3"> Sede:{{ product.store_id | store | async}} <br></div>
                    <div class="col s3"> Existencias:{{product.stock}}</div>
                    <div class="col s3"> <button mat-button color="accent" (click)="getValue(product)" > Agregar</button></div>
                </div>
              </ng-container>
              </ng-container>
              <ng-template #emptyStock>
                <b>No existes exitencias para el concepto seleccionado</b>
              </ng-template>
              
            </ng-container>`
})
export class checkoutConcept implements OnInit {

  products: ProductModel[] = [];

  constructor(
    public checkout: CheckoutService,
    @Inject(MAT_DIALOG_DATA) public productList: ProductModel[],
    private _sales: SalesService,
    private _dialog: MatDialogRef<checkoutConcept>,
  ) { 
    this.products = productList
    this.checkout.findStoresProduct(productList)
  }

  async ngOnInit(): Promise<void> {
   
  }

  getValue(store: StoreReferenceModel) {
    console.log(store);
    
    let p = this.products.find(p => p.UPC == store.UPC)!
    this.checkout.addConcept(p, store.stock, store.store_id, store.unit_price)
    this._dialog.close()
    console.log(this.checkout.productList);
    

  }

}
