import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStoredFormComponent } from './product-stored-form.component';

describe('ProductStoredFormComponent', () => {
  let component: ProductStoredFormComponent;
  let fixture: ComponentFixture<ProductStoredFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStoredFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStoredFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
