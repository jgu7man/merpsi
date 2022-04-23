import { Component, OnInit } from '@angular/core';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { ProductCategoriesService } from '../product-categories.service';
import { ProductCategory } from '../product-category.model';

@Component({
  selector: 'app-product-category-selector',
  templateUrl: './product-category-selector.component.html',
  styleUrls: ['./product-category-selector.component.scss']
})
export class ProductCategorySelectorComponent implements OnInit {

  public categories: ProductCategory.item[] = [];
  public tree: any[] = []
  public selected: ProductCategory.ref[] = []

  constructor (
    private _categories: ProductCategoriesService,
    private _loading: MxLoading
  ) { 
    this._categories.list$.subscribe( list => {
      this.categories = list.map( c => {
        return <ProductCategory.item>{
          label: c.name,
          data: c,
          children: c.subcategories ? c.subcategories.map( s => {
            return <ProductCategory.item> {
              label: s.name,
              data: s
            }
          }) : undefined
        }
      })
    })
  }

  ngOnInit(): void {
  }

  async onChanges() {
    console.log( this.tree )
    this.selected =
      await this.extractTree( this.tree, 'category', 'subcategories', 'index' )
    console.log( this.selected )
  }

  async inserNodes(value: any[], parentName: string, childNode: string, selector: string ) {
    const treeResult: any[] = []
    await this._loading.asyncForEach( value, ( family ) => {
      
    })
  }
  
  async extractTree( tree: any[], parentName: string, childNode: string, selector: string ) {
    const treeResult: any[] = []
    
    await this._loading.asyncForEach( 
      tree, ( { data, parent, partialSelected } ) => { /* Se recorren los items del child */
        
        if ( parent ) { /* El item es child */

          /* Buscar index parent previamente guardado que coincida con el selector */
          let parentIndex = treeResult.findIndex( p => p[ parentName ][ selector ] === parent.data[ selector ] )
          if ( parentIndex >= 0 ) { /* El parent ya había sido registrado */
            
            if ( !treeResult[ parentIndex ][ childNode ] ) { /* El parent NO tiene child node */
              
              /* Se asigna el child node al parent */
              treeResult[ parentIndex ][ childNode ] = [ data ]

            } else { /* El parent SI tiene child node */
              
              /* Buscar el index del child en el array de childrens  */
              let childFound = treeResult[ parentIndex ][ childNode ].findIndex( ( c: any ) => c[ selector ] == data[ selector ] )

              /* Si el child no se encuentra se agrega al array de childrens */
              if ( childFound < 0 ) treeResult[ parentIndex ][ childNode ].push( data )
            }

          } else { /* El parent no había sido registrado previamente */
            
            /* Se registra el parent con el item como child */
            treeResult.push( {
              [ parentName ]: parent.data,
              [ childNode ]: [ data ]
            } )
          }

        } else if ( !parent && !partialSelected ) { /* No se sabe si es parent o child */
          
          /* Se busca el child en los parents previamente registrados */
          let isChild = treeResult.find( p => {
            return  p[ childNode ].find( ( c: any ) => c[ selector ] === data[ selector ] ) ? true : false
          } ) ? true : false
          
          if ( !isChild ) { /* Se seleccionó el parent completo */
            
            /* Se registra el parent con sus childrens  */
            treeResult.push( {
              [ parentName ]: data,
              [ childNode ]: data[childNode]
            })
          }
        } else { /* El item es parent */
          
          /* Se busca el parent para ver si está previamente registrado */
          let parentIndex = treeResult.findIndex( p => p[parentName][selector] === data[selector] )
          if ( parentIndex < 0 ) { /* El parent NO está previamente registrado */
            
            /* Se agrega el item como parent */
            treeResult.push( { [ parentName ]: data } )
          }
        }
    })
    
    return treeResult
    
  }

}


