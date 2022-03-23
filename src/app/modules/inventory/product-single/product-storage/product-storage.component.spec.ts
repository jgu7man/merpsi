import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStorageComponent } from './product-storage.component';

describe('ProductStoreFormComponent', () => {
  let component: ProductStorageComponent;
  let fixture: ComponentFixture<ProductStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
