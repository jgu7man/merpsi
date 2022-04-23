import { AbstractControl } from "@angular/forms";

export class ProductCategory {

  subcategories: ProductSubcategory.data[] = [];

  constructor (
    public readonly index: number,
    public name: string,
    public description?: string,
    subcategories?: ProductSubcategory.data[]
  ) { 
    this.subcategories = subcategories || [];
  }

}

export namespace ProductCategory {

  /* LIST */
  export type data = Omit<ProductCategory, 'index'>

  export interface list {
    list: ProductCategory[]
  }

  export interface form extends ProductCategory {
    value: ProductCategory.data
    controls: {
      name: AbstractControl,
      description: AbstractControl,
    }
  }

  /* SELECTOR */
  export interface item {
    label: string;
    data: any;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: ProductCategory.item[];
  }

  export interface selected {
    label: string;
    data: any;
    parent?: {
      data: any,
    }
  }

  /* ON PRODUCT */
  export interface ref {
    category: number,
    subcategories?: number[]
  }

}

export namespace ProductSubcategory {
  
  export type data = Omit<ProductCategory, 'subcategories'>
  
  export interface changes {
    value: ProductSubcategory.data,
    valid: boolean
  }
}