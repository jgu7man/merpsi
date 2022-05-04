import { createDate, FireDoc, FireTime } from "src/app/models/firestore.model"

export class StubModel{
  starIndex: number
  endIndex: number 
  prefix: string 
  currentIndex: number
  name: string
  active: boolean
  created: FireTime = createDate(new Date())
  lastUpdated: FireTime = createDate(new Date())

  constructor(
    readonly index: number,
    data?: StubModel | iStub
  )
  {
    this.starIndex = data?.starIndex || 0;
    this.endIndex = data?.endIndex || 0;
    this.prefix = data?.prefix || '';
    this.currentIndex = data?.currentIndex || 0;
    this.name = data?.name || ''
    this.active = data?.active || false
  }


}

export interface iStub{
  starIndex: number
  endIndex: number 
  prefix: string 
  currentIndex: number
  name: string
  created: FireTime 
  lastUpdated: FireTime
  active: boolean
  index: number
}

export namespace Stub{
  
  export type data = Omit<StubModel, 'index'>

  export interface  list {
    list: iStub[]
  }
}
