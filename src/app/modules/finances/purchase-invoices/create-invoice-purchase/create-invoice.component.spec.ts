import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderService } from 'src/app/modules/inventory/providers/provider.service';

import { CreateInvoiceComponent } from './create-invoice.component';

describe('CreateInvoiceComponent', () => {
  let component: CreateInvoiceComponent;
  let fixture: ComponentFixture<CreateInvoiceComponent>;
  let spyProvider: jasmine.SpyObj<ProviderService>;

  beforeEach( async () => {
    
    spyProvider = jasmine.createSpyObj<ProviderService>( 'ProviderService', [
      'getAll'  
    ] )
    
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
