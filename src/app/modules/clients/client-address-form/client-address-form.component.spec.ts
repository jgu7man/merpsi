import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddressFormComponent } from './client-address-form.component';

describe('ClientAddressFormComponent', () => {
  let component: ClientAddressFormComponent;
  let fixture: ComponentFixture<ClientAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAddressFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
