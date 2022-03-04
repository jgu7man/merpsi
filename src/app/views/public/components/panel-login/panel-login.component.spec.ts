import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelLoginComponent } from './panel-login.component';

describe('PanelLoginComponent', () => {
  let component: PanelLoginComponent;
  let fixture: ComponentFixture<PanelLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
