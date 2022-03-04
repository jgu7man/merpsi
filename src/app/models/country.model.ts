export interface iCountry{
  readonly name: string
  readonly alpha2: string
  readonly alpha3: string
  readonly flag: string
  readonly locale: string
  readonly code: string
  readonly currency: iCurrency
  readonly natural_format: iCrfFormat 
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