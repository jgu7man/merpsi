import { FireTime, createDate, FireRef } from "../../../models/firestore.model"
import { Product, ProductModel } from "../../inventory/products/products.model"
import { iSede } from "../../admin/stores/sede.model"
import { AppliedTaxModel, iAppliedTax } from "../taxes/taxes.model"

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
  public  manager: string = ''
  /**fecha de registro */
  public readonly registered_date: FireTime = createDate( new Date() )
  
  public details: iProductInvoice[] = [] ;
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
export class invoiceFooter {
  /** Suma de los montos de los productos */
  subtotal: number;
  /** Descuento aplicado a la compra en moneda */
  discount: number;
  /** Lista de impuestos aplicados a la compra */
  taxes: iAppliedTax[];
  /** Costo generado por envío */
  shipping: number;
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
	total: number;

  constructor(
    subtotal?:number,
    discount?:number,
    taxes?:[],
    shipping?: number
  )
  {
    this.subtotal = subtotal || 0
    this.discount = discount || 0
    this.taxes = taxes || []
    this.shipping = shipping || 0
    this.total = (this.subtotal + this.shipping) - this.discount;

  }
  get data(){
    let { data, ...object} = this
    return {...object}
  }
}
export interface iInvoiceFooter extends Omit<invoiceFooter,'data'>{}

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
  public store: string
  UPC: string
  reference: string
  description: string
  measure_unit: number
  brand?: string
  stock: number
  

  constructor (
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    concept?: ProductModel,
    storeRef?: string,
    stock?:number,
  ) {

    let data = concept

		this.amount = this.unit_cost * this.cant;
    this.UPC = data?.UPC || ''
    this.reference = data?.reference || ''
    this.description = data?.description || ''
    this.brand = data?.brand || ''
    this.measure_unit = data?.measure_unit || 0
    this.store = storeRef || ''
    this.stock = stock || 0
	}
  get data(){
    let { data, ...object} = this
    return {...object}
  }
}

export interface iProductInvoice extends Omit<ProductInvoiceModel,'data'>{}

