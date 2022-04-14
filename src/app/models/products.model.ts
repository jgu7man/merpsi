import { AbstractControl, FormGroup } from '@angular/forms'
import firebase from 'firebase/app'
import { uniq } from 'lodash'
import { ManagerModel } from '../modules/admin/personal/manager.model'
import { createDate, FireDoc, FireRef, FireTime } from './firestore.model'
import { MesureUnitModel } from './mesure-unit.model'
import { ProviderModel } from './provider.model'

/**
 * Clase para crear productos desde 0. 
 * @note Procurar sólo usarlo para creación de productos
 * @path businesses/{CRF}/products/{product_code}
 */
export class ProductModel {
  /** Código del producto. Se espera que pueda ser el UPC (Código Universal del Producto).*/
  public UPC: string = ''
  /** Nombre o referencia del producto */
  public reference: string
  /** (Opcional) descripcion del producto */
  public description: string
  /** Marca del producto */
  public brand?: string
  /** Unidad de medida */
  public measure_unit?: number
  /** Referencia sin caracteres especiales */
  public slug: string
  /** Códigos adicionales o necesarios para el manejo de inventarios y consultas */
  public reference_codes: string[] = []
  /** Lista de ID de categorias */
  public categories: string[] = []
  /** Notas adicionales que la empresa decida agregar al producto */
  public notes: string[] = []
  /** Rutas de imágenes del producto */
  public gallery: string[] = []
  /** Lista de claves de búsqueda */
  private search_keys: string[] = []
  /** Datos de referencia de la empresa que provee el producto */
  public provider?: Product.ProviderReference
  /** Última modificación del producto en la base de datos de la empresa */
  public last_update: ProductEventModel
  /** Referencia de firestore del producto si le pertenece a un tercero */
  public third_reference?: FireRef<ProductModel>
  
  constructor (
    product?: ProductModel | FireDoc<ProductModel>,
    /** Reference del manager creador del producto */
    manager?: FireRef<ManagerModel>,
    /** Si el proveedor existe en la DB se asignará la referencia de firestore. Si no se tiene proveedor en base de datos, se le solictará a la empresa, que lo cree en su panel en su propia lista de proveedores. NOTA: Si no se tiene el registro del proveedor, el CRF de la empresa registradora del producto, será asignada como el creador del producto */
    provider?: Product.ProviderReference
  ) {
    
    let productData = !(product instanceof ProductModel) ? product?.data() : product
    
    this.reference = productData?.reference || ''
    this.description = productData?.description || ''
    this.brand = productData?.brand || ''
    this.slug = this.createSlug( this.reference )
    /* Genera un array de códigos de referencia para que el producto pueda ser buscado */
    this.search_keys = this.getSearchKeys()
    this.categories = productData?.categories || []
    this.notes = productData?.notes || []
    this.gallery = productData?.gallery || []
    
    /* Se genera un primer evento de creación */
    const event = new ProductEventModel( product ? 'edit' : 'create' , manager )
    this.last_update = {...event}
    /* Genera un slug basado en la referencia (nombre del producto)
    TODO: Realizar un método que pueda actualizar el slug, 
    este no debe ser editable tan fácil
    */
  }

  /** Crea un texto con guiones a partir del texto proveído */
  private createSlug( text: string ): string {
    return text.toLowerCase()
    .replace(/\//g, '-')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/@/g, '-')
    .replace( /\s/g, '_' );
  }

  /** Toma los códigos de esta clase y los convierte en strings consultables desde firestore */
  private getSearchKeys(): string[] {
    let reference_codes = [
      this.UPC,
      this.slug,
      ...this.reference_codes,
      ...this.reference.toLowerCase().split( ' ' ),
      this.reference.toLowerCase()
    ].filter( i => i || i !== undefined )
    return uniq(reference_codes)
  }

  public measure_unit_ref?: FireDoc<MesureUnitModel> 

  /* TODO Crear en el formulario un "switch" o "checkbox" que valide al usuario si la empresa es la creadora del producto */
}


/**
 * Clase para crear un evento del historial del producto
 *
 * @path businesses/{CRF}/products/{product_code}/history/{event.id}
 */
export class ProductEventModel {
  /**
   * Fecha momento en que se realizó el evento
   */
  public date: FireTime

  constructor (
    /** El tipo de evento que se está registrando */
    public type: Product.history.UpdateType,
    /** Referencia de manager que realiza el evento */
    public manager?: firebase.firestore.DocumentReference,
  ) {
    this.date = createDate(new Date())
    
  }

}





/** Segmento de interfaces del producto */
export declare namespace Product {
  
  /**
   * Clase principal para la consulta y renderizado de productos de la base de datos
   *
   * @path businesses/{CRF}/products/{product_code}
   */
  interface DataReference
    extends Omit<ProductModel,
    | 'getReferenceCodes'
    | 'createSlug'
    >{ }
  
  /**
   * Modelo de datos principales del concepto
   *
   * @interface MainData
   */
  interface MainData {  
    UPC: string,
    reference: string,
    description: string,
    brand?: string,
    measure_unit: number,
    document_ref?: FireRef<ProductModel>
  }
  
  /**
   * Interfaz de proveedor de un producto
   *
   * @interface ProviderReference
   */
  interface ProviderReference {
    reference?: FireRef<ProviderModel>
    CRF: string,
    name: string,
  }

  /**
   * Modelo de objeto para la referencia de un producto en una store
   * 
   * @path businesses/{CRF}/products/{product_code}/store/{store.id}
   */
  interface StoreReference  {
    /** ID del almacen como llave foranea */
    store_id: string
    /** ID del producto como llave foranea */
    UPC: string,
    /** Existencias del producto en el almacen */
    stock: number,
    /** Precio unitario designado para su venta */
    unit_price: number,
    /** Costo unitario establecido por la factura de comprado */
    readonly unit_cost: number,
    /** Mínimo requerido */
    min_required: number,
    /** (Opcional) Estanterías o notas de referencia donde se encuentra la existencia del producto */
    bookshelves: string[],
    /** (Opcional) Referencia al documento del proveedor de este producto en esta store de la lista de proveedores de la misma empresa. */
    provider?: ProviderReference,
  }

  /**
   * Modelo de la consulta de un producto y sus múltiples existencias en los stores
   */
  interface StockReference {
    product: Partial<DataReference>,
    stores: StoreReference[]
  }

  /**
   * Modelo de la consulta de un producto y su último cambio en una store
   */
  interface UpdateReference {
    product: ProductModel,
    lastStoreState?: StoreReference
  }

  /**
   * Modelo del formulario de un producto
   */
  interface Form extends FormGroup {
    value: DataReference | ProductModel
    controls: {
      product_code: AbstractControl
      reference: AbstractControl
      description: AbstractControl
      brand: AbstractControl
      mesure_unit: AbstractControl
      third_reference: AbstractControl
      categories: AbstractControl
      notes: AbstractControl
      reference_codes: AbstractControl
    }
  }


  


  namespace StoreReference {
    interface StoreForm extends FormGroup {
      value: StoreReference
      controls: {
        store_id: AbstractControl,
        product_code: AbstractControl,
        stock: AbstractControl,
        unit_price: AbstractControl,
        unit_cost: AbstractControl,
        min_required: AbstractControl,
        bookshelves: AbstractControl,
        provider: AbstractControl,
      }
    }
  }

  
  /** Segemento de modelos para eventos del producto*/
  namespace history {

    /** Tipo de evento de un producto */
    type UpdateType = 'sale' | 'purchase' | 'edit' | 'create' | 'balancing'
    
    
  }
}



/** Modelo de agregado de productos a la factura de compra/venta */
// export class  ProductInvoiceModel implements Product.MainData {
//   /** Costo unitario del producto comprado*/
//   public unit_cost: number = 0
//   /** Cantidad de productos comprados */
//   public cant: number = 0
//   /** Resultado de multiplicar cantidad por costo unitario del producto */
//   public amount: number;
//   UPC: string
//   reference: string
//   description: string
//   brand?: string
//   measure_unit: string
//   document_ref?: FireRef<ProductModel>

//   constructor (
//     /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
//     concept: firebase.firestore.DocumentSnapshot<ProductModel>
//   ) {

//     let data = concept.data()!

// 		this.amount = this.unit_cost * this.cant;
//     this.UPC = data.UPC
//     this.reference = data.reference
//     this.description = data.description
//     this.brand = data.brand
//     this.measure_unit = data.measure_unit
//     this.document_ref = concept.ref
// 	}
//}
// export declare namespace ProductModel.history {
// }