import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSubcategoryFormComponent } from './product-subcategory-form.component';

describe('ProductSubcategoryFormComponent', () => {
  let component: ProductSubcategoryFormComponent;
  let fixture: ComponentFixture<ProductSubcategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSubcategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSubcategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
