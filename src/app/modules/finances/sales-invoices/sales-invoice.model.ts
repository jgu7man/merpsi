import firebase from "firebase/app"
import { getCacheDataKey } from "libs/@marxa/devkit/cache/mx-cache.operators";
import { from, zip } from "rxjs";
import { createDate, FireRef, FireTime } from "src/app/models/firestore.model";
import { Product } from "../../inventory/products/products.model";
import { CreditNoteModel, iCreditNote, NoteCredit } from "../credit-note/creditNote.model";
import { iDebitNote, NoteDebit } from "../debit-note/debit-note.model";
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
    | 'modified' // factura con descuentos o aumentos
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

  public action_date: FireTime 
  public registered_date: FireTime 
  public details: Invoice.concept[]
  public invoiceId: string
  public client: Invoice.client
  public seller: string
  public currency: string
  public payment_method: string
  public manager: Invoice.manager
  public footer: Invoice.footer
  public action_date_formated: string


  /**
   * Lista de las notas de crédito relacionadas con esta factura
   *
   * @private
   * @type {iCreditNote[]}
   */
  private credit_notes: iCreditNote[] = []

  /**
   * Lista de las notas de débito relacionadas con esta factura
   *
   * @private
   * @type {iDebitNote[]}
   */
  private debit_notes: iDebitNote[] = []



  /* NOTE - No sé si esto va a funcionar a la hora del compilado.
  Si esto no es posible habrá que meter el CRF al constructor,
  Obtner el dato con MxCache desde el método de consulta de la
  colección de facturas. */
  // private CRF = getCacheDataKey('eid')

  constructor (
    data: iSalesInvoice,
    public CRF:string
  ) {
    this.details = data.details
    this.invoiceId = data.invoiceId
    this.client = data.client
    this.seller = data.seller
    this.currency = data.currency
    this.payment_method = data.payment_method
    this.manager = data.manager
    this.footer = data.footer
    this.action_date = data.action_date
    this.registered_date = data.registered_date
    this.action_date_formated = this.getAction_date_formated(data.action_date.seconds)
    this.getRelatedDocuments(this.invoiceId)
  }
    //!! Provicional, eliminar cuando se actualice el crud panel y pueda colocar pipes
    getAction_date_formated(date: number){
      let d = new Date( date * 1000)
      let month = d.getMonth() + 1
      return d.getDate() + '/' + month + '/' + d.getFullYear()
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

      firebase.firestore().collection( `businesses/${ this.CRF }/credit_notes` )
        .where( 'invoiceId', '==', id )
        .get().then( snapshot => {
          snapshot.forEach( doc => {
            this.credit_notes.push( doc.data() as iCreditNote )
          })
        } )

      firebase.firestore()
        .collection( `businesses/${ this.CRF }/debit_notes` )
        .where( 'invoiceId', '==', id )
        .get().then( snapshot => {
          snapshot.forEach( doc => {
            this.debit_notes.push( doc.data() as iDebitNote )
          })
        } )

    } catch (error: any) {
      console.log(error)

    }
  }

  /**
   * Documentos relacionados con esta factura
   * - CreditNotes
   * - DebitNotes
   *
   * @type {iCreditNote[]}
   */
  get related_documents(): ( iCreditNote | iDebitNote )[] {
    return [ ...this.credit_notes, ...this.debit_notes ]
      .sort( ( a, b ) => {
        return b.emition_date.seconds - a.emition_date.seconds
      })
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
    let related_credit_total = this.credit_notes
      .reduce( ( acc, cur ) => {
      return acc + cur.footer.total
      }, 0 )

    let related_debit_total = this.debit_notes
      .reduce( ( acc, cur ) => {
        return acc + cur.footer.total
      }, 0 )

    return this.footer.total + related_debit_total - related_credit_total
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
      let concept_related_debits = this.debit_notes
        .filter( doc => doc.details.find( con => con.product.UPC === concept.product.UPC ) )
      let concept_related_credits = this.credit_notes
        .filter( doc => doc.details.find( con => con.product.UPC === concept.product.UPC ) )

      // let concept_related_documents = this.related_documents
      //   .filter( doc => doc.details.find( con => con.product.UPC === concept.product.UPC ) );


      let debit_concept_instances = concept_related_debits
        .map( doc => doc.details.find( con => con.product.UPC === concept.product.UPC )! )
      let credit_concept_instances = concept_related_credits
        .map( doc => doc.details.find( con => con.product.UPC === concept.product.UPC )! )

      // let concept_instaces = concept_related_documents
      //   .map( instance => instance.details.find( con => con.product.UPC === concept.product.UPC )! );



      let debit_concept_total_amount = debit_concept_instances
        .reduce( ( acc, cur ) => { return acc + cur.amount }, 0 )
      let credit_concept_total_amount = credit_concept_instances
        .reduce( ( acc, cur ) => { return acc + cur.amount }, 0 )

      // let concept_total_amount = concept_instaces
      //   .reduce( ( acc, cur ) => { return acc + cur.amount }, 0 )



      let credit_concept_refounded_cant = concept_related_credits
        .filter( con => con.context === 'devolucion' )
        .map( doc => doc.details.find( con => con.product.UPC === concept.product.UPC )! )
        .reduce( ( acc, cur ) => { return acc + ( cur.cant || 1 ) }, 0 )
        

        let lastDocument: NoteCredit.concept[] | NoteDebit.concept[] = []
        if ( this.related_documents.length > 0 ) {
          lastDocument = this.related_documents[this.related_documents.length - 1]
          .details.filter( doc => doc.product.UPC === concept.product.UPC )
        }

      return {
        concept: concept.product,
        store: concept.store,
        cant: (concept.cant || 1 ) - credit_concept_refounded_cant,
        unit_price: lastDocument.length > 0 ? lastDocument[0].unit_price : concept.unit_price,
        amount: concept.amount - credit_concept_total_amount + debit_concept_total_amount
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
    else if ( this.credit_notes.some( doc => doc.context === 'anulacion' ) ) return 'canceled'
    else {
      // if (this.debit_notes.length > 0 && this.avalibleAmount > 0) return 'refunded'
      if ( this.credit_notes.some( doc => doc.context === 'devolucion' ) ) {
        if ( this.avalibleCant > 0 ) return 'refunded'
        else return 'canceled'
      }
      else {
        if ( this.avalibleAmount > 0 ) return 'modified'
        else return 'canceled'
      }
    }
  }


  /**
   * Fecha de emisión de la factura
   *
   * @readonly
   * @type {FireTime}
   */
  get lastModified(): FireTime {
    return this.related_documents[0].emition_date
  }

}


/**
 * Objeto descriptivo de la disponibilidad de un concepto dentro
 * de una factura consultada.
 *
 * @export
 * @interface ConceptAvailability
 */
export interface ConceptAvailability {
  concept: Product.MainData,
  store:string | null,
  cant: number,
  unit_price: number,
  amount: number
}

