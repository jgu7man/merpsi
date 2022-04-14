import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductModel } from 'src/app/modules/inventory/products/products.model';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import firebase from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class InventoryProductsService {

  businessCRF: string = this._cache.getDataKey('eid')!

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
   * @param {Partial<Product.DataReference>} product
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
   * @param {Partial<Product.DataReference>} product
   * @returns {void}  {Promise<void>}
   */
  async set(product: Partial<Product.DataReference>): Promise<void>{
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
  async searchByIdentifier( query: string ): Promise<Product.DataReference[]> {
    try {
      const result: Product.DataReference[] = []
      const queryCol = await this.businessRef
        .collection<Product.DataReference>( 'products' ).ref
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
   * @param {Product.StoreReference} { pid, sid, bookshelves, min_required }
   * @returns {*}  {Promise<void>}
   */
  async patchStoreRef(
    { UPC: product_code, store_id, bookshelves, min_required }: Product.StoreReference
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

  /**
   *funcion que se encarga de buscar un producto registrado en la empresa ((proveedor)) mediante un codigo (pid, code o reference ) 
   *
   * @param {string} code
   * @return {*} 
   * @memberof InventoryProductsService
   */
  async findProductProvider(code: string) {
    return  this._afs.collectionGroup<Product.DataReference>('products',  ref => 
    ref.where('reference_codes', 'array-contains', code)).get().pipe(
          map(list=> {
            if (list.docs.length > 0) {
              let productResult = list.docs[0].data()
              let producto: Product.DataReference = {
                ...productResult
              }
              return producto
            }else return null
          })
        )
  }


  /**
   *
   * funcion que se encarga de buscar un producto registrado en la empresa mediante un codigo (pid, code o reference ) 
   *
   * @param {string} code
   * @return {*} 
   * @memberof InventoryProductsService
   */
  async findProductBusiness(code: string) {
    try {
      const productResult = await this._afs.collection<Product.DataReference>(`businesses/${this.businessCRF}/products`).ref
        .where('references_codes', 'array-contains', code).get()

      let productDocument = productResult?.docs.length > 0 ? productResult.docs[0] : null

      if (productDocument != null) {
        let product = productDocument.data()
        this._alert.message('Se ha encontrado este producto' +
          + product.reference + '-' + product.description +
          ' deseas agregarlo?', 'text', 'request')
          .then(response => {
            if (response.isDenied) {
              productDocument = null
            }
          })
      } else {
        this._alert.message('No se ha encontrado este producto, deseas crearlo?')
        //TODO abrir formulario basico de productos

      }
      return productDocument
    } catch (error) {
      this._alert.error('Error haciendo la busqueda de productos', error)
      console.error(error);
      return null
    }
  }
}
