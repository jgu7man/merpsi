import firebase from "firebase/app"
import { getCacheDataKey } from "libs/@marxa/devkit/cache/mx-cache.operators";
import { createDate, FireRef, FireTime } from "src/app/models/firestore.model";
import { CreditNoteModel, iCreditNote } from "../credit-note/creditNote.model";
import { Invoice, InvoiceModel, ProductInvoiceModel } from '../invoices/invoice.model';

export class SalesInvoiceModel implements InvoiceModel {
  public action_date: FireTime = createDate( new Date());
  public registered_date: FireTime = createDate( new Date());
  public details: Invoice.concept[]

  constructor(
    public invoiceId: string,
    public client: Invoice.client,
    public seller: string,
    public currency: string,
    public payment_method: string,
    public manager: Invoice.manager,
    concepts: ProductInvoiceModel[],
    public footer: Invoice.footer,

  ){
    this.invoiceId = invoiceId,
    this.client = client,
    this.seller = seller,
    this.details = concepts.map(det =>{
      return det.getdata()
    }),
    this.footer= footer,
    this.manager= manager,
    this.payment_method = payment_method,
    this.currency = currency
  }


}
export interface iSalesInvoice extends SalesInvoiceModel { }


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

export class SalesInvoiceReadingModel implements iSalesInvoice {

  public action_date: FireTime = createDate( new Date());
  public registered_date: FireTime = createDate( new Date());
  public details: Invoice.concept[]
  public invoiceId: string
  public client: Invoice.client
  public seller: string
  public currency: string
  public payment_method: string
  public manager: Invoice.manager
  public footer: Invoice.footer

  related_documents: iCreditNote[] = []
  private CRF = getCacheDataKey('eid')

  constructor (
    data: iSalesInvoice
  ) {
    this.details = data.details
    this.invoiceId = data.invoiceId
    this.client = data.client
    this.seller = data.seller
    this.currency = data.currency
    this.payment_method = data.payment_method
    this.manager = data.manager
    this.footer = data.footer
    this.getRelatedDocuments(this.invoiceId)
  }

  private getRelatedDocuments(id: string) {
    try {

      firebase.firestore().collection( `businesses/${this.CRF}/credit-notes` )
        .where( 'invoiceId', '==', id )
        .get().then( snapshot => {
          snapshot.forEach( doc => {
            this.related_documents.push( doc.data() as iCreditNote )
          })
        } )

    } catch (error: any) {
      console.log(error)

    }
  }

  get status() {
    if ( this.related_documents.length < 1 ) return ''
    else {

    }
  }

}
