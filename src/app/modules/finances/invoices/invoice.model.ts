import { FireTime, FireRef } from "../../../models/firestore.model"
import { Product } from "../../inventory/products/products.model"
import { iSede } from "../../admin/stores/sede.model"
import { iAppliedTax } from "../taxes/taxes.model"
import { iManager } from "../../admin/managers/manager.model"
import { iProvider } from "../../inventory/providers/provider.model"
import { ClientModel } from "../../clients/clients.model"
// import { Client } from "../../clients/clients.model"


// export class InvoiceModel {
//   /** folio de la factura */
//   public invoice_ID: string = ''
//   /** fecha de la factura */
//   public document_date: FireTime = createDate( new Date() )
//   /** fecha de registro */
//   public readonly registered_date: FireTime = createDate( new Date() )
//   /** Sede donde se registrará la factura.
//    *
//    * *❗ Opcional en la creación, Requerida en la base de datos.*
//   */
//   public store?: Invoice.store
//   /** Lista de conceptos que incluirá la factura
//    *
//    * ❗ Opcional en la creación, Requerida en la base de datos.*
//   */
//   public details?: Invoice.concept[];
//   /** Cálculos de totales de la factura
//    *
//    * ❗ Opcional en la creación, Requerida en la base de datos.*
//   */
//   public footer?: Invoice.footer
//   /** metodos de pagos */
//   public payment_method: string = ''

//   constructor (
//     /** Manager que registró la factura */
//     public manager: Invoice.manager
//   ) {
//     this.invoice_ID = ''
//     this.document_date = createDate( new Date() )
//     this.details = []
//     this.footer = new InvoiceFooter()
//     this.payment_method = ''
//   }

//   get data(): Invoice.doc{
//     if ( !this.details ) throw new Error( 'No se encontraron conceptos' )
//     if ( !this.store ) throw new Error( 'No se encontró la sede' )
//     if ( !this.footer ) throw new Error( 'No se encontraron totales' )

//     return {
//       ...this,
//       details: this.details,
//       store: this.store,
//       footer: this.footer,
//     }
//   }


// }

export interface InvoiceModel {
  /** folio de la factura */
  invoiceId: string
  /** fecha de la factura */
  action_date: FireTime
  /** fecha de registro */
  registered_date: FireTime
  /** Lista de conceptos que incluirá la factura */
  details: Invoice.concept[];
  /** Cálculos de totales de la factura */
  footer: Invoice.footer
  /** Metodos de pagos */
  payment_method: string
  /** Tipo de moneda */
  currency: string
 /** usuario registrado*/
  manager: Invoice.manager
}


export class ProductInvoiceModel {
  /** Precio unitaio de venta */
  public unit_price: number = 0
  /** Costo unitario del producto comprado */
  public unit_cost: number = 0
  /** Cantidad de productos comprados */
  public cant?: number = 0
  public store: string | null
  product: Product.MainData 

  constructor (
    /** Referencia del producto comprado (Debe seleccionarse de la lista de productos registrados de la empresa) */
    product_doc: Product.DataReference,
    store: string | null,
    public stock: number = 0,
    public transfer_fee?: Invoice.concept.transfer | null,
  ) {
    this.store = store || null
    this.stock = stock || 0
    let {UPC, reference, description, brand, measure_unit} = product_doc
    this.product = {
      UPC,
      reference,
      description,
      brand: brand || '',
      measure_unit: measure_unit || 0,
    }
    this.transfer_fee = transfer_fee || null
  }

  

  /** Resultado de multiplicar cantidad por costo unitario del producto */
  get amount(): number {
    return this.unit_price * (this.cant || 1)
  }

  getdata(): Invoice.concept{
    delete this.transfer_fee
    let { getdata: concept, ...object } = this
    return {
      ...object,
      product: this.product,
      amount: this.amount
    }
  }
}


/** Modelo de consulta de balances de factura */
export class InvoiceFooter {
  /** Suma de los montos de los productos */
  subtotal: number = 0;
  /** Descuento aplicado a la compra en moneda */
  discount: number = 0;
  /** Lista de impuestos aplicados a la compra */
  taxes: iAppliedTax[] = [];
  /** Costo generado por envío */
  shipping: number = 0;
  /** Total acumulado de los impuestos aplicados */
  get taxesAmount(): number {
    return this.taxes.reduce((total, tax) => total + tax.amount, 0)
  }
  /** Total de restar descuentos e impuestos y agregado de costo de envío */
  get total(): number {
    return ( (this.subtotal + this.shipping) + this.taxesAmount) - this.discount
  }
  /** Extracción del modelo */
  getdata(): Invoice.footer {
    let {getdata, ...object} = this
    let taxes = this.taxes.map(tax =>{
      return {...tax}
    })
    return {...object, total: this.total, taxesAmount: this.taxesAmount, taxes: taxes}
  }

}


export declare namespace Invoice {

  interface doc extends Omit<InvoiceModel,
    'data' | 'footer'
  > {
    details: concept[],
    store: store,
    footer: footer
  }

  interface manager extends propertyRef{
    ref: FireRef<iManager>
  }

  interface propertyRef {
    id: string
    name: string
  }

  interface store extends propertyRef {
    ref: FireRef<iSede> | null // !!! FIX
  }

  interface provider extends propertyRef {
    ref: FireRef<iProvider> | null // !!! FIX
  }

  interface client extends propertyRef {
    cip:string
    //ref: FireRef<ClientModel>
  }

  interface concept extends Omit<ProductInvoiceModel, 'getdata'> { }

  namespace concept {
    interface transfer {
      store: store,
      fee: number
    }
  }

  interface footer extends Omit<InvoiceFooter, 'getdata' | 'data' | "amount_invoice">{}

}


