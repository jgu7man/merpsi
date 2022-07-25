import { iBusiness, TAXPAYER_TYPE } from "../../../models/empresa.model";
import firebase from 'firebase/app'
import { FireRef } from "../../../models/firestore.model";

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
    // console.log( doc.data() )
    return doc.data()
  }

}

export class ProviderModel {
    public registered: Date 
    /** Clave de Registro Fiscal */
    public CRF: string
    public country: string
    public name: string
    /**Razon social */
    public businessName: string
    public type?: TAXPAYER_TYPE
    public businessRef: FireRef<iBusiness> | null
    constructor(
      provider?: ProviderModel | iBusiness,
      businessRef?: FireRef<iBusiness> | null

    ) {
        this.registered = new Date()
        this.CRF = provider?.CRF || ''
        this.country = provider?.country || ''
        this.name = provider?.name || ''
        this.businessName = provider?.businessName || ''
        this.type = provider?.type || undefined
        this.businessRef = businessRef  || null
    }

}

export interface iProvider extends Omit< ProviderModel, 'businessRef'  >{
 business?: iBusiness
}