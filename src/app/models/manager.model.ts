import firebase from 'firebase/app'

export class ManagerModel {

  public registered: Date | firebase.firestore.Timestamp
  public lastAccess: Date | firebase.firestore.Timestamp
  public rol: ROL
  
  constructor (
    public email: string,
    public nombre: string,
    public uid: string,
    rol?: ROL
  ) {
    this.rol = rol || 'propietario'
    this.lastAccess = new Date()
    this.registered = new Date()
  }

}

export interface iManager extends ManagerModel {
  sede?: string
  photoURL?: string
  registered: firebase.firestore.Timestamp
}



export type ROL = 'propietario' | 'administrador' | 'gerente' | 'asesor' | 'mecanico' | 'revoke'