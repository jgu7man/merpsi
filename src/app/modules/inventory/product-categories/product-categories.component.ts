import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MxCrudPanelColumns } from '@marxa/crud-panel';
import { TreeNode } from 'primeng/api';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategory } from './product-category.model';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent implements OnInit {

  readonly columns: MxCrudPanelColumns[] = [
    { id: 'name', displayName: 'Nombre' },
    { id: 'description', displayName: 'Descripción'}
  ]

  @ViewChild('formContainer') formContainer!: MatDrawer
  display: boolean = false
  categories!: TreeNode[] 
  selected?: ProductCategory

  constructor (
    public _categories: ProductCategoriesService
  ) { 
    this._categories.list$
      .subscribe( list => {
        this.categories = list.map( (category) => {
          return <TreeNode>{
            data: category,
            children: category.subcategories.map( data => {
              return <TreeNode>{ data }
            })
          }
        })
      })
  }

  ngOnInit(): void {
  }

  onSelect( selected: any ) {
    let parent = selected.parent
    this.selected = parent ? parent.data : selected.node.data
    this.formContainer.open()
  }

  onCloseFormContainer() {
    this.formContainer.close()
    if (this.selected) delete this.selected
  }

  onDelete( event: any, item: any ) {
    event.stopPropagation()
    let parentIndex = item.parent?.data.index
    let index = item.node.data.index
    this._categories.delete(index, parentIndex)
  }

}
