import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodesCrudComponent } from './qrcodes-crud.component';

describe('QrcodesCrudComponent', () => {
  let component: QrcodesCrudComponent;
  let fixture: ComponentFixture<QrcodesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
