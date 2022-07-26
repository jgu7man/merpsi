import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Product, ProductModel } from 'src/app/modules/inventory/products/products.model';
import { MxAlert } from 'libs/@marxa/devkit/alert-v2/alert.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { MxText } from 'libs/@marxa/devkit/text/mx-text.service';
import { DatabasePathsService } from 'src/app/services/database-paths.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductsService {

  businessCRF: string = this._cache.getDataKey('eid')!

  constructor (
    private _afs: AngularFirestore,
    private _cache: MxCache,
    private _alert: MxAlert,
    private _text: MxText,
    private _path: DatabasePathsService
  ) {
    // this.updateAlmacenes()
  }

  /** Consulta en sessionStorage el ID de la empresa en la cuál se está presente */
  get CRF() {
    const CRF = this._cache.getDataKey( 'eid' )
    if ( CRF === undefined ) throw { message: 'No se encuentró el ID de la empresa' }
    return CRF
  }

  get productsRef() {
    return this._afs.collection<Product.DataReference>( this._path.productsRef )
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
      await this.productsRef
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

      await this.productsRef
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
      const queryCol = await this.productsRef.ref
        .where( 'keywords', 'array-contains', query )
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

  // retriveStoresRef( UPC: string ) {
  //   const productId =  formatUPC(UPC);
  //   return this.businessRef.collection
  //     <StoreReferenceModel>( `products/${ productId }/stores` )
  //     .valueChanges().pipe(
  //       catchError( ( error ) => {
  //         this._alert.error( 'No se pudo tener contacto con la base de datos', error, 'productos.service#retriveAlamacenesRef' )
  //         return of<StoreReferenceModel[]>([])
  //       })
  //     )

  // }


  /**
   *funcion que se encarga de buscar un producto registrado en la empresa ((proveedor)) mediante un codigo (pid, code o reference )
   *
   * @param {string} code
   * @return {*}
   * @memberof InventoryProductsService
   */
  async findProductProvider(code: string) {
    return this._afs.collectionGroup<Product.DataReference>( 'products',
      ref =>  ref.where( 'keywords', 'array-contains', code ) )
      .get().pipe(
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
   * Función que se encarga de buscar un producto registrado en la empresa mediante un codigo (pid, code o reference )
   *
   * @param {string} code
   * @return {*}
   * @memberof InventoryProductsService
   */
  async findProductBusiness(code: string) {
    try {
      const productResult = await this.productsRef.ref
        .where('keywords', 'array-contains', code).get()

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
