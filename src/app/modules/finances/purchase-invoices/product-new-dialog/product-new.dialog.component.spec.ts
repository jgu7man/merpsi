import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNewDialogComponent } from './product-new.dialog.component';

describe('ProductNewComponent', () => {
  let component: ProductNewDialogComponent;
  let fixture: ComponentFixture<ProductNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductNewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
