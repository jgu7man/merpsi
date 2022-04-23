import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ProductCategoriesService } from '../product-categories.service';
import { ProductCategory, ProductSubcategory } from '../product-category.model';

@Component({
  selector: 'app-product-category-form',
  templateUrl: './product-category-form.component.html',
  styleUrls: ['./product-category-form.component.scss']
})
export class ProductCategoryFormComponent implements OnInit {

  private _value = new BehaviorSubject<ProductCategory | undefined>(undefined);
  @Input() set value(v: ProductCategory | undefined) { this._value.next(v); }
  get value() { return this._value.getValue()}
  private _valueSubs?: Subscription

  @Output() submited: EventEmitter<void> = new EventEmitter()
  subcategories: ProductSubcategory.data[] = []

  categoryForm: FormGroup = new FormGroup( {
    name: new FormControl( '', [ Validators.required ] ),
    description: new FormControl( '' ),
    subcategories: new FormArray( [] )
  });

  constructor (
    private _categories: ProductCategoriesService
  ) { }

  ngOnInit(): void {
    this._valueSubs = this._value
      .pipe(skip(1))
      .subscribe( () => {
        this.value
        if ( this.value ) {
          this.categoryForm.patchValue( {
            name: this.value.name,
            description: this.value.description
          } )
          
          this.subcategories = this.value.subcategories
        }
    })
  }

  onAddSubcategory() {
    this.subcategories.push( {
      index: this.subcategories.length,
      name: '',
      description: ''
    })
  }

  get subcategoriesCtrl() {
    return this.categoryForm.controls.subcategories as FormArray
  }

  onSubcategoryChanged( subcategory: FormGroup, index: number ) {
    let subcategoryChanged = this.subcategoriesCtrl.at( index )
    if ( !subcategoryChanged ) this.subcategoriesCtrl.insert( index, subcategory )
    else this.subcategoriesCtrl.controls[index] = subcategory
  }

  onRemoveSubcategory( index: number ) {
    this.subcategories.splice( index, 1 )
    this.subcategoriesCtrl.removeAt(index)
  }

  async onSave() {
    
    if ( this.value && this.value.index !== undefined ) {
      await this._categories.update( {
        ...this.value,
        ...this.categoryForm.value,
      })
    } else {
      await this._categories.add( {
        ...this.categoryForm.value,
      })
    }

    this.submited.emit()
  }


}
