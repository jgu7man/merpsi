import firebase from "firebase/app"
import { FireRef } from "src/app/models/firestore.model";
import { InvoiceModel, ProductInvoiceModel } from '../invoices/invoice.model';

export class SalesInvoiceModel extends InvoiceModel {
  public client : ClientInvoice= { 
    cip: '',
    name: '',
    email: ''
  }
  public seller: string | ''
  public date_expiration : firebase.firestore.Timestamp | ''
  public currency: string | ''
  constructor (
    salesI?:SalesInvoiceModel
  ) {
    super(salesI)
    this.seller = salesI?.seller || ''
    this.date_expiration = salesI?.date_expiration || ''
    this.currency = salesI?.currency || ''
    this.footer = {
      subtotal: 0,
      discount: 0,
      taxes: [],
      totalTaxes: 0,
      shipping: 0,
      total: 0,
    }
  }
    
}
export interface iInvoice extends SalesInvoiceModel { }


export interface iFacturaDatos {
  fecha: Date | firebase.firestore.Timestamp,
  doc_externo: string,
  proveedor: string,
  sede: string,
  forma_pago: string,
  concepto: string,
  comprador: string,
  cantidades: number,
  subtotal: number,
  descuento: number,
  iva: number,
  total: number,
}

export interface iProductSales extends ProductInvoiceModel {}

export interface ClientInvoice{
  cip: '',
  name: '',
  email: '',
}

export declare namespace Sales{
  interface invoice{
    id: string
    ref: FireRef<SalesInvoiceModel>
  }
}