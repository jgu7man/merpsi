import { BusinessModel, iBusiness, TAXPAYER_TYPE } from "./empresa.model";
import firebase from 'firebase/app'

export class QueryProvider {
  public CRF: string
  public country: string
  public name: string
  /**Razon social */
  public businessName: string
  public type: TAXPAYER_TYPE
  public businessRef?: firebase.firestore.DocumentReference<iBusiness>
  
  constructor (
    doc?: QueryProvider
  ) {
    this.CRF = doc?.CRF || ''
    this.country = doc?.country || ''
    this.name = doc?.name || ''
    this.businessName = doc?.businessName || ''
    this.type = doc?.type || 'natural'
    this.businessRef = doc?.businessRef || undefined

  }

  async get() {
    return <iProvider> {
      CRF: this.CRF,
      country: this.country,
      name: this.name,
      businessName: this.businessName,
      type: this.type,
      business: this.businessRef ? await this.getBusiness(this.businessRef) : undefined
    }
  }

  private async getBusiness( ref: firebase.firestore.DocumentReference<iBusiness> ) {
    let doc = await ref.get();
    console.log( doc.data() )
    return doc.data()
  }

}

export class ProviderModel {
    public registered: Date 
    constructor(
      /** Clave de Registro Fiscal */
      public CRF: string,
      public country: string,
      public name: string,
      /**Razon social */
      public businessName: string,
      public type: TAXPAYER_TYPE,
      public businessRef: firebase.firestore.DocumentReference | null
    ) {
        this.registered = new Date()
    }

}

export interface iProvider extends Omit< ProviderModel, 'businessRef'  >{
 business?: iBusiness
}