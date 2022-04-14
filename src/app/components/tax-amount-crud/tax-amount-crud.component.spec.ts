import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxAmountCrudComponent } from './tax-amount-crud.component';

describe('TaxesCrudComponent', () => {
  let component: TaxAmountCrudComponent;
  let fixture: ComponentFixture<TaxAmountCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxAmountCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxAmountCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
