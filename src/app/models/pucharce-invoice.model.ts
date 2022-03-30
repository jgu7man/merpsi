import firebase from "firebase/app";
import { FireTime } from "./firestore.model";
import { Product, ProductModel } from "./products.model";
import { iTax } from "./taxes.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel {
  /** Folio de la factura (Generado por el proveedor) */
  public invoice_ID: string = ''
  /** Fecha de la compra */
  public purshase_date: Date = new Date()
  
  /** Proveedor de la factura: CRF o referencia de firestore */
  public provider: InvoiceProvider = {
    CRF: '',
    businessName: '',
  }
  /** ID de la Sede a la que se agregará la compra */
  public store: InvoiceStore = {
    id: '',
    name: '',
  }
  
  /** Productos comprados */
  public details: iProductPurchased[] = []

  /** Método de pago */
  public payment_method: string = ''
  /** Balances y cálculos ya procesados */
  public footer: iInvoiceFooter
  

  /** UID del Manager que está agregando la compra */
  public readonly manager: string = ''
  /** Momento de registro de la factura */
  public readonly registered_date: FireTime;

  constructor (
    invoice?: PurchaseInvoiceModel
	) {
		this.registered_date = firebase.firestore.Timestamp.fromDate( new Date() );
    this.footer = {
      subtotal: 0,
      discount: 0,
      taxes: [],
      shipping: 0,
      total: 0,
    }
  }
  
  
}

export interface InvoiceProvider {
  CRF: string,
  businessName: string,
}

export interface InvoiceStore {
  id: string,
  name: string,
}



/** Modelo de consulta de una factura de compra  */
export interface iInvoice extends Omit<PurchaseInvoiceModel, "purshase_date"> {
	purshase_date: firebase.firestore.Timestamp;
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

/** Modelo de agregado de productos a la factura de compra */
export class ProductPurchasedModel implements Product.MainData {
  /** Costo unitario del producto comprado*/
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant: number = 0
  /** Resultado de multiplicar cantidad por costo unitario del producto */
  public amount: number;
  UPC: string
  reference: string
  description: string
  brand: string
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


interface iProductPurchased extends ProductPurchasedModel {}

interface iPurchaseInvoice extends PurchaseInvoiceModel {}
