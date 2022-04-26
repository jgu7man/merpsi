import { Pipe, PipeTransform } from '@angular/core';
import { ProductCategory, ProductSubcategory } from './product-category.model';

@Pipe({
  name: 'subcategoryValue'
})
export class SubcategoryValuePipe implements PipeTransform {

  transform( value: ProductCategory, ...args: number[] ): ProductSubcategory.treeValue {
    let sIndex = args[ 0 ]
    let {subcategories, ...parent } = value
    let subCat = subcategories.find( s => s.index === sIndex )
    
    if ( !subCat ) throw console.error('No existe la subcategoría seleccionada');

    return { ...subCat, parent };
  }

}
