
export class ClientModel{
  registered: Date
  lastContact: Date
  //idCliente: string
  viewed: boolean
  tags: string[]
  constructor(
    public name: string,
    public cellphone: string,
    public city?: string,
    public email?: string,
    /** Clave de Indentificacion Personal (cedula) */
    public cip?: string,
    public facebookId?: string,
    public attendedBy?: string
  ) {
    this.city = this.city || '';
    this.email = this.email || '';
    this.cip = this.cip || '';
    this.facebookId = this.facebookId || '';
    this.attendedBy= this.attendedBy || '';

    this.registered = new Date()
    this.lastContact = new Date()
    //this.idCliente = firebase.firestore().collection( 'clientes' ).doc().id
    this.viewed = false
    this.tags = ['Nuevo']
  } 
}