import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { sumBy } from 'lodash';
import { ClientCreationModel } from '../../clients/clients.model';
import { ProductInvoiceModel } from '../../finances/invoices/invoice.model';
import { Product } from '../../inventory/products/products.model';
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
  productList: ProductInvoiceModel[] = []


  @ViewChild('clientPanel') clientPanel!: MatDrawer
  @ViewChild('productPanel') productPanel!: MatDrawer

  constructor(
    private _bottom: MatBottomSheet,
    private _dialog: MatDialog
    ) {
      this.productList = [];
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
    this.productList[index].cant = act == 'rest'
      ? this.productList[index].cant! > 0
        ? this.productList[index].cant! - 1
        : 0
      : this.productList[index].cant! < this.productList[index].stock
        ? this.productList[index].cant! + 1
        : this.productList[index].cant!
  }


  onCloseClientPanel(cliente: ClientCreationModel) {
    this.client = cliente || this.client
  }

  onCloseProductPanel(product: ProductInvoiceModel | void) {
    this.productPanel.close()
    if (product) {
      product.cant = 1
      this.productList.push(product as ProductInvoiceModel)
    }
  }

  deleteProduct(index: number) {
    this.productList.splice(index, 1)
  }

  get Balance() {
    return sumBy<ProductInvoiceModel>(this.productList, product => {
      return (product.cant || 1) * product.unit_price
    })
  }

}
