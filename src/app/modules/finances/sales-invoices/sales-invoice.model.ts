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

export declare namespace SaleInvoice {
  export type status =
    | 'current' // factura sin cambios
    | 'decreased' // factura con descuento
    | 'refunded' // factura con devolucion
    | 'canceled' // factura anulada
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


  /**
   * Documentos relacionados con esta factura
   * - CreditNotes
   *
   * @type {iCreditNote[]}
   */
  related_documents: iCreditNote[] = []


  /* NOTE - No sé si esto va a funcionar a la hora del compilado.
  Si esto no es posible habrá que meter el CRF al constructor,
  Obtner el dato con MxCache desde el método de consulta de la
  colección de facturas. */
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


  /**
   * Obtiene la lista de los documentos relacionados con
   * la factura, desde la base de datos
   *
   * @private
   * @param {string} id
   */
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


  /**
   * Obtiene el valor total de los documentos relacionados
   * y lo resta al valor original de la factura, para obtener
   * la cantidad disponible para disminución
   *
   * @readonly
   * @type {number}
   */
  get avalibleAmount(): number {
    let related_documents_total = this.related_documents
      .reduce( ( acc, cur ) => {
      return acc + cur.footer.total
      }, 0 )
    return this.footer.total - related_documents_total
  }

  /**
   * Obtiene la cantidad total de productos en los documentos
   * relacionados y lo resta al valor original de la factura,
   * para obtener la cantidad disponible para disminución
   *
   * @readonly
   * @type {number}
   */
  get avalibleCant(): number {
    let total_refunded_cant = this.avalibleConcepts
      .reduce( ( acc, cur ) => { return acc + cur.cant }, 0 )
    let total_concepts_cant = this.details
      .reduce( ( acc, cur ) => { return acc + (cur.cant || 1) }, 0 )
    return total_concepts_cant - total_refunded_cant
  }



  /**
   * Lista de la disponibilidad de los conceptos en
   * valor y cantidad. Clasificados por UPC
   *
   * @readonly
   * @type {ConceptAvailability[]}
   */
  get avalibleConcepts(): ConceptAvailability[] {
    return this.details.map( concept => {
      let concept_related_documents = this.related_documents
        .filter( doc => doc.details.find( con => con.product.UPC === concept.product.UPC ) );
      let concept_instaces = concept_related_documents
        .map( instance => instance.details.find( con => con.product.UPC === concept.product.UPC )! );
      let concept_total_amount = concept_instaces
        .reduce( ( acc, cur ) => { return acc + cur.amount }, 0 )
      let concecpt_total_cant = concept_instaces
        .reduce( ( acc, cur ) => { return acc + ( cur.cant || 1 ) }, 0 )

      return {
        concept: concept.product.UPC,
        cant: (concept.cant || 1 ) - concecpt_total_cant,
        amount: concept.amount - concept_total_amount
      }
    })
  }



  /**
   * Estado de la factura, basado en los documentos relacionados.
   *
   * @readonly
   * @type {SaleInvoice.status}
   */
  get status(): SaleInvoice.status {
    if ( this.related_documents.length < 1 ) return 'current'
    else {
      if ( this.related_documents.some( doc => doc.context === 'anulacion' ) ) return 'canceled'
      else if ( this.related_documents.some( doc => doc.context === 'devolucion' ) ) {
        if ( this.avalibleCant > 0 ) return 'refunded'
        else return 'canceled'
      }
      else if ( this.related_documents.some( doc => doc.context === 'disminucion' ) ) {
        if ( this.avalibleAmount > 0 ) return 'decreased'
        else return 'canceled'
      }
      else return 'current'
    }
  }

}


export interface ConceptAvailability {
  concept: string,
  cant: number,
  amount: number
}

