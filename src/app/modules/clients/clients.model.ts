
export class ClientModel{
  public name?: string
  public cellphone?: string
  public email?: string
  /** Clave de Indentificacion Personal (cedula) */
  public cip?: string
  public facebookId?: string
  public attendedBy?: string
  registered: Date
  lastContact: Date
  id?: string 
  viewed: boolean
  tags: string[]
  constructor(
    client?: ClientModel
  ) {
    this.name = client?.name || ''
    this.cellphone = client?.cellphone || ''
    this.email = client?.email || ''
    this.cip = client?.cip || ''
    this.facebookId = client?.facebookId || ''
    //this.attendedBy= client?.attendedBy || ''
    this.id = client?.id || ''

    this.registered = new Date()
    this.lastContact = new Date()
    this.viewed = false
    this.tags = ['Nuevo']
  } 
  
}