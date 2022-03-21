import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MxIndex } from '@marxa/index';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxScannerDialog } from 'libs/@marxa/scanner/mx-scanner-dialog/mx-scanner.dialog';
import { Subscription } from 'rxjs';
import { ProductModel,  } from 'src/app/models/products.model';
import { InventoryProductsService } from '../services/products.service';


@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  /** Lista de productos obtenida de la consulta */
  public products: ProductModel.DataReference[] = []
  /** Producto que se mostrará en el panel */
  public productoSelected?: ProductModel.DataReference
  /** Input del código de producto que se buscará */
  public codeScannedCtrl: FormControl = new FormControl( '' )
  /** Columnas para mostrar en la tabla */
  readonly prodCols: string[] = [ 'codigo', 'referencia', 'existencias_totales', 'costoUnitario', 'iva', 'categorias', 'proveedor' ]
  /** Suscripción a la lista de productos */
  private _listSubscription: Subscription
  /** Panel del producto */
  @ViewChild('productDrawer') productDrawer!: MatDrawer

  constructor (
    private _cache: MxCache,
    private _index: MxIndex,
    private _dialog: MatDialog,
    private _productos: InventoryProductsService
  ) {
    /* Obtiene el Business ID */
    const bid = this._cache.getDataKey('eid')
    /* Se inicializa el indexado de productos */
    this._index.initIndex( `businesess/${ bid }/products`, 'product_code', 20 )
    /* Se suscribe a la respuesta del índice */
    this._listSubscription =
    this._index.queryData.subscribe( data => {
      this.products = data
    })
   }

  ngOnInit(): void {
  }

  /**
   * Cierra el Panel del producto
   *
   * @param {DataReference} product
   */
  closeProductPanel(product: ProductModel.DataReference): void {
    this.productDrawer.close()
    delete this.productoSelected
    this.products.map(p =>  p.product_code == product.product_code ? product : p)
  }

  onDeleted(product: ProductModel.DataReference): void {
    this.productDrawer.close()
    delete this.productoSelected
    this.products.filter(p => p.product_code != product.product_code)
  }

  
  async onScanned(result: string){
    this.products = await this._productos.searchByIdentifier(result)
  }

  async searchCode() {
    let code = this.codeScannedCtrl.value
    if ( code ) {
      this.products = await this._productos.searchByIdentifier( code )
    }
    this.codeScannedCtrl.setValue('')
  }

  restoreCriteria() {
    this._index.setCriteriaFilter('', 'codigo', 'asc');
  }

  ngOnDestroy(): void {
    this._listSubscription.unsubscribe()
  }


}
