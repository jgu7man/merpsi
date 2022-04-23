import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { ProductCategory, ProductSubcategory } from '../product-category.model';

@Component({
  selector: 'app-product-subcategory-form',
  templateUrl: './product-subcategory-form.component.html',
  styleUrls: ['./product-subcategory-form.component.scss']
})
export class ProductSubcategoryFormComponent implements OnInit, OnDestroy {

  @Input() value?: ProductSubcategory.data
  @Output() changed = new EventEmitter <FormGroup>()
  private _formSubscription: Subscription

  subcategoryForm: FormGroup = new FormGroup( {
    name: new FormControl( '', [ Validators.required ] ),
    description: new FormControl( '' ),
    index: new FormControl( null ),
  });

  constructor () { 
    this._formSubscription = this.subcategoryForm
      .valueChanges.pipe( listenChanges( 500 ) )
      .subscribe( changes => {
        this.changed.emit( this.subcategoryForm )
      })
  }

  ngOnInit(): void {
    if (this.value) this.subcategoryForm.patchValue(this.value)
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe()
  }

}
