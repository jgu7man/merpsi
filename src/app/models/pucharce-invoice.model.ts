import firebase from "firebase/app";
import { iInvoiceFooter, InvoiceModel, InvoiceStore } from "./invoice.model";
import { ProductInvoiceModel } from "./products.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel implements InvoiceModel{
  /** Fecha de la compra */
  public purshase_date: Date = new Date()
  
  /** Proveedor de la factura: CRF o referencia de firestore */
  public provider: InvoiceProvider = {
    CRF: '',
    businessName: '',
  }
  public store: InvoiceStore = {
    id: '',
    name: '',
  }
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
  public invoice_ID?: string ;
  public document_date?: Date ;
  public details?: ProductInvoiceModel[] ;
  public payment_method?: string ;
  public footer?: iInvoiceFooter ;
  public manager?: string ;
  public registered_date: Date | firebase.firestore.Timestamp;
  
  
}

export interface InvoiceProvider {
  CRF: string,
  businessName: string,
}


/** Modelo de consulta de una factura de compra  */
export interface iInvoice extends Omit<PurchaseInvoiceModel, "purshase_date"> {
	purshase_date: firebase.firestore.Timestamp;
}

/** Modelo de agregado de productos a la factura de compra */

interface iProductPurchased extends ProductInvoiceModel {}

interface iPurchaseInvoice extends PurchaseInvoiceModel {}


