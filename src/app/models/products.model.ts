import firebase from 'firebase/app'
import { iTax } from './taxes.model'

export class ProductModel {

  /** Última modificación del producto en la base de datos de la empresa */
  public last_update: Date
  /** Referencia sin caracteres especiales */
  public slug: string
  /** Descripcion del producto */
  public description: string
  
  constructor (
    public reference: string,
    /** Unidad de medida */
    public measure_unit: string,
    /** Marca del producto */
    public brand: string,
    /** CRF de la empresa que crea el producto */
    public owner: string,
    /** Si el proveedor existe en la DB se asignará la referencia de firestore. Si no se tiene proveedor en base de datos, se le solictará a la empresa, que lo cree en su panel en su propia lista de proveedores. NOTA: Si no se tiene el registro del proveedor, el CRF de la empresa registradora del producto, será asignada como el creador del producto */
    public provider?: string | firebase.firestore.DocumentReference,
    /** (Opcional) descripcion del producto */
    description?: string, 
  ) {
    this.provider = this.provider || owner
    this.slug = this.createSlug(reference)
    this.description = description || ''
    this.last_update = new Date()
  }

  createSlug( text: string ): string {
    return text.toLowerCase()
    .replace(/\//g, '-')
    .replace(/\./g, '')
    .replace(/,/g, '')
    .replace(/@/g, '-')
    .replace( /\s/g, '_' );
  }

  /* TODO Crear en el formulario un "switch" o "checkbox" que valide al usuario si la empresa es la creadora del producto */
}

export interface iProduct extends Omit<ProductModel, 'last_update'> {
  /** ID del producto */
  readonly pid: string,
  /** Lista de ID de categorias */
  categories?: string[],
  /** Códigos adicionales o necesarios para el manejo de inventarios y consultas */
  codes?: string[],
  /** Notas adicionales que la empresa decida agregar al producto */
  notes?: string[],
  /** Última modificación del producto en la base de datos de la empresa */
  last_update: firebase.firestore.Timestamp
}