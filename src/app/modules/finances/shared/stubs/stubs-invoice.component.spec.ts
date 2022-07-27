import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StubsInvoiceComponent } from './stubs-invoice.component';

describe('StubsInvoiceComponent', () => {
  let component: StubsInvoiceComponent;
  let fixture: ComponentFixture<StubsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StubsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StubsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
