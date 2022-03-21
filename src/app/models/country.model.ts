export interface iCountry{
  /** Nombre del país */
  readonly name: string
  /** Código del país de 2 caracteres */
  readonly alpha2: string
  /** Código del país de 3 caracteres */
  readonly alpha3: string
  /** Bander en Base64 */
  readonly flag: string
  /** Código del idioma del país de 2 caracteres */
  readonly locale: string
  /** Código de zona telefónica */
  readonly code: string
  /** Tipo de moneda con sus características */
  readonly currency: iCurrency
  /** Formato de persona fiscal natural */
  readonly natural_format: iCrfFormat 
  /** Formato de persona fiscal legal (Empresa) */
  readonly legal_format: iCrfFormat
} 

export interface iCurrency{
  readonly code: string
  readonly name: string
  readonly symbol: string
           value?:number
}

export interface iCrfFormat{
  readonly format: string 
  readonly name: string
  readonly key_name: string
  readonly acronym: string
  readonly length: number
}