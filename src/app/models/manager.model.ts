import firebase from 'firebase/app'

/** Usuarios que van a administrar/consumir el sistema */
export class ManagerModel {

  public registered: Date | firebase.firestore.Timestamp
  public lastAccess: Date | firebase.firestore.Timestamp
  public rol: ROLE
  
  constructor (
    public email: string,
    public name: string,
    /** ID otorgado por la autenticación de firebase */
    public uid: string,
    role?: ROLE
  ) {
    this.rol = role || 'propietario'
    this.lastAccess = new Date()
    this.registered = new Date()
  }

}

export interface iManagerRegist {
  email: string,
  name: string,
  password: string
}

export interface iManager extends ManagerModel {
  /** Sede - Almacen */
  store?: string
  photoURL?: string
  registered: firebase.firestore.Timestamp
}



export type ROLE = 'propietario' | 'administrador' | 'gerente' | 'asesor' | 'mecanico' | 'revoke'