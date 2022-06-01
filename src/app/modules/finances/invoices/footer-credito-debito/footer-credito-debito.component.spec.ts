import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCreditoDebitoComponent } from './footer-credito-debito.component';

describe('FooterCreditoDebitoComponent', () => {
  let component: FooterCreditoDebitoComponent;
  let fixture: ComponentFixture<FooterCreditoDebitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterCreditoDebitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCreditoDebitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
