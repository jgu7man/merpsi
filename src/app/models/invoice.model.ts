import firebase from "firebase"
import { FireTime, createDate } from "./firestore.model"
import { Product, ProductModel } from "./products.model"
import { iTax } from "./taxes.model"

export class InvoiceModel {
  /**folio de la factura */
  public invoice_ID: string = ''
  /** fecha de la factura */
  public document_date: FireTime = createDate(new Date())
  /** metodos de pagos */
  public payment_method: string = ''

/** calculos de totales de la factura */
  public footer: iInvoiceFooter
  /** personal que registro la factura */
  public readonly manager: string = ''
  /**fecha de registro */
  public readonly registered_date: FireTime = createDate( new Date() )
  
  public details: ProductInvoiceModel[] = [] ;
  // public footer: iInvoiceFooter;
  constructor (
    invoice?: InvoiceModel
	) {
    this.footer = {
      subtotal: 0,
      discount: 0,
      taxes: [],
      shipping: 0,
      total: 0,
    }
  }
  
  
}
/** Modelo de consulta de balances de factura */
export interface iInvoiceFooter {
  /** Suma de los montos de los productos */
  subtotal: number;
  /** Descuento aplicado a la compra en moneda */
  discount: number;
  /** Lista de impuestos aplicados a la compra */
  taxes: iTax[];
  /** Costo generado por envío */
  shipping: number;
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
	total: number;
}
export interface InvoiceStore {
  id: string,
  name: string,
}

export class ProductInvoiceModel implements Product.MainData {
  /** Costo unitario del producto comprado*/
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant: number = 0
  /** Resultado de multiplicar cantidad por costo unitario del producto */
  public amount: number;
  UPC: string
  reference: string
  description: string
  brand?: string
  measure_unit: string
  document_ref?: firebase.firestore.DocumentReference
  

  constructor (
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    concept: firebase.firestore.DocumentSnapshot<ProductModel>
  ) {

    let data = concept.data()!

		this.amount = this.unit_cost * this.cant;
    this.UPC = data.UPC
    this.reference = data.reference
    this.description = data.description
    this.brand = data.brand
    this.measure_unit = data.measure_unit
    this.document_ref = concept.ref
	}
}

