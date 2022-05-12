import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxIndex } from 'libs/@marxa/index/src/public-api';
import { Subscription } from 'rxjs';
import { CurrentProductService } from '../../product-single/current-product.service';
import { Product } from '../products.model';
import { InventoryProductsService } from '../products.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
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
  @ViewChild( 'productDrawer' ) productDrawer!: MatDrawer

  public UPC?: string

  constructor (
    private _cache: MxCache,
    private _index: MxIndex,
    private _productos: InventoryProductsService,
    public current: CurrentProductService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _loading: MxLoading
  ) {
    /* Obtiene el Business ID */
    const CRF = this._cache.getDataKey( 'eid' )

    this.UPC = this._route.snapshot.queryParams[ 'UPC' ]
    if ( this.UPC ) this._loading.spinner( 'open' )

    /* Se inicializa el indexado de productos */
    this._index.initIndex( `businesses/${ CRF }/products`, 'UPC', 20 )
    /* Se suscribe a la respuesta del índice */
    this._listSubscription =
      this._index.page$.subscribe( data => {
        this.products = data
    })
  }

  async ngOnInit() {
    if ( this.UPC ) {
      this.products = await this._productos.searchByIdentifier( this.UPC )
      if ( this.products.length == 1 ) {
        this.current.product$.next( this.products[ 0 ] )
      }
      this._loading.spinner( 'close' )
    }
  }

  onSelect(product: Product.DataReference): void {
    this.current.product$.next( product )
    this._router.navigate([], { queryParams: { UPC: product.UPC } })
  }

  /**
   * Cierra el Panel del producto
   */
  closeProductPanel(product: Product.DataReference): void {
    this.productDrawer.close();
    delete this.productoSelected;
    this.products.map( p => p.UPC == product.UPC ? product : p )

    this._router.navigate( [], {
      queryParams: { UPC: null },
      queryParamsHandling: 'merge'
    } )
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

  onClosePanel(): void {
    this.productDrawer.close()
    this.current.leave()
  }


}
