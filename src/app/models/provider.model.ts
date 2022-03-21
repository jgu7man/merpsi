import { BusinessModel, iBusiness, TAXPAYER_TYPE } from "./empresa.model";
import firebase from 'firebase/app'


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

export interface iProvider extends Omit< ProviderModel, 'registered' >{
 
}