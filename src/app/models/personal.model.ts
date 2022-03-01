import firebase from 'firebase/app'

export interface iUsuario {
  email: string,
  nombre: string,
  apellido: string,
  rol: ROL,
  sede?: string,
  password?: string,
}

export class UsuarioModel {

  public registered!: Date | firebase.firestore.Timestamp
  public email!: string
  public nombre!: string
  public apellido!: string
  public rol!: ROL
  public uid!: string
  public lastAccess!: Date | firebase.firestore.Timestamp
  public sede?: string
  public photoURL?: string
  public displayName?: string
  public password?: string

  constructor(
    userData: Partial<UsuarioModel>
  ) {
    Object.assign(this, userData);
    this.displayName = this.displayName || `${this.nombre} ${this.apellido || ''}`
    this.lastAccess = userData.lastAccess || new Date()
  }
}


export type ROL = 'administrador' | 'gerente' | 'asesor' | 'mecanico' | 'revoke'
