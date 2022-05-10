import firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, first, map, mergeMap, pluck, take } from 'rxjs/operators';
import { MxStorage } from '@marxa/storage';
import { ArqueoModel, UpdateRecord, DeleteRecord, iArqueoUpdate } from './arqueo.model';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { BatchService } from 'libs/@marxa/batch/batch.service';
import { InventoryProductsService } from '../products/products.service';
import { formatUPC, Product, ProductModel, StoreReference, StoreReferenceModel } from '../products/products.model';
import { BehaviorSubject, concat, forkJoin, Observable } from 'rxjs';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { fireBatch, FireRef } from 'src/app/models/firestore.model';

@Injectable({
  providedIn: 'root'
})
export class ArqueosService {

  current!: ArqueoModel | null
  get mode_on() { return this.current ? true : false; }
  list$ = new BehaviorSubject<ArqueoModel[]>( [] )
  businessCRF: string = this._cache.getDataKey( 'eid' )!
  path: string = `businesses/${ this.businessCRF }/product_countings`
  private batch = fireBatch

  constructor (
    private _afs: AngularFirestore,
    private _alert: MxAlert,
    private _loading: MxLoading,
    private _storage: MxStorage,
    private _text: MxText,
    private _cache: MxCache,
    private _productos: InventoryProductsService,
    private _batch: BatchService,
  ) {
    // /* Mantiene actualizado el estado único de arqueo en esta sesión */
    // this.getCurrent().subscribe( current => this.current$ = current )
    /* Mantiene actualizada la lista de arqueos */
    this.list().subscribe(list => this.list$.next(list))
  }


  /**
   * Referencia a la colección de firestore
   *
   * @readonly
   */
  get countingsCollectionRef() {
    if (!this.businessCRF) throw {message: 'No se tiene el CRF de la empresa'}
    return this._afs.collection<ArqueoModel>(this.path)
  }

  /**
   * Referencia al documento del actual arqueo
   *
   * @readonly
   */
  get currentRef() {
    let current = this.current
    if ( !current ) throw { message: 'No existe un arqueo de productos ACTIVO' }
    return this.countingsCollectionRef.doc<ArqueoModel>(current.store_id)
  }

  get updatesRef() {
    return this.currentRef.collection( 'updates' )
  }

  get deletingsRef() {
    return this.currentRef.collection( 'deletings' )
  }

  /**
   * Retorna un observable de la lista de arqueos de la empresa
   *
   * @returns {*} Observable<ArqueoModel[]>
   */
   list(): Observable<ArqueoModel[]> {
    return this.countingsCollectionRef.valueChanges().pipe(
      catchError( ( error: any ) => {
        console.error(error);
        this._alert.error( 'Problemas para cargar los arqueos', error )
        return []
      })
    )
  }

  /**
   * Obtiene la suscripción al actual arqueo de productos
   *
   * @param {string} [store_id] OPCIONAL ID del almacen del cuál se quiere saber el estado.
   * @returns {*}  Observable<ArqueoModel | null>
   */
  getCurrent(store_id?: string): Observable<ArqueoModel | null> {
    return this._afs.collection<ArqueoModel>( this.path,
      ref => ref.where('active', '==', true)
    ).valueChanges().pipe( map( list => {
      if ( list.length === 0 ) return null
      else if ( !store_id ) return list[ 0 ]
      else {
        let selected = list.find( a => a.id === store_id )
        return selected || null
      }
    } ) );
  }

  /**
   * Inicializa un arqueo en el almacen solicitado
   *
   * @param {string} store_id ID del almacen donde se iniciará el arqueo
   * @returns {ArqueoModel | null} Arqueo activado
   */
  async initialize(store_id: string) {
    try {
      if ( !this.current ) {

        /* Se busca que no exista un estado activo de arqueo en este almacen */

        let prentend = await this.countingsCollectionRef.ref
          .where( 'active', '==', true )
          .where( 'store_id', '==', store_id )
          .get()
        let actived = prentend.size > 0
        if (actived) throw {message: 'Ya existe un arqueo ACTIVO para este almacen. No puede iniciarse otro'}



        /* Se registra el arqueo nuevo */

        let counting: ArqueoModel = new ArqueoModel( store_id )
        this.countingsCollectionRef.doc( counting.id ).set( { ...counting } )
        return counting

      } else {
        throw {message:'Ya existe un arqueo ACTIVO para este almacen '}
      }
    } catch (error: any) {
      console.error(error)
      this._alert.error( error.message || 'No se pudo guardar el nuevo arqueo. Por favor intentalo de nuevo', error )
      return null
    }
  }

  increces( key: string ,
    condition: boolean,
    cant: number ): number {
    if ( !this.current ) throw { message: 'No existe ARQUEO ACTUAL' }
    let current: any = this.current
    return condition ? current[key] + cant : current[key]
  }

  /**
   * Asigna un registro nuevo al arqueo actual activado
   *
   * @param {UPC} UPC  Anterior estado del producto en el almacen
   * @param {StoreReference.stateUpdate} state Actualización del producto en el almacen
   * @param {boolean} [NEW] OPCIONAL Producto que se está actualizando
   */
  async setRecord( UPC: string,  state: StoreReference.stateUpdate,  NEW: boolean = false,) {
    this.current = await this.getCurrent().pipe(take(1)).toPromise()
    if ( this.current ) {
      try {

        /* Se crea y se registra el cambio */
        const productRef = this._afs.doc<Product.DataReference>(`${this.businessCRF}/products/${UPC}`).ref

        const record: UpdateRecord = new UpdateRecord( productRef, state, NEW )
        console.log( record )
        let { leftovers, missings, moneyDiffs } = record
        let { state: stateUpdate, ...restRecord } = record
        let recordId = formatUPC(record.UPC)

        await this.updatesRef.doc(recordId)
          .set( { ...restRecord, update: {...stateUpdate}  } )



        /* Se actualiza la información del arqueo */

        // let keepValue = firebase.firestore.FieldValue.increment( 0 )
        let countingUpdate: iArqueoUpdate = {
          recordCount: this.current.recordCount + 1,
          newProducts: this.increces('newProducts', record.NEW, 1),
          leftovers: {
            count: this.increces('leftovers.count', leftovers > 0, 1 ),
            acc: this.increces('leftovers.acc', leftovers > 0, leftovers ),
            valueAcc: this.increces('leftovers.valueAcc', leftovers > 0, moneyDiffs)
          },
          missings: {
            count:  this.increces('missings.count', missings > 0, 1),
            acc: this.increces('missings.acc', missings > 0, missings),
            valueAcc: this.increces('missings.valueAcc', missings > 0, moneyDiffs)
          },
        }
        await this.currentRef.update( countingUpdate as any )



        this._alert.notify( 'Registro guardado' )
        return
      } catch (error) {
        console.error(error)
        this._alert.error('Error guardando el registro', error)
      }
    } else {
      this._alert.message('No se ha inicializado ningún arqueo.')
    }
  }



  async registDeleteAll(UPC: string) {
    try {
      if ( !this.current ) throw { message: 'No se ha inicializado ningún arqueo.' }

      let productRef = this._afs.collection<StoreReferenceModel>(`${this.businessCRF}/products/${UPC}/store`)
      const stores = await productRef.valueChanges().pipe( take( 1 ) ).toPromise()

      this._loading.asyncForEach( stores, store => {
        this.registDeleting( UPC, store, true)
      } )

      return this.batch.commit()

    } catch ( error ) {
      console.error(error)
      this._alert.error('Error guardando el registro', error)
    }
  }


  /**
   * Registra la eliminación de un producto
   *
   * @param {Product.DataReference} UPC
   */
  async registDeleting( UPC: string, store: StoreReferenceModel,  all: boolean = false) {
    if ( this.current ) {
      try {

        /* Registra el producto a eliminar */
        const productRef = this._afs.doc
          <Product.DataReference>( `${ this.businessCRF }/products/${ UPC }` ).ref
        const record:DeleteRecord = new DeleteRecord( productRef, store )
        const { missings, moneyDiffs } = record

        let recordId = formatUPC( UPC )
        this.batch.set( this.deletingsRef.doc(recordId).ref,  { ...record } )


        /* Actualiza el arqueo actual */
        if (!this.current) throw { message: 'No existe arqueo actual' }

        let storeUpdate = {
          recordCount: this.current.recordCount + 1,
          deletedProducts: this.current.deletedProducts + 1,
          missings: {
            count:missings > 0
              ? this.current.missings.count + 1 : this.current.missings.count,
            acc:missings > 0
              ? this.current.missings.acc + missings : this.current.missings.acc,
            valueAcc: missings > 0
              ? this.current.missings.valueAcc + moneyDiffs : this.current.leftovers.valueAcc,
          }
        }

        this.batch.update( this.currentRef.ref, storeUpdate )

        if ( !all ) {
          this.batch.commit()
          this._alert.notify('Registro guardado')
        }

      return
      } catch (error) {
        console.error(error)
        this._alert.error('Error guardando el registro', error)
      }
    } else {
      this._alert.message('No se ha inicializado ningún arqueo.')
    }

  }

  /**
   * Actualiza las diferencias del arqueo seleccionado basado en sus propios registros.
   *
   */
  async updateDifferences(id: string) {
    try {
      const recordsRef = this.updatesRef.ref
      const recordsCol = await recordsRef.get()
      let update = {
        leftovers: {
          count: 0, acc:0, valueAcc: 0
        }, missings: {
          count: 0, acc:0, valueAcc: 0
        }
      }

      await this._loading.asyncForEach(recordsCol.docs, ( rec => {
        let {leftovers, missings, moneyDiffs} = rec.data()
        update = {
          leftovers: {
            count: leftovers > 0
              ? update.leftovers.count + 1
              : update.leftovers.count,
            acc: leftovers > 0
              ? update.leftovers.acc + leftovers
              : update.leftovers.acc ,
            valueAcc: leftovers > 0
              ? update.leftovers.valueAcc + moneyDiffs
              : update.leftovers.valueAcc,
          },
          missings: {
            count: missings > 0
              ? update.missings.count + 1
              : update.missings.count,
            acc: missings > 0
              ? update.missings.acc + missings
              : update.missings.acc,
            valueAcc: missings > 0
              ? update.missings.valueAcc + moneyDiffs
              : update.missings.valueAcc,
          },
        }
        console.log( update )
      } )
      )

      await this.currentRef.update( update )

    } catch (error) {
      console.error(error)
      this._alert.error('Error guardando el registro', error)
    }
  }

  /**
   * Busca registro alguno del producto indicado en el arqueo actual.
   *
   * @param {string} UPC Código del producto
   * @returns {*}  {(Promise<ArqueoRecord | null>)}
   */
  async searchRecord( UPC: string ): Promise<UpdateRecord | null> {
    try {
      let recordId = formatUPC(UPC)
      const recordDoc = await this.updatesRef
        .doc<UpdateRecord>( recordId )
        .ref.get()

      return  recordDoc.data() || null

    } catch (error) {
      console.error(error)
      this._alert.error( 'Error al buscar el registro', error )
      return null
    }

  }

  /**
   * Busca registro alguno de eliminación del producto en el arqueo actual.
   *
   * @param {string} UPC Código del producto.
   * @returns {*}  {(Promise<DeleteRecord | null>)}
   */
  async searchDeleted( UPC: string ): Promise<DeleteRecord | null>{
    try {
      const deletedDoc = await this.deletingsRef
        .doc<DeleteRecord>( UPC )
        .ref.get()

      return deletedDoc.data() || null

    } catch ( error ) {
      console.error(error)
      this._alert.error( 'Error al buscar el registro', error, 'searchDeleted', true )
      return null
    }
  }

  /**
   * Buscar registro por keyword del producto
   *
   * @param {string} keyword Palabra clave del producto para hacer la búsqueda
   * @returns {*}  Promise<Product.DataReference[]>
   */
  // async searchByKeyword( keyword: string ) {
  //   try {

  //     /* Search on product */
  //     const productsCol = await this._afs.collection
  //       <Product.DataReference>( `businesses/${ this.businessCRF }/products`, ref =>
  //         ref.where( 'keywords', 'array-contains', keyword ) )
  //       .valueChanges().pipe(first()).toPromise()

  //     /* Search on arqueo update record */
  //     // const recordsCol = await this.currentRef
  //     //   .collection<UpdateRecord>( 'records', ref =>
  //     //     ref.where( 'keywords', 'array-contains', keyword ) )
  //     //   .valueChanges().pipe( first(), mergeMap( list => {
  //     //     const products
  //     //   }) )
  //     //   .toPromise()


  //     /* Search on arqueo delete record */
  //     // const deletingsCol = await this.currentRef
  //     //   .collection<DeleteRecord>( `deletings`, ref =>
  //     //     ref.where( 'product.keywords', 'array-contains', keyword ) )
  //     //   .valueChanges().pipe( first(), map( list => list.map( r => r.product ) ) )
  //     //   .toPromise()

  //     // let result = await concat([productsCol, recordsCol, deletingsCol]).toPromise()

  //     // return result || []
  //   } catch (error) {
  //     this._alert.error( 'Error haciendo la consulta', error )
  //     console.error( error );
  //     return []
  //   }
  // }

  /**
   * Obtiene arqueo seleccionado
   *
   * @param {string} id ID del arqueo
   * @returns {*}
   */
  async getReport(id: string) {
    try {
      const countingRef = this.countingsCollectionRef.doc<ArqueoModel>( id )
      const countingDoc = await countingRef.ref.get()
      return countingDoc.data() || null
    } catch (error) {
      console.error(error)
      this._alert.error( 'Error intentando obtener el reporte', error )
      return
    }
  }

  /**
   * Descarga el resultado del arqueo seleccionado
   *
   * @param {string} id ID del arqueo
   * @returns {*}
   */
  async downloadReport(id:string): Promise<void> {
    try {
      const countingReportDoc = await this.countingsCollectionRef.doc(id).ref.get()
      if ( !countingReportDoc.exists ) {
        this._alert.message('No se pudo encontrar el reporte')
      } else {
        console.log( 'Report exists' )
        const counting = countingReportDoc.data()
        const endDate = counting?.endDate
        const countingStartDate = this._text.stringifyShortDate(new Date(+id))
        const reportRows: Product.DataReference[] = []

        const coutingEndDate = endDate && 'seconds' in endDate
          ? this._text.stringifyShortDate(
            new Date( endDate.seconds * 1000 ) )
          : this._text.stringifyShortDate(
            new Date()
          )

        const recordsCol = await this.countingsCollectionRef
          .doc( id ).collection<UpdateRecord>( 'updates' )
          .ref.get()

        await this._loading.asyncForEach( recordsCol.docs,
          async ( record: firebase.firestore.QueryDocumentSnapshot<UpdateRecord> ) => {
            const { productRef, state: update } = record.data()
            const product = await (await productRef.get()).data()
            let product_row: any = {}

            if ( !product ) throw { message: 'Product not found' }

            product_row['UPC'] = product.UPC
            product_row['referencia'] = product.reference
            product_row['descripción'] = product.description
            product_row['marca'] = product.brand
            product_row['unidad_medida']  = product.measure_unit
            product_row['proveedor'] = product.provider?.name || ''

            product_row[ `existencia` ] = update.stock
            product_row[ `min_requerido`] = update.min_required
            product_row['costoUnitario'] = update.unit_cost
            product_row['precioUnitario'] = update.unit_price

            product_row[ 'identificadores' ] = product.reference_codes.length > 0
              ? `${product.reference_codes.join('/')}`
              : product.reference_codes || ''
            product_row['categorias'] = product.categories.length > 0
              ? `${product.categories.join('/')}`
              : product.categories || ''
            product_row['notas'] = product.notes.length > 0
              ? `${product.notes.join('/')}`
              : product.notes || ''
            product_row['estanterias'] = update.bookshelves.length > 0
              ? `${update.bookshelves.join('/')}`
              : update.bookshelves || ''

            return reportRows.push(product_row)
          }
        )
        await this._storage.downloadList(
          reportRows,
          `Reporte de actualizaciones de productos ${ countingStartDate } - ${ coutingEndDate }` )
          .catch( error => {
            console.error( error );
            throw {message: 'No se pudo crear el reporte'}
          } )
        return
      }

    } catch (error) {
      this._alert.error(`No se pudo descargar el reporte`, error)
      return console.error(error)
    }
  }


  /**
   * Finaliza el arqueo activo actual y realiza los cambios en la base de datos principal del inventario
   *
   */
  async finalize() {
    try {
      if ( this.current ) {
        const productsPath = `businesses/${this.businessCRF}/products`
        const productsRef = this._afs.collection<Product.DataReference>(productsPath).ref
        const countingRef = this.currentRef.ref
        const updatesCol = await this.updatesRef.ref.get()
        const deletingCol = await this.deletingsRef.ref.get()

        this._batch.init(( updatesCol.size * 2 ) + ( deletingCol.size * 2)  + 1)



        /* Recorrer todos los registros de actualización y guardarlo */

        await this._loading.asyncForEach(
          updatesCol.docs, ( async (r) => {
            const {product, state: store } = r.data()
            const recordId = formatUPC( product.UPC );
            const ref = productsRef.doc( recordId )

            try {
              await this._batch.set( ref, {
                ...product,
                stock: firebase.firestore.FieldValue.increment(store.stock),
                last_update: new Date()
              }, { merge: true} )

              await this._batch.set( ref.collection( 'stores' ).doc( store.store_id ),
                { ...store }, { merge: true})


            } catch (error) {
              throw error
            }
          })
        )



        /* Recorre todos los registros de borrado y ejecuta la eliminación */

        await this._loading.waitFor(1000)
        console.log( 'Deletings' )
        await this._loading.asyncForEach(
          deletingCol.docs, ( async ( r ) => {
            let ref = productsRef.doc( r.id )
            let stores = await ref.collection( 'stores' ).get()


            try {
              await this._loading.asyncForEach( stores.docs,
                async almacen => {
                  if ( almacen.id === this.current?.id ) {
                    await this._batch.delete(almacen.ref)
                  }
              } )

              await this._batch.delete(ref)

            } catch (error) {
              throw error
            }

          })
        )

        await this._loading.waitFor(1000)
        console.log( 'finalize' )

        this._batch.update(countingRef, {
          endDate: new Date(),
          active: false,
        })


        this._alert.notify( 'Base de datos actualizada' )
        return
      }
    } catch ( error: any ) {
      if ( 'message' in error )
        this._alert.error(error.message, error, 'arqueos.service#finalize')
      else
        this._alert.error('Error al poner fin al arqueo', error)
      throw error
    }
  }

  async asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

}

