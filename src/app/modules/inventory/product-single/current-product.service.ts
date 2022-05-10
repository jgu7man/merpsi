import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { BehaviorSubject, Observable, of, Subject,  } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { fireBatch, FireDoc, txn } from 'src/app/models/firestore.model';
import { Product, ProductModel, StoreReference, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ManagerModel } from '../../admin/managers/manager.model';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentProductService {

  /**
   * Mantiene el estado actual del producto
   */
  product$ = new BehaviorSubject<Product.DataReference | null>( null )
  /**
   * Referencias a los almacenes donde se encuentra el producto
   */
  storage$ = new BehaviorSubject<StoreReferenceModel[]>( [] )
  /**
   * Notificación cuando el producto ha sido enviado a guardar
   */
  submited$ = new Subject<void>()
  /**
   * Notifica la validación de las existencias del producto en los almacenes
   */
  formValid$ = new BehaviorSubject<{[store:string]: boolean}>( {} )
  /**
   * Informa la validación del formulario
   *
   * @readonly
   * @type {Observable<boolean>}
   */
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

  businessRef = this._cache.getDataKey('eid')



  constructor (
    private _dashboard: DashboardService,
    private _text: MxText,
    private _alert: MxAlert,
    private _loading: MxLoading,
    private _auth: AuthService,
    private _afs: AngularFirestore,
    private _cache: MxCache,
  ) {
    this.listenStorage()
  }

  /**
   * Referencia Firestore al producto seleccionado
   *
   * @readonly
   */
  get productRef() {
    let UPC = this.product$.value?.UPC || ''
    if (!UPC) throw {message: 'No se ha seleccionado un producto'}
    return this._afs.doc<Product.DataReference>(`businesses/${this.businessRef}/products/${UPC}`)
  }

  get storesRef() {
    return this.productRef.collection<StoreReferenceModel>( 'stores' )
  }

  /**
   * Referencia Firestore del manager autenticado
   *
   * @readonly
   */
  get managerRef() {
    let user = this._auth.userState$.value
    if (!user) throw {message: 'No se ha iniciado sesión'}
    let userRef = this._dashboard.businessRef
      .collection( 'managers' )
      .doc<ManagerModel>( user.uid )
      .ref
    return userRef
  }


  /**
   * Consulta y se suscribe a las existencias del producto en los diferentes almacenes de la empresa presente
   *
   * @param {string} UPC
   * @returns {*} {Observable<StoreReferenceModel[]>} - Observable de los almacenes
   */
   listenStorage(): Observable<StoreReferenceModel[]> {
    return this.product$.pipe(
      switchMap( product => {
        if (!product) return of( [] )

        return this.productRef.collection
          <StoreReferenceModel>( `stores` )
          .valueChanges().pipe(
            tap(storage => { this.storage$.next( storage ) }),
            catchError( ( error ) => {
              this._alert.error(
                'No se pudo tener contacto con la base de datos',
                error,
                'productos.service#retriveAlamacenesRef'
              );
              return of([])
            })
          )

    }))

   }


  /**
   * Actualiza producto en el almacen indicado
   *
   * @param {StoreReferenceModel} store Modelo de la referencia del almacen
   */
  updateStore( store: StoreReference.data, store_id: string ) {
    const currentIndex = this.storage$
    .value.findIndex( s => s.store_id ===  store_id )

    if ( currentIndex !== -1 )
      this.storage$.value[ currentIndex ] = {
        ...this.storage$.value[ currentIndex ],
        ...store
      }
    // else
    //   this.storage$
    //     .value.push( store )

    this.storage$.next(this.storage$.value)
  }


  /**
   * Guardar el estado actual del producto
   *
   * @returns {*}  {Promise<FireDoc<Product.DataReference>>} Regresa la referencia de firestore del producto recien guardado
   */
  async save(): Promise<FireDoc<Product.DataReference>> {
    this._loading.spinner('open')
    try {


      if ( this.product$.value == null )
        throw { message: 'Se ha perdido el state del producto actual' }

      const productState = await this.product$.value
      const product = new ProductModel( productState, this.managerRef )
      console.log( product.getData() )

      /* Guarda el producto */
      fireBatch.set(this.productRef.ref, {
        ...product.getData(),
      }, { merge: true } )

      /* Guarda las referencias de almacen */
      this._loading.asyncForEach( this.storage$.value, store => {
        fireBatch.set( this.storesRef.doc( store.store_id ).ref, {
          ...store,
        }, { merge: true } )
      })

      /* Asigna un evento */
      fireBatch.set( this.productRef
        .collection( `history` )
        .doc( `${ new Date().getTime() }` ).ref,
        { ...product!.last_update }
      )

      await fireBatch.commit()

      /* Obtiene el producto agregado */
      const productSetted = await this.productRef.ref.get()

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
