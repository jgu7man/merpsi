import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from 'src/app/models/products.model';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductsService {

  constructor (
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
    private _text: MxText
  ) {
    // this.updateAlmacenes()
  }

  /** Consulta en sessionStorage el ID de la empresa en la cuál se está presente */
  get CRF() {
    const CRF = this._cache.getDataKey( 'eid' )
    if ( CRF === undefined ) throw { message: 'No se encuentró el ID de la empresa' }
    return CRF
  }

  /** Crea la referencia a firestore para la empresa en la cuál se está presente */
  get businessRef() {
    return this._afs.doc(`businesess/${this.CRF}`)
  }

  /**
   * Crea un producto
   *
   * @param {Partial<ProductModel.DataReference>} product
   * @returns {void}  {Promise<void>}
   */
  async create(product: ProductModel): Promise<void>{
    try {
      
      const pid = this._text.slugify(product.UPC)
      await this.businessRef
        .collection( 'products' )
        .doc( pid ).ref
        .set( { ...product }, { merge: true } )
      
      this._alert.notify( 'Producto guardado' )
      return
    } catch ( error: any ) {
      this._alert.error('No se logró crear el producto', error)
      console.error( error );
      return
    }
  }
  
  /**
   * Actualiza un producto
   *
   * @param {Partial<ProductModel.DataReference>} product
   * @returns {void}  {Promise<void>}
   */
  async set(product: Partial<ProductModel.DataReference>): Promise<void>{
    try {
      
      await this.businessRef
        .collection( 'products' )
        .doc( product.UPC ).ref
        .set( { ...product }, { merge: true } )
      
      this._alert.notify( 'Producto guardado' )
      return
    } catch ( error: any ) {
      this._alert.error('No se logró guardar el producto', error)
      console.error( error );
      return
    }
  }


  /**
   * Busca productos por los códigos identificadores
   *
   * @param {string} query
   * @returns {*}  {Promise<iProduct[]>}
   */
  async searchByIdentifier( query: string ): Promise<ProductModel.DataReference[]> {
    try {
      const result: ProductModel.DataReference[] = []
      const queryCol = await this.businessRef
        .collection<ProductModel.DataReference>( 'products' ).ref
        .where( 'reference_codes', 'array-contains', query )
        .get()

      if ( !queryCol.empty ) {
        queryCol.forEach( doc => result.push( doc.data() ))
      }

      return result
    } catch (error) {
      this._alert.error( 'Error haciendo la consulta de productos', error )
      console.error( error );
      return []
    }
  }

  

  /**
   * Actualiza campos editables desde la vista de productos.
   * @note Actualizar las existencias, sólo es posible por ventas, compras o arqueos
   *
   * @param {ProductModel.StoreReference} { pid, sid, bookshelves, min_required }
   * @returns {*}  {Promise<void>}
   */
  async patchStoreRef(
    { UPC: product_code, store_id, bookshelves, min_required }: ProductModel.StoreReference
  ): Promise<void>{
    try {
      const productId =  this._text.slugify(product_code)
      this.businessRef
        .collection( `products/${ productId }/stores/${ store_id }` )
        .doc( store_id )
        .update( { bookshelves, min_required } )
      return

    } catch (error) {
      console.error(error);
      this._alert.error( 'Error al actualizar el producto', error )
      return
    }

  }

  /**
   * Elimina un producto
   *
   * @param {string} product_code
   * @returns {*}  {Promise<void>}
   */
  async delete( product_code: string ): Promise<void> {
    const productId = this._text.slugify( product_code )
    try {
      await this._afs.collection( 'productos' ).doc( productId )
        .delete()
      this._alert.notify( 'Producto eliminado' )
      return
    } catch (error) {
      this._alert.error( 'No se pudo eliminar el producto', error )
      return console.error(error);
    }
  }

}
