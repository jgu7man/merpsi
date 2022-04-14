import { AbstractControl, FormGroup } from "@angular/forms"

/**
 * 
 * Modelo de unidad de medida de los productos de la empresa. 
 * Se almacen en array dentro de un documento ubicado en la siguiente ruta
 * @path businesses/{CRF}/config/mesure_units
 */
 export class MesureUnitModel {
  
  constructor (
    public readonly index: number,
    public name: string,
    public description?: string,
    public symbol?: string,
    public singular?: string,
    public plural?: string,
    public zero?: string,
  ) {
    this.singular = this.singular || this.name || ''
    this.plural = this.plural || this.singular || ''
    this.zero = this.zero || this.plural || ''
  }
   
   get value(): MesureUnit.data {
     return {
       name: this.name,
       description: this.description || '',
       symbol: this.symbol || '',
       singular: this.singular || this.name,
       plural: this.plural || `${ this.singular }s`,
       zero: this.zero || this.plural
     }
   }

   
}


export namespace MesureUnit {

  export type data = Omit<MesureUnitModel, 'index' | 'value'>

  export interface list {
    list: MesureUnitModel[]
  }
  
  export interface form extends FormGroup {
    value: MesureUnit.data,
    controls: {
      name: AbstractControl,
      description: AbstractControl,
      symbol: AbstractControl,
      singular: AbstractControl,
      plural: AbstractControl,
      zero: AbstractControl
    }
  }
  
  export interface changes {
    changes: MesureUnit.data,
    valid: boolean
  }


}

