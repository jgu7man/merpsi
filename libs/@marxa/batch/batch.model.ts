import firebase from 'firebase/app';

export interface MxBatchEvent {
  type: 'add' | 'delete' | 'update' | 'set'
  data: any
  ref: firebase.firestore.DocumentReference
}


/** Modelos para los errores
 * @class MxErrorAlertModel
 */
 export class MxBatchErrorModel {
  date: Date
  systemError: string
  constructor(
    public message: string,
    public description?: any,
    systemError?: any,
  )
  {
    this.description = (description instanceof Error) ?
      JSON.stringify(description) :
      description || ''
    this.systemError = (systemError instanceof Error) ?
      JSON.stringify( systemError || description ) : systemError || ''
    this.date = new Date()
   }
}
