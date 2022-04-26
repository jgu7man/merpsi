import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryFormComponent } from './product-category-form.component';

describe('ProductCategoryFormComponent', () => {
  let component: ProductCategoryFormComponent;
  let fixture: ComponentFixture<ProductCategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
