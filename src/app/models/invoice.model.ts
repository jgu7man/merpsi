import * as firebase from "firebase"
import { FireTime } from "./firestore.model"
import { ProductPurchasedModel } from "./pucharce-invoice.model"
import { iTax } from "./taxes.model"

export class InvoiceModel {
  public invoice_ID?: string = ''
  public document_date?: Date = new Date()
  public store?: InvoiceStore = {
    id: '',
    name: '',
  }
  public details?: ProductPurchasedModel[] = []
  public payment_method?: string = ''
  public footer?: iInvoiceFooter
  public readonly manager?: string = ''
  public readonly registered_date: FireTime | Date
  constructor (
    invoice?: InvoiceModel
	) {
		this.registered_date = new Date()
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