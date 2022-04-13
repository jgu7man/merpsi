import { ProductModel } from './products.model'
import firebase from "firebase/app"
import { FireDoc, FireRef } from './firestore.model';
import { ClientModel } from './clients.model';
import { InvoiceModel, ProductInvoiceModel } from './invoice.model';
import { iSede } from './sede.model';

export class SalesInvoiceModel extends InvoiceModel {
  public client: FireDoc<ClientModel> | ''
  public seller: string | ''
  public date_expiration : firebase.firestore.Timestamp | ''
  public currency: string | ''
  constructor (
    salesI?:SalesInvoiceModel
  ) {
    super(salesI)
    this.client = salesI?.client || ''
    this.seller = salesI?.seller || ''
    this.date_expiration = salesI?.date_expiration || ''
    this.currency = salesI?.currency || ''
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
