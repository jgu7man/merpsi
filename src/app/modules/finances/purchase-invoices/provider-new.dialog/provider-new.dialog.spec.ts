import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNewDialog } from './provider-new.dialog';

describe('ProviderNew.Dialog', () => {
  let component: ProviderNewDialog;
  let fixture: ComponentFixture<ProviderNewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderNewDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderNewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
