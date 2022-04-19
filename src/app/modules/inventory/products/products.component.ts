import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxIndex } from 'libs/@marxa/index/src/public-api';
import { MxScannerDialog } from 'libs/@marxa/scanner/mx-scanner-dialog/mx-scanner.dialog';
import { Subscription } from 'rxjs';
import { Product,  } from 'src/app/modules/inventory/products/products.model';
import { CurrentProductService } from '../product-single/current-product.service';
import { InventoryProductsService } from './products.service';


@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  /** Lista de productos obtenida de la consulta */
  public products: Product.DataReference[] = []
  /** Producto que se mostrará en el panel */
  public productoSelected?: Product.DataReference
  /** Input del código de producto que se buscará */
  public codeScannedCtrl: FormControl = new FormControl( '' )
  /** Columnas para mostrar en la tabla */
  readonly prodCols: string[] = [ 'UPC', 'reference', 'brand', 'provider', 'last_update', 'categories', 'options' ]
  /** Suscripción a la lista de productos */
  private _listSubscription: Subscription
  /** Panel del producto */
  @ViewChild('productDrawer') productDrawer!: MatDrawer

  constructor (
    private _cache: MxCache,
    private _index: MxIndex,
    private _dialog: MatDialog,
    private _productos: InventoryProductsService,
    public current: CurrentProductService,
  ) {
    /* Obtiene el Business ID */
    const CRF = this._cache.getDataKey('eid')
    /* Se inicializa el indexado de productos */
    this._index.initIndex( `businesses/${ CRF }/products`, 'UPC', 20 )
    /* Se suscribe a la respuesta del índice */
    this._listSubscription =
    this._index.page$.subscribe( data => {
      this.products = data
    })
   }

  ngOnInit(): void {
  }

  /**
   * Cierra el Panel del producto
   */
  closeProductPanel(product: Product.DataReference): void {
    this.productDrawer.close()
    delete this.productoSelected
    this.products.map(p =>  p.UPC == product.UPC ? product : p)
  }


  /**
   * Cierra el panel cuando el producto fue borrado
   */
  onDeleted(product: Product.DataReference): void {
    this.productDrawer.close()
    delete this.productoSelected
    this.products.filter(p => p.UPC != product.UPC)
  }

  
  /**
   * Toma el valor obtenido del scanner
   */
  async onScanned(result: string){
    this.products = await this._productos.searchByIdentifier(result)
  }


  /**
   * Realiza una búsqueda de producto a través del parámetro a buscar
   */
  async searchCode() {
    let code = this.codeScannedCtrl.value
    if ( code ) {
      this.products = await this._productos.searchByIdentifier( code )
    }
    this.codeScannedCtrl.setValue('')
  }

  restoreCriteria() {
    this._index.setCriteriaFilter('', 'UPC', 'asc');
  }

  ngOnDestroy(): void {
    this._listSubscription.unsubscribe()
  }


}
