import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { BehaviorSubject, Observable, of, Subject, Subscription, zip,  } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { fireBatch, FireDoc, txn } from 'src/app/models/firestore.model';
import { Product, ProductEventModel, ProductModel, StoreReference, StoreReferenceModel } from 'src/app/modules/inventory/products/products.model';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ManagerModel } from '../../admin/managers/manager.model';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { CountingsService } from '../countings/countings.service';
import { MxBatchEvent } from 'libs/@marxa/batch/batch.model';
import { iPurchaseInvoice } from '../../finances/purchase-invoices/pucharce-invoice.model';
import { PurchaseInvoiceService } from '../../finances/purchase-invoices/puchase-invoice.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentProductService {

  /**
   * Mantiene el estado actual del producto
   */
  public product$ = new BehaviorSubject<Product.DataReference | null>( null )
  /**
   * Referencias a los almacenes donde se encuentra el producto
   */
  public storage$ = new BehaviorSubject<StoreReferenceModel[]>( [] )
  /**
   * Notificación cuando el producto ha sido enviado a guardar
   */
  public submited$ = new Subject<void>()
  /**
   * Notifica la validación del formulario principal del producto.
   */
  public productFormValidation$ = new BehaviorSubject<boolean>(false);
  /**
   * Notifica la validación de los formularios de existencias del producto de cada almacén
   */
  public storeFormsValidation$ = new BehaviorSubject<{ [ store: string ]: boolean }>( {} )
  /**
   * Notifica cuando uno de los formularios del producto ha sufrido cambios
   */
  public allPristine$ = new BehaviorSubject<boolean>( true )
  /**
   * ID de la empresa
   */
  private _businessRef = this._cache.getDataKey('eid')
  /**
   * Almacena cambios de existencias de un almacen. Sólo funciona en modo arqueo.
   */
  private _stockUpdate?: StoreReference.stateUpdate


  private storageSubscription: Subscription


  constructor (
    private _dashboard: DashboardService,
    private _alert: MxAlert,
    private _loading: MxLoading,
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _countings: CountingsService,
    private _purchase: PurchaseInvoiceService,
  ) {
    this.storageSubscription = this._listenStorage()
      .pipe( mergeMap( () => this.storage$
      ) ).subscribe()
  }

  public leave() {
    this.storage$.next( [] )
    this.product$.next( null )
    this.allPristine$.next( true )
    this.storeFormsValidation$.next( {} )
    // this.storageSubscription.unsubscribe()
  }

  /**
   * Obtiene la validación de todos los formularios del producto. Aplica Pristine
   */
   public get wholeFormValid$(): Observable<boolean> {
    return zip(
      this._storeFormsValid$,
      this.productFormValidation$,
      this.allPristine$,
    ).pipe(
      map( ( [ stores, product, allPristine ] ) => {
        return (stores && product) || !allPristine
      } ),
    )
  }
  /**
   * Obtiene la validación de los formularios de almacenes
   */
   private get _storeFormsValid$(): Observable<boolean> {
    return this.storeFormsValidation$.pipe( map( formList => {
     const stores = Object.keys( formList )
     return stores.length > 0
       ? stores
         .map( id => formList[ id ] )
         .every( valid => valid === true )
       : true
   }))
 }

  /**
   * Referencia Firestore al producto seleccionado
   */
  private get _productRef() {
    let UPC = this.product$.value?.UPC || ''
    if (!UPC) throw {message: 'No se ha seleccionado un producto'}
    return this._afs.doc<Product.DataReference>(`businesses/${this._businessRef}/products/${UPC}`)
  }

  private get _storesRef() {
    return this._productRef.collection<StoreReferenceModel>( 'stores' )
  }




  /**
   * Consulta y se suscribe a las existencias del producto en los diferentes almacenes de la empresa presente
   *
   * @param {string} UPC
   * @returns {*} {Observable<StoreReferenceModel[]>} - Observable de los almacenes
   */
   private _listenStorage(): Observable<StoreReferenceModel[]> {
    return this.product$.pipe(
      switchMap( product => {
        console.log( 'product', product )
        if (!product) return of( [] )

        return this._productRef.collection
          <StoreReferenceModel>( `stores` )
          .valueChanges().pipe(
            tap( async storage => {
              console.log( 'storage', storage )
              this.storage$.next( storage )
              if ( this._countings.current ) {
                let current_store = storage
                  .find( store => store.store_id === this._countings.current!.store_id )

                if ( !current_store ) {
                  await this._enableStore( this._countings.current!.store_id )
                } else {
                  const record = await this._countings.searchRecord( product.UPC )
                  if ( record ) {
                    await this.updateStore(record.state, current_store.store_id )
                  }

                }
              } else {
                this.storage$.next( [...storage, ...this.storage$.value]  )
              }
            } ),
            catchError( ( error ) => {
              console.error(error);
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
  public async updateStore( store: StoreReferenceModel, store_id: string ) {
    const storage = this.storage$.value
    const currentIndex = storage.findIndex( s => s.store_id === store_id )

    if ( currentIndex !== -1 ) {
      let currentStore = storage[ currentIndex ]

      if ( currentStore.stock !== store.stock ) {
        this._stockUpdate = {
          ...store,
          last_stock: currentStore.stock
        }
        this._alert.notify( 'Cambio de existencias notificado' )
      }

      this.storage$.next( [
        ...storage.slice( 0, currentIndex ),
        {...store},
        ...storage.slice( currentIndex + 1 )
      ] )
    } else {
      this.storage$.next( [...storage, store ] )
    }

    return
  }


  private async _enableStore( store_id: string ) {
    try {
      if ( this.storage$.value.find( store => store.store_id === store_id ) )
        throw { message: 'El almacen ya está habilitado' }
      if ( !this.product$.value )
        throw { message: 'No se ha seleccionado un producto' }

      let { UPC } = this.product$.value

      let nuStore = new StoreReferenceModel(
        store_id, UPC, 0, 0, 0, 0, []
      )

      this.storage$.next( [
        ...this.storage$.value,
        nuStore
      ] )

      return

    } catch (error: any) {
      if ('message' in error) {
        this._alert.error(error.message, error)
      } else {
        this._alert.error('mensaje de error', error)
      }
      return console.error(error)
    }
  }


  /**
   * Guardar el estado actual del producto
   *
   * @returns {*}  {Promise<FireDoc<Product.DataReference>>} Regresa la referencia de firestore del producto recien guardado
   */
  public async save( from: string = 'counting'): Promise<FireDoc<Product.DataReference>> {
    this._loading.spinner('open')
    try {


      if ( this.product$.value == null )
        throw { message: 'Se ha perdido el state del producto actual' }

      const productState = this.product$.value
      const product = new ProductModel( productState, this._dashboard.managerRef )
      const historyRef = this._productRef.collection( 'history' ).doc( `${ new Date().getTime() }` ).ref
        product.last_update.eventRef = from ===  'counting' ? 
        this._countings.currentRef.ref : 
        this._afs.collection(`businesses/${this._businessRef}/purchases/`).doc<iPurchaseInvoice>(this._purchase.invoiceId).ref
        product.last_update.manager = this._dashboard.managerRef

      /* Guarda el producto */
      fireBatch.set(this._productRef.ref, {
        ...product.getData(),
      }, { merge: true } )

      /* Guarda las referencias de almacen */
      await this._loading.asyncForEach( this.storage$.value, store => {
        fireBatch.set( this._storesRef.doc( store.store_id ).ref, {
          bookshelves: store.bookshelves,
          min_required: store.min_required,
          unit_price: store.unit_price,
        }, { merge: true } )

      })

      /* Guarda la actualización del stock */
      if ( this._countings.current && this._stockUpdate && from == 'counting' ) {
        const {stored, UPC} = this.product$.value!

        let events = await this._countings.registUpdateRecord( UPC, {
          ...this._stockUpdate,
        }, !stored, true ) as MxBatchEvent[]

        await this._loading.asyncForEach( events, event => {
          fireBatch.set( event.ref, {
            ...event.data,
          }, { merge: true } )
        } )

        const counting_event = new ProductEventModel(
          'counting_report',
          this._dashboard.managerRef,
          this._countings.currentRef.ref,
        )

        fireBatch.set( historyRef, { ...counting_event })
      } else if ( from == 'purchase'){

        const product_event = new ProductEventModel(
          'purchase',
          this._dashboard.managerRef, 
          this._afs.collection(`businesses/${this._businessRef}/purchases/`).doc<iPurchaseInvoice>(this._purchase.invoiceId).ref

        )
        fireBatch.set( historyRef, { ...product_event })

      } 


      /* Asigna un evento */
      fireBatch.set( historyRef, { ...product!.last_update } )

      /* Ejecuta todo el batch */
      await fireBatch.commit()

      /* Obtiene el producto agregado */
      const productSetted = await this._productRef.ref.get()

      this._loading.spinner('close')
      this._alert.notify( 'Producto guardado' )
      this.allPristine$.next(true)
      return productSetted

    } catch ( error: any ) {
      this._loading.spinner('close')
      this._alert.error('No se logró guardar el producto', error)
      console.error( error );
      throw error
    }
  }

  public updateState(
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


}
