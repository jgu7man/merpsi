import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { Product } from 'src/app/models/products.model';
import { DashboardService } from 'src/app/modules/dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentProductService {

  product$ = new BehaviorSubject<Product.DataReference | null>( null )
  storage$ = new BehaviorSubject<Product.StoreReference[]>( [] )
  formValid$ = new BehaviorSubject<{[store:string]: boolean}>( {} )
  get formValid(): Observable<boolean> {
    return this.formValid$.pipe( map( formList =>
      Object.keys( formList )
        .map( id => formList[ id ] )
        .every( valid => valid === true )
    ))
  }

  constructor (
    private _dashboard: DashboardService,
    private _text: MxText,
    private _alert: MxAlert,
  ) { }

  listenStorage(): BehaviorSubject<Product.StoreReference[]> {
    this.product$.pipe( map( product => {
      if ( product != null ) {
        this.retriveStoresRef( product.UPC ).pipe(
          map(storage => { this.storage$.next( storage ) })
        )
      }
    }))
    return this.storage$
  }

  /**
   * Consulta y se suscribe a las existencias del producto en los diferentes almacenes de la empresa presente
   *
   * @param {string} UPC
   * @returns {*} 
   */
   retriveStoresRef( UPC: string ): Observable<Product.StoreReference[]> {
    const productId =  this._text.slugify(UPC);
    
    return this._dashboard.businessRef.collection
      <Product.StoreReference>( `products/${ productId }/stores` )
      .valueChanges().pipe(
        catchError( ( error ) => {
          this._alert.error(
            'No se pudo tener contacto con la base de datos',
            error,
            'productos.service#retriveAlamacenesRef'
          );
          return of([])
        })
      )

   }
  
  
  updateStore( store: Product.StoreReference ) {
    const currentIndex = this.storage$
    .value.findIndex( s => s.store_id ===  store.store_id )
  
    if ( currentIndex !== -1 )
      this.storage$
        .value[ currentIndex ] = store
    else
      this.storage$
        .value.push( store )
    
    this.storage$.next(this.storage$.value)
  }

  async save() {
    try {
      
      if ( this.product$.value == null )
        throw { message: 'Se ha perdido el state del producto actual' }
      
      const product = await this.product$.value
      
      await this._dashboard.businessRef
        .collection( 'products' )
        .doc( product.UPC ).ref
        .set( { ...product }, { merge: true } )
      
      
      await this._dashboard.businessRef
        .collection( `products/${ product.UPC }/history` )
        .doc( `${ new Date().getTime() }` )
        .set( {...product.last_update} )
      
      this._alert.notify( 'Producto guardado' )
      return
    } catch ( error: any ) {
      this._alert.error('No se logró guardar el producto', error)
      console.error( error );
      return
    }
  }
}
