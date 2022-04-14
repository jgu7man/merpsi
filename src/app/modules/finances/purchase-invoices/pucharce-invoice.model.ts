import firebase from "firebase/app";
import { FireTime, createDate } from "../../../models/firestore.model";
import { InvoiceModel, InvoiceStore, ProductInvoiceModel } from "../invoices/invoice.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel extends InvoiceModel{
  /** Fecha de la compra */
  public purshase_date: FireTime =  createDate(new Date());
  
  
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
    super(invoice)
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


/** Modelo de consulta de una factura de compra  */
export interface iInvoice extends Omit<PurchaseInvoiceModel, "purshase_date"> {
	purshase_date: firebase.firestore.Timestamp;
}

/** Modelo de agregado de productos a la factura de compra */

interface iProductPurchased extends ProductInvoiceModel {}

interface iPurchaseInvoice extends PurchaseInvoiceModel {}


