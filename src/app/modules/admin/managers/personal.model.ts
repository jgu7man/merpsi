import firebase from 'firebase/app'

export interface iUser {
  email: string,
  name: string,
  lastName: string,
  role: ROL,
  store?: string,
  password?: string,
}

export class UserModel {

  public registered!: Date | firebase.firestore.Timestamp
  public email!: string
  public name!: string
  public lastName!: string
  public role!: ROL
  public uid!: string
  public lastAccess!: Date | firebase.firestore.Timestamp
  public store?: string
  public photoURL?: string
  public displayName?: string
  public password?: string

  constructor(
    userData: Partial<UserModel>
  ) {
    Object.assign(this, userData);
    this.displayName = this.displayName || `${this.name} ${this.lastName || ''}`
    this.lastAccess = userData.lastAccess || new Date()
  }
}


export type ROL = 'administrador' | 'gerente' | 'asesor' | 'mecanico' | 'revoke'
