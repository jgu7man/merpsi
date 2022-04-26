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

  export type asParent = Omit<ProductCategory, 'subcategories'>
  export type data = Omit<ProductCategory, 'index'>

  /* LIST */

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
  export interface treeItem {
    label: string;
    data: any;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: ProductCategory.treeItem[];
  }

  export interface tree {
    label: string;
    data: any;
    parent?: {
      data: any,
    }
  }

  /* ON PRODUCT */
  export type selected = asParent | ProductSubcategory.treeValue

}

export namespace ProductSubcategory {
  
  export interface data extends Omit<ProductCategory, 'subcategories'> {}
  
  export interface changes {
    value: ProductSubcategory.data,
    valid: boolean
  }

  export interface treeValue extends ProductSubcategory.data {
    parent: ProductCategory.asParent,
  }
}