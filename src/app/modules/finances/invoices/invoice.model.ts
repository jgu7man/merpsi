import firebase from "firebase"
import { FireTime, createDate, FireRef, FireDoc } from "../../../models/firestore.model"
import { Product, ProductModel } from "../../inventory/products/products.model"
import { TaxModel } from "../taxes/taxes.model"
import { iSede } from "../../admin/stores/sede.model"

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
  taxes: TaxModel[];
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
  measure_unit: number
  brand?: string
  public store?: FireRef<iSede> | ''
  

  constructor (
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    concept?: ProductModel
  ) {

    let data = concept

		this.amount = this.unit_cost * this.cant;
    this.UPC = data?.UPC || ''
    this.reference = data?.reference || ''
    this.description = data?.description || ''
    this.brand = data?.brand || ''
    this.measure_unit = data?.measure_unit || 0
	}
}

// export const productEmpty: ProductInvoiceModel = {
//   unit_cost : 0,
//   cant : 0, 
//   amount : 0, 
//   UPC : '',
//   reference : '' ,
//   description : '' ,
//   brand : '' ,
//   measure_unit : '' ,
//   //document_ref : '' 
// }

