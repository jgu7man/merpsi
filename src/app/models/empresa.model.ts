import firebase from 'firebase/app'
export class BusinessModel {
    /** Fecha en la que se registro la empresa */
    public registered: Date 

    constructor(
        /** Clave de Registro Fiscal */
        public CRF: string,
        public country: string,
        public name: string,
        /**Razon social */
        public businessName: string,
        public type: TAXPAYER_TYPE
    ) {
        this.registered = new Date()
    }

}

export interface iBusiness extends Omit<BusinessModel,'registered'>{
    readonly registered : firebase.firestore.Timestamp
    readonly CRF: string
}
/** Tipo de contribuyente */
export type TAXPAYER_TYPE = 'natural' | 'Jurídica'