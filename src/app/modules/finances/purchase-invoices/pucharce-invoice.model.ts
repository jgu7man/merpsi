import firebase from "firebase/app";
import { FireTime, createDate } from "../../../models/firestore.model";
import { iSede } from "../../admin/stores/sede.model";
import { iProvider } from "../../inventory/providers/provider.model";
import { Invoice, InvoiceModel, ProductInvoiceModel } from "../invoices/invoice.model";


/** Modelo para crear una factura de compra */
export class PurchaseInvoiceModel implements InvoiceModel {
  
  registered_date: firebase.firestore.Timestamp = createDate(new Date())
  invoiceId: string;
  action_date: firebase.firestore.Timestamp;
  provider: Invoice.provider
  store: iSede;
  details: Invoice.concept[];
  footer: Invoice.footer;
  payment_method: string ;
  currency: string ;
  manager: Invoice.manager

  constructor (
  invoiceId: string,
  action_date: Date,
  provider:  Invoice.provider,
  store: iSede,
  concepts: ProductInvoiceModel[],
  footer: Invoice.footer,
  payment_method: string = '',
  currency: string = '',
  manager: Invoice.manager
  ) {
    this.invoiceId = invoiceId;
    this.action_date = createDate(action_date);
    this.provider = provider;
    this.store = store;
    this.payment_method= payment_method || '';
    this.currency = currency || '';
    this.details = concepts.map(d => {
      return d.getdata()
  })
    this.footer = footer;
    this.manager = manager;
  }

}

export interface iPurchaseInvoice extends PurchaseInvoiceModel{

}



