import { AbstractControl, FormGroup } from '@angular/forms'
import firebase from 'firebase/app'
import { uniq } from 'lodash'
import { iTax } from './taxes.model'

export class ProductModel {
  /** Código del producto. Se espera que pueda ser el UPC (Código Universal del Producto).*/
  public readonly product_code: string
  /** Última modificación del producto en la base de datos de la empresa */
  public last_update: ProductUpdate
  /** Referencia sin caracteres especiales */
  public slug: string
  /** Códigos adicionales o necesarios para el manejo de inventarios y consultas */
  public readonly reference_codes: string[] = []
  
  constructor (
    /** Código del producto. Se espera que pueda ser el UPC (Código Universal del Producto).*/
    product_code: string,
    /** Nombre o referencia del producto */
    public reference: string,
    /** (Opcional) descripcion del producto */
    public description: string, 
    /** Marca del producto */
    public brand: string,
    /** Unidad de medida */
    public measure_unit: string,
    /** CRF de la empresa que crea el producto */
    public owner?: string,
    /** Reference del manager creador del producto */
    manager?: firebase.firestore.DocumentReference,
    /** Si el proveedor existe en la DB se asignará la referencia de firestore. Si no se tiene proveedor en base de datos, se le solictará a la empresa, que lo cree en su panel en su propia lista de proveedores. NOTA: Si no se tiene el registro del proveedor, el CRF de la empresa registradora del producto, será asignada como el creador del producto */
    // public provider?: string | firebase.firestore.DocumentReference,
    /** Referencia de firestore del producto si le pertenece a un tercero */
    public third_reference?: firebase.firestore.DocumentReference,
  ) {
    this.product_code = product_code;
    // this.provider = this.provider || owner
    this.slug = this.createSlug(reference)
    this.description = description || ''
    this.reference_codes = this.getReferenceCodes()

    this.last_update = new ProductUpdate(
      'create', manager
    )
  }

  private createSlug( text: string ): string {
    return text.toLowerCase()
    .replace(/\//g, '-')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/@/g, '-')
    .replace( /\s/g, '_' );
  }

  private getReferenceCodes(): string[] {
    let reference_codes = [
      this.product_code,
      this.slug,
      ...this.reference_codes,
      ...this.reference.toLowerCase().split( ' ' ),
      this.reference.toLowerCase()
    ].filter( i => i || i !== undefined )
    return uniq(reference_codes)
  }

  /* TODO Crear en el formulario un "switch" o "checkbox" que valide al usuario si la empresa es la creadora del producto */
}




export class ProductUpdate {
  public date: Date
  constructor (
    public type: ProductModel.history.UpdateType,
    public manager?: firebase.firestore.DocumentReference,
  ) {
    this.date = new Date()
  }
}

export declare namespace ProductModel.history {
  type UpdateType = 'sale' | 'purchase' | 'edit' | 'create' | 'balancing'

  interface Event extends Omit<ProductUpdate, 'date'> {
    date: firebase.firestore.Timestamp
  }
}

export declare namespace ProductModel {
  export interface DataReference extends Omit<ProductModel, 'last_update'> {
    /** Última modificación del producto en la base de datos de la empresa */
    last_update: ProductModel.history.Event
    /** Lista de ID de categorias */
    categories: string[],
    /** Notas adicionales que la empresa decida agregar al producto */
    notes: string[],
    /** Rutas de imágenes del producto */
    gallery: string[]
  }

  interface StoreReference  {
    /** ID del almacen como llave foranea */
    store_id: string
    /** ID del producto como llave foranea */
    product_code: string,
    /** Existencias del producto en el almacen */
    stock: number,
    /** Precio unitario designado para su venta  */
    unit_price: number,
    /** Costo unitario establecido por la factura de comprado */
    unit_cost: number,
    /** Mínimo requerido */
    min_required: number,
    /** (Opcional) Estanterías o notas de referencia donde se encuentra la existencia del producto */
    bookshelves: string[],
    /** (Opcional) Referencia al documento del proveedor de este producto en esta store de la lista de proveedores de la misma empresa. */
    provider?: firebase.firestore.DocumentReference,
  }

  interface StockReference {
    product: Partial<DataReference>,
    stores: StoreReference[]
  }

  interface UpdateReference {
    product: ProductModel,
    lastStoreState?: StoreReference
  }

  interface Form extends FormGroup {
    value: DataReference | ProductModel
    controls: {
      product_code: AbstractControl
      reference: AbstractControl
      description: AbstractControl
      brand: AbstractControl
      mesure_unit: AbstractControl
      // owner: AbstractControl
      // provider: AbstractControl
      third_reference: AbstractControl
      categories: AbstractControl
      notes: AbstractControl
      reference_codes: AbstractControl
    }
  }
}
