import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MxLoading } from 'libs/@marxa/devkit/loading/loading.service';
import { Subscription } from 'rxjs';
import { ProductCategoriesService } from '../product-categories.service';
import { ProductCategory } from '../product-category.model';

@Component({
  selector: 'app-product-category-selector',
  templateUrl: './product-category-selector.component.html',
  styleUrls: ['./product-category-selector.component.scss']
})
export class ProductCategorySelectorComponent implements OnInit, OnDestroy {

  @Input() value?: ProductCategory.selected[]
  public selectedCtrl: FormControl = new FormControl( null )
  @Output() valueChanged: EventEmitter<ProductCategory.selected[]> = new EventEmitter();
  private _changesSubscription: Subscription

  constructor (
    public categories: ProductCategoriesService,
  ) { 
    this._changesSubscription = this.selectedCtrl
      .valueChanges.subscribe( data => {
        this.valueChanged.emit( data )
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._changesSubscription.unsubscribe()
  }
  
  

}


