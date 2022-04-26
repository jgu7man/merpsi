import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { BehaviorSubject, Observable, of, Subject,  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { FireDoc, txn } from 'src/app/models/firestore.model';
import { Product, ProductModel, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ManagerModel } from '../../admin/managers/manager.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentProductService {

  product$ = new BehaviorSubject<Product.DataReference | null>( null )
  storage$ = new BehaviorSubject<StoreReferenceModel[]>( [] )
  formValid$ = new BehaviorSubject<{[store:string]: boolean}>( {} )
  submited$ = new Subject<void>()
  get formValid(): Observable<boolean> {
    return this.formValid$.pipe( map( formList => {
      const stores = Object.keys( formList )
      return stores.length > 0
        ? stores
          .map( id => formList[ id ] )
          .every( valid => valid === true )
        : true
    }))
  }



  constructor (
    private _dashboard: DashboardService,
    private _text: MxText,
    private _alert: MxAlert,
    private _loading: MxLoading,
    private _auth: AuthService,
    private _afs: AngularFirestore
  ) { }

  get managerRef() {
    let user = this._auth.userState$.value
    if (!user) throw {message: 'No se ha iniciado sesión'}
    let userRef = this._dashboard.businessRef
      .collection( 'managers' )
      .doc<ManagerModel>( user.uid )
      .ref
    return userRef
  }

  listenStorage(): BehaviorSubject<StoreReferenceModel[]> {
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
   retriveStoresRef( UPC: string ): Observable<StoreReferenceModel[]> {
    const productId =  this._text.slugify(UPC);
    
    return this._dashboard.businessRef.collection
      <StoreReferenceModel>( `products/${ productId }/stores` )
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
  
  
  updateStore( store: StoreReferenceModel ) {
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

  async save(): Promise<FireDoc<Product.DataReference>> {
    this._loading.spinner('open')
    try {
      
      
      if ( this.product$.value == null )
        throw { message: 'Se ha perdido el state del producto actual' }
      
      const productState = await this.product$.value
      const product = new ProductModel( productState, this.managerRef )
      console.log( product.getData() )
      const productRef = this._dashboard.businessRef
        .collection( 'products' )
        .doc<ProductModel>( product!.UPC).ref
      
      /* Guarda el producto */
      await productRef.set( {
        ...product.getData(),
        // last_update: {...product.last_update}
      }, { merge: true } )
      
      /* Asigna un evento */
      await productRef
        .collection( `history` )
        .doc( `${ new Date().getTime() }` )
        .set( { ...product!.last_update } )
      
      /* Obtiene el producto agregado */
      const productSetted = await productRef.get()
      
      this._loading.spinner('close')
      this._alert.notify( 'Producto guardado' )
      return productSetted
      
    } catch ( error: any ) {
      this._loading.spinner('close')
      this._alert.error('No se logró guardar el producto', error)
      console.error( error );
      throw error
    }
  }

  updateState(
    param: keyof Product.DataReference,
    value: Product.DataReference[ typeof param ]
  ) {
    if ( this.product$.value !== null ) {
      this.product$.next( {
        ...this.product$.value,
        [param]: value
      })
    }
  }

  leave() {
    this.product$.next( null )
    this.storage$.next( [] )
    this.formValid$.next( {} )
  }
}
